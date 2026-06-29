import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { validateApplicationDecisionTransition } from "./decision-rules";
import {
  ApplicationStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import { syncShiftFillStatus } from "@/lib/shift-fill-status";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "application-status-update",
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
        { error: "Only company accounts can update application status." },
        { status: 403 }
      );
    }

    const { applicationId, status } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    if (
      status !== ApplicationStatus.ACCEPTED &&
      status !== ApplicationStatus.REJECTED
    ) {
      return NextResponse.json(
        { error: "Invalid status. Allowed values: ACCEPTED, REJECTED." },
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
        { error: "You can only manage applications for your own shifts." },
        { status: 403 }
      );
    }

    if (existing.status !== ApplicationStatus.PENDING) {
      return NextResponse.json(
        { error: "Only pending applications can be updated." },
        { status: 400 }
      );
    }

    if (status === ApplicationStatus.ACCEPTED) {
      const acceptedCount = await prisma.application.count({
        where: {
          shiftId: existing.shiftId,
          status: ApplicationStatus.ACCEPTED,
        },
      });

      const transition = validateApplicationDecisionTransition({
        currentStatus: existing.status,
        nextStatus: status,
        acceptedCount,
        positionsNeeded: existing.shift.positionsNeeded,
      });

      if (!transition.allowed) {
        return NextResponse.json(
          { error: transition.message },
          { status: 400 }
        );
      }
    }

    const decisionResult = await prisma.$transaction(async (tx) => {
      const transactionalApplication = await tx.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          shift: true,
          officer: {
            select: officerWithUserSelect,
          },
        },
      });

      if (!transactionalApplication) {
        return {
          error: {
            status: 404,
            body: { error: "Application not found" },
          },
        };
      }

      if (transactionalApplication.status !== ApplicationStatus.PENDING) {
        const transition = validateApplicationDecisionTransition({
          currentStatus: transactionalApplication.status,
          nextStatus: status,
          acceptedCount: 0,
          positionsNeeded: transactionalApplication.shift.positionsNeeded,
        });

        return {
          error: {
            status: 400,
            body: { error: transition.message },
          },
        };
      }

      if (status === ApplicationStatus.ACCEPTED) {
        const acceptedCount = await tx.application.count({
          where: {
            shiftId: transactionalApplication.shiftId,
            status: ApplicationStatus.ACCEPTED,
          },
        });

        const transition = validateApplicationDecisionTransition({
          currentStatus: transactionalApplication.status,
          nextStatus: status,
          acceptedCount,
          positionsNeeded: transactionalApplication.shift.positionsNeeded,
        });

        if (!transition.allowed) {
          return {
            error: {
              status: 400,
              body: { error: transition.message },
            },
          };
        }
      }

      const updatedApplication = await tx.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
        include: {
          shift: true,
          officer: {
            select: officerWithUserSelect,
          },
        },
      });

      let shiftFilled = false;

      if (status === ApplicationStatus.ACCEPTED) {
        const acceptedCount = await tx.application.count({
          where: {
            shiftId: updatedApplication.shiftId,
            status: ApplicationStatus.ACCEPTED,
          },
        });

        if (acceptedCount >= updatedApplication.shift.positionsNeeded) {
          shiftFilled = true;
        }
      }

      await syncShiftFillStatus(tx, updatedApplication.shiftId);

      if (status === ApplicationStatus.ACCEPTED) {
        const title = "Application accepted";
        const message = `Your application for ${updatedApplication.shift.title} was accepted.`;

        await createNotificationWithEmail(tx, {
          userId: updatedApplication.officer.user.id,
          title,
          message,
          type: "application_accepted",
        });
      }

      if (status === ApplicationStatus.REJECTED) {
        const title = "Application rejected";
        const message = `Your application for ${updatedApplication.shift.title} was rejected.`;

        await createNotificationWithEmail(tx, {
          userId: updatedApplication.officer.user.id,
          title,
          message,
          type: "application_rejected",
        });
      }

      return {
        application: updatedApplication,
        shiftFilled,
      };
    });

    if (decisionResult.error) {
      return NextResponse.json(decisionResult.error.body, {
        status: decisionResult.error.status,
      });
    }

    return NextResponse.json(decisionResult.application);
  } catch {
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}