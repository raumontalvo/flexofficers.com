import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  ApplicationStatus,
  ShiftStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import { buildClockOutNotificationMessage } from "@/lib/attendance";
import {
  appendAttendanceNotificationLink,
  buildCompanyAttendanceRosterHref,
} from "@/lib/company-attendance-notification-link";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { validateClockOutRequest } from "./rules";

type ClockOutPayload = {
  applicationId?: unknown;
  latitude?: unknown;
  longitude?: unknown;
};

function parseCoordinates(latitude: unknown, longitude: unknown) {
  const parsedLatitude =
    typeof latitude === "number" && Number.isFinite(latitude)
      ? latitude
      : null;
  const parsedLongitude =
    typeof longitude === "number" && Number.isFinite(longitude)
      ? longitude
      : null;

  if (parsedLatitude === null || parsedLongitude === null) {
    return {
      clockOutLatitude: null,
      clockOutLongitude: null,
    };
  }

  return {
    clockOutLatitude: parsedLatitude,
    clockOutLongitude: parsedLongitude,
  };
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "application-clock-out",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const actor = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    if (!actor || actor.role !== UserRole.OFFICER) {
      return NextResponse.json(
        { error: "Only officer accounts can clock out." },
        { status: 403 }
      );
    }

    const body = (await req.json()) as ClockOutPayload;
    const applicationId =
      typeof body.applicationId === "string" ? body.applicationId : "";

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        shift: {
          include: {
            company: {
              include: {
                user: true,
              },
            },
          },
        },
        officer: {
          select: officerWithUserSelect,
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (existing.officer.user.clerkId !== clerkUser.id) {
      return NextResponse.json(
        { error: "You can only clock out of your own assignments." },
        { status: 403 }
      );
    }

  const validation = validateClockOutRequest(existing);

  if (!validation.allowed) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const clockInAt = existing.clockInAt;

  if (!clockInAt) {
    return NextResponse.json(
      { error: "You must clock in before clocking out." },
      { status: 400 }
    );
  }

    const coordinates = parseCoordinates(body.latitude, body.longitude);
    const clockOutAt = new Date();

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const application = await tx.application.update({
        where: {
          id: applicationId,
        },
        data: {
          clockOutAt,
          ...coordinates,
        },
      });

      // Once every accepted officer for this shift has completed their
      // attendance (clocked in and out), persist the shift as COMPLETED. This
      // keeps the shift out of open/available shifts permanently and blocks it
      // from being cancelled — completed shifts can never revert to open.
      const acceptedApplications = await tx.application.findMany({
        where: {
          shiftId: existing.shiftId,
          status: ApplicationStatus.ACCEPTED,
        },
        select: {
          clockInAt: true,
          clockOutAt: true,
        },
      });

      const allAcceptedCompleted =
        acceptedApplications.length > 0 &&
        acceptedApplications.every(
          (record) => Boolean(record.clockInAt) && Boolean(record.clockOutAt)
        );

      if (
        allAcceptedCompleted &&
        existing.shift.status !== ShiftStatus.CANCELLED &&
        existing.shift.status !== ShiftStatus.COMPLETED
      ) {
        await tx.shift.update({
          where: {
            id: existing.shiftId,
          },
          data: {
            status: ShiftStatus.COMPLETED,
          },
        });
      }

      return application;
    });

    const officerName =
      `${existing.officer.firstName} ${existing.officer.lastName}`.trim();

    await createNotificationWithEmail(prisma, {
      userId: existing.shift.company.user.id,
      title: "Officer Clocked Out",
      message: appendAttendanceNotificationLink(
        buildClockOutNotificationMessage({
          officerName,
          shiftTitle: existing.shift.title,
          clockInAt,
          clockOutAt,
        }),
        existing.shiftId,
        existing.officerId
      ),
      type: "officer_clocked_out",
      linkUrl: buildCompanyAttendanceRosterHref(
        existing.shiftId,
        existing.officerId
      ),
    });

    return NextResponse.json(updatedApplication);
  } catch {
    return NextResponse.json({ error: "Failed to clock out" }, { status: 500 });
  }
}
