import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ShiftStatus } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "shift-cancel",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { shiftId } = await req.json();

    if (!shiftId) {
      return NextResponse.json(
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.findFirst({
      where: {
        id: shiftId,
        company: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      },
      include: {
        applications: {
          include: {
            officer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!shift) {
      return NextResponse.json(
        { error: "Shift not found or you do not own this shift" },
        { status: 404 }
      );
    }

    const updatedShift = await prisma.shift.update({
      where: {
        id: shift.id,
      },
      data: {
        status: ShiftStatus.CANCELLED,
      },
    });

    const title = "Shift cancelled";
    const message = `The shift "${shift.title}" was cancelled by the company.`;

    await prisma.notification.createMany({
      data: shift.applications.map((application) => ({
        userId: application.officer.user.id,
        title,
        message,
      })),
    });

    await Promise.all(
      shift.applications.map(async (application) => {
        try {
          await sendNotificationEmail({
            to: application.officer.user.email,
            subject: title,
            message,
          });
        } catch (error) {
          console.error("Failed to send shift cancellation email", {
            shiftId: shift.id,
            officerUserId: application.officer.user.id,
            error,
          });
        }
      })
    );

    return NextResponse.json(updatedShift);
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel shift" },
      { status: 500 }
    );
  }
}