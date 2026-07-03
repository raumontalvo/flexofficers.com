import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { buildClockOutNotificationMessage } from "@/lib/attendance";
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

    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        clockOutAt,
        ...coordinates,
      },
    });

    const officerName =
      `${existing.officer.firstName} ${existing.officer.lastName}`.trim();

    await createNotificationWithEmail(prisma, {
      userId: existing.shift.company.user.id,
      title: "Officer Clocked Out",
      message: buildClockOutNotificationMessage({
        officerName,
        shiftTitle: existing.shift.title,
        clockInAt,
        clockOutAt,
      }),
      type: "officer_clocked_out",
      linkUrl: "/company/shifts",
    });

    return NextResponse.json(updatedApplication);
  } catch {
    return NextResponse.json({ error: "Failed to clock out" }, { status: 500 });
  }
}
