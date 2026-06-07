import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";
import {
  ApplicationStatus,
  ShiftStatus,
  UserRole,
} from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
          include: {
            user: true,
          },
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

      if (acceptedCount >= existing.shift.positionsNeeded) {
        return NextResponse.json(
          { error: "This shift is already filled." },
          { status: 400 }
        );
      }
    }

    const application = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
      },
      include: {
        shift: true,
        officer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (status === "ACCEPTED") {
      const title = "Application accepted";
      const message = `Your application for ${application.shift.title} was accepted.`;

      await prisma.notification.create({
        data: {
          userId: application.officer.user.id,
          title,
          message,
        },
      });

      await sendNotificationEmail({
        to: application.officer.user.email,
        subject: title,
        message,
      });

      const acceptedCount = await prisma.application.count({
        where: {
          shiftId: application.shiftId,
          status: ApplicationStatus.ACCEPTED,
        },
      });

      if (acceptedCount >= application.shift.positionsNeeded) {
        await prisma.shift.update({
          where: {
            id: application.shiftId,
          },
          data: {
            status: ShiftStatus.FILLED,
          },
        });
      }
    }

    if (status === "REJECTED") {
      const title = "Application rejected";
      const message = `Your application for ${application.shift.title} was rejected.`;

      await prisma.notification.create({
        data: {
          userId: application.officer.user.id,
          title,
          message,
        },
      });

      await sendNotificationEmail({
        to: application.officer.user.email,
        subject: title,
        message,
      });
    }

    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}