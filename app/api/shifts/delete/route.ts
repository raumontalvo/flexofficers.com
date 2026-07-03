import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { isShiftAttendanceCompleted } from "@/lib/company-dashboard-data";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "shift-delete",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { shiftId } = await req.json();

    if (!shiftId) {
      return NextResponse.json({ error: "Shift ID is required" }, { status: 400 });
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
          select: {
            status: true,
            clockInAt: true,
            clockOutAt: true,
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

    // Only completed shifts may be manually deleted. Completion is either the
    // stored status or derived from every accepted officer having clocked out.
    const isCompleted =
      shift.status === ShiftStatus.COMPLETED ||
      isShiftAttendanceCompleted(shift);

    if (!isCompleted) {
      return NextResponse.json(
        { error: "Only completed shifts can be deleted." },
        { status: 400 }
      );
    }

    await prisma.shift.delete({
      where: {
        id: shift.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete shift" },
      { status: 500 }
    );
  }
}