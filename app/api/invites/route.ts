import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ApplicationStatus, ShiftVisibility, UserRole } from "@/app/generated/prisma/enums";
import { buildOfficerInviteNotificationMessage } from "@/lib/company-invite-workflow";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  isInviteableShiftStatus,
  syncShiftFillStatus,
} from "@/lib/shift-fill-status";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "invite-create",
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
        { error: "Only company accounts can invite officers." },
        { status: 403 }
      );
    }

    const { shiftId, officerId, message } = await req.json();

    if (!shiftId || !officerId) {
      return NextResponse.json(
        { error: "shiftId and officerId are required." },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.findUnique({
      where: {
        id: shiftId,
      },
      include: {
        company: {
          include: {
            user: true,
          },
        },
        applications: {
          where: {
            status: ApplicationStatus.ACCEPTED,
          },
        },
      },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found." }, { status: 404 });
    }

    if (shift.company.user.clerkId !== clerkUser.id) {
      return NextResponse.json(
        { error: "You can only invite officers to your own shifts." },
        { status: 403 }
      );
    }

    if (!isInviteableShiftStatus(shift.status)) {
      return NextResponse.json(
        { error: "This shift is no longer accepting invites." },
        { status: 400 }
      );
    }

    if (shift.applications.length >= shift.positionsNeeded) {
      return NextResponse.json(
        { error: "This shift is already filled." },
        { status: 400 }
      );
    }

    const officer = await prisma.officer.findUnique({
      where: {
        id: officerId,
      },
      include: {
        user: true,
      },
    });

    if (!officer) {
      return NextResponse.json({ error: "Officer not found." }, { status: 404 });
    }

    if (shift.visibility === ShiftVisibility.STAFF_ONLY) {
      const staffMember = await prisma.companyStaff.findUnique({
        where: {
          companyId_officerId: {
            companyId: shift.companyId,
            officerId,
          },
        },
      });

      if (!staffMember) {
        return NextResponse.json(
          {
            error:
              "Only officers on your staff can be invited to private staff shifts.",
          },
          { status: 400 }
        );
      }
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        shiftId_officerId: {
          shiftId,
          officerId,
        },
      },
    });

    if (existingApplication?.status === ApplicationStatus.ACCEPTED) {
      return NextResponse.json(
        { error: "This officer is already assigned to the shift." },
        { status: 400 }
      );
    }

    const existingInvite = await prisma.shiftInvite.findUnique({
      where: {
        shiftId_officerId: {
          shiftId,
          officerId,
        },
      },
    });

    if (existingInvite?.status === "PENDING") {
      return NextResponse.json(
        { error: "This officer already has a pending invite for this shift." },
        { status: 400 }
      );
    }

    if (existingInvite?.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "This officer already accepted an invite for this shift." },
        { status: 400 }
      );
    }

    const invite = await prisma.$transaction(async (tx) => {
      const nextInvite = existingInvite
        ? await tx.shiftInvite.update({
            where: {
              id: existingInvite.id,
            },
            data: {
              status: "PENDING",
              message: typeof message === "string" ? message.trim() || null : null,
              invitedAt: new Date(),
              respondedAt: null,
            },
          })
        : await tx.shiftInvite.create({
            data: {
              shiftId,
              officerId,
              message: typeof message === "string" ? message.trim() || null : null,
            },
          });

      await tx.notification.create({
        data: {
          userId: officer.user.id,
          title: "New Company Invite",
          message: buildOfficerInviteNotificationMessage({
            companyName: shift.company.companyName,
            shiftTitle: shift.title,
            message: nextInvite.message,
          }),
        },
      });

      await syncShiftFillStatus(tx, shiftId);

      return nextInvite;
    });

    return NextResponse.json(invite);
  } catch {
    return NextResponse.json(
      { error: "Failed to create invite." },
      { status: 500 }
    );
  }
}
