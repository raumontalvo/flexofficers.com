import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShiftStatus } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    await prisma.notification.createMany({
      data: shift.applications.map((application) => ({
        userId: application.officer.user.id,
        title: "Shift cancelled",
        message: `The shift "${shift.title}" was cancelled by the company.`,
      })),
    });

    return NextResponse.json(updatedShift);
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel shift" },
      { status: 500 }
    );
  }
}