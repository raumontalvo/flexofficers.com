import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import { buildCompanyInviteResponseNotification } from "@/lib/company-invite-workflow";
import {
  canAcceptInvite,
  inviteStatusForResponse,
  validateInviteResponseTransition,
} from "@/lib/invite-respond-rules";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { syncShiftFillStatus } from "@/lib/shift-fill-status";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "invite-respond",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const actor = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      include: {
        officer: true,
      },
    });

    if (!actor || actor.role !== UserRole.OFFICER || !actor.officer) {
      return NextResponse.json(
        { error: "Only officer accounts can respond to invites." },
        { status: 403 }
      );
    }

    const { inviteId, response } = await req.json();

    if (!inviteId) {
      return NextResponse.json({ error: "inviteId is required." }, { status: 400 });
    }

    if (response !== "accept" && response !== "decline") {
      return NextResponse.json(
        { error: "Invalid response. Allowed values: accept, decline." },
        { status: 400 }
      );
    }

    const existingInvite = await prisma.shiftInvite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        shift: true,
        officer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!existingInvite) {
      return NextResponse.json({ error: "Invite not found." }, { status: 404 });
    }

    if (existingInvite.officerId !== actor.officer.id) {
      return NextResponse.json(
        { error: "You can only respond to your own invites." },
        { status: 403 }
      );
    }

    const pendingTransition = validateInviteResponseTransition({
      currentStatus: existingInvite.status,
      response,
    });

    if (!pendingTransition.allowed) {
      return NextResponse.json(
        { error: pendingTransition.message },
        { status: 400 }
      );
    }

    const nextStatus = inviteStatusForResponse(response);
    const officerName =
      `${existingInvite.officer.firstName} ${existingInvite.officer.lastName}`.trim();

    const result = await prisma.$transaction(async (tx) => {
      const invite = await tx.shiftInvite.findUnique({
        where: {
          id: inviteId,
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
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!invite || invite.officerId !== actor.officer!.id) {
        return {
          error: {
            status: 404,
            body: { error: "Invite not found." },
          },
        };
      }

      const currentTransition = validateInviteResponseTransition({
        currentStatus: invite.status,
        response,
      });

      if (!currentTransition.allowed) {
        return {
          error: {
            status: 400,
            body: { error: currentTransition.message },
          },
        };
      }

      if (response === "accept") {
        const acceptedCount = await tx.application.count({
          where: {
            shiftId: invite.shiftId,
            status: ApplicationStatus.ACCEPTED,
          },
        });

        const existingApplication = await tx.application.findUnique({
          where: {
            shiftId_officerId: {
              shiftId: invite.shiftId,
              officerId: invite.officerId,
            },
          },
        });

        const acceptance = canAcceptInvite({
          acceptedCount,
          positionsNeeded: invite.shift.positionsNeeded,
          existingApplicationStatus: existingApplication?.status ?? null,
        });

        if (!acceptance.allowed) {
          return {
            error: {
              status: 400,
              body: { error: acceptance.message },
            },
          };
        }

        await tx.application.upsert({
          where: {
            shiftId_officerId: {
              shiftId: invite.shiftId,
              officerId: invite.officerId,
            },
          },
          update: {
            status: ApplicationStatus.ACCEPTED,
          },
          create: {
            shiftId: invite.shiftId,
            officerId: invite.officerId,
            status: ApplicationStatus.ACCEPTED,
          },
        });
      }

      const updatedInvite = await tx.shiftInvite.update({
        where: {
          id: inviteId,
        },
        data: {
          status: nextStatus,
          respondedAt: new Date(),
        },
      });

      await syncShiftFillStatus(tx, invite.shiftId);

      const companyNotification = buildCompanyInviteResponseNotification({
        officerName,
        shiftTitle: invite.shift.title,
        response,
      });

      await tx.notification.create({
        data: {
          userId: invite.shift.company.user.id,
          title: companyNotification.title,
          message: companyNotification.message,
        },
      });

      return {
        invite: updatedInvite,
      };
    });

    if (result.error) {
      return NextResponse.json(result.error.body, {
        status: result.error.status,
      });
    }

    return NextResponse.json(result.invite);
  } catch {
    return NextResponse.json(
      { error: "Failed to respond to invite." },
      { status: 500 }
    );
  }
}
