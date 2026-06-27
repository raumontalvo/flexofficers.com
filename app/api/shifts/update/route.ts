import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseShiftPayload, type ShiftPayload } from "../validation";

type UpdateShiftPayload = ShiftPayload & {
  shiftId?: unknown;
};

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "shift-update",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = (await req.json()) as UpdateShiftPayload;
    const shiftId = typeof body.shiftId === "string" ? body.shiftId : "";

    if (!shiftId) {
      return NextResponse.json(
        { error: "shiftId is required" },
        { status: 400 }
      );
    }

    const parsed = parseShiftPayload(body);

    if ("errors" in parsed) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.errors,
        },
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
        title: parsed.data.title,
        description: parsed.data.description,
        location: parsed.data.location,
        city: parsed.data.city,
        state: parsed.data.state,
        hourlyRate: parsed.data.hourlyRate,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        workType: parsed.data.workType,
        shiftTimeType: parsed.data.shiftTimeType,
        armedRequirement: parsed.data.armedRequirement,
        requirements: parsed.data.requirements,
        otherRequirements: parsed.data.otherRequirements,
        specialRequirements: parsed.data.specialRequirements,
        reportingInstructions: parsed.data.reportingInstructions,
        positionsNeeded: parsed.data.positionsNeeded,
      },
    });

    return NextResponse.json(updatedShift);
  } catch {
    return NextResponse.json(
      { error: "Failed to update shift" },
      { status: 500 }
    );
  }
}
