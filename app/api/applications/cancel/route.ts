import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { syncShiftFillStatus } from "@/lib/shift-fill-status";
import { validateApplicationCancellation } from "./rules";
import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "application-cancel",
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
        { error: "Only officer accounts can cancel assignments." },
        { status: 403 }
      );
    }

    const { applicationId } = await req.json();

    if (!applicationId || typeof applicationId !== "string") {
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
        { error: "You can only cancel your own assignments." },
        { status: 403 }
      );
    }

    const cancellationCheck = validateApplicationCancellation({
      status: existing.status,
      shiftStatus: existing.shift.status,
      shiftEndTime: existing.shift.endTime,
    });

    if (!cancellationCheck.allowed) {
      return NextResponse.json(
        { error: cancellationCheck.message },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const application = await tx.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status: ApplicationStatus.WITHDRAWN,
        },
      });

      await syncShiftFillStatus(tx, existing.shiftId);

      return application;
    });

    const officerName =
      `${existing.officer.firstName} ${existing.officer.lastName}`.trim();
    const title = "Officer cancelled assignment";
    const message = `${officerName} cancelled their assignment for ${existing.shift.title}.`;

    await createNotificationWithEmail(prisma, {
      userId: existing.shift.company.user.id,
      title,
      message,
      type: "application_withdrawn",
      linkUrl: "/company/applications",
    });

    return NextResponse.json(updatedApplication);
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel assignment" },
      { status: 500 }
    );
  }
}
