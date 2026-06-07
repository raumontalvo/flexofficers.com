import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const { applicationId, status } = await req.json();

    const application = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: status as ApplicationStatus,
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