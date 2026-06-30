import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { validateCompanyApplicationRemoval } from "@/lib/company-application-remove";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { syncShiftFillStatus } from "@/lib/shift-fill-status";
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
      bucket: "application-remove",
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

    if (!actor || actor.role !== UserRole.COMPANY) {
      return NextResponse.json(
        { error: "Only company accounts can remove officers from shifts." },
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

    if (existing.shift.company.user.clerkId !== clerkUser.id) {
      return NextResponse.json(
        { error: "You can only remove officers from your own shifts." },
        { status: 403 }
      );
    }

    const removalCheck = validateCompanyApplicationRemoval({
      status: existing.status,
      shiftStatus: existing.shift.status,
      shiftEndTime: existing.shift.endTime,
    });

    if (!removalCheck.allowed) {
      return NextResponse.json(
        { error: removalCheck.message },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const application = await tx.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status: ApplicationStatus.REJECTED,
        },
      });

      await syncShiftFillStatus(tx, existing.shiftId);

      const title = "Removed from shift";
      const message = `You were removed from ${existing.shift.title}.`;

      await createNotificationWithEmail(tx, {
        userId: existing.officer.user.id,
        title,
        message,
        type: "assignment_removed",
        linkUrl: "/officer/applications",
      });

      return application;
    });

    return NextResponse.json(updatedApplication);
  } catch {
    return NextResponse.json(
      { error: "Failed to remove officer from shift" },
      { status: 500 }
    );
  }
}
