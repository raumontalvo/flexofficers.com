import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
      await prisma.notification.create({
        data: {
          userId: application.officer.user.id,
          title: "Application accepted",
          message: `Your application for ${application.shift.title} was accepted.`,
        },
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
      await prisma.notification.create({
        data: {
          userId: application.officer.user.id,
          title: "Application rejected",
          message: `Your application for ${application.shift.title} was rejected.`,
        },
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