import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canCompanyPostNewShifts, getCompanyPostingBlockMessage } from "@/lib/company-access";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseShiftPayload, type ShiftPayload } from "./validation";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "shift-create",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = (await req.json()) as ShiftPayload;
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

    const company = await prisma.company.findFirst({
      where: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company profile not found. Save company profile first." },
        { status: 400 }
      );
    }

    if (!canCompanyPostNewShifts(company)) {
      return NextResponse.json(
        {
          error:
            getCompanyPostingBlockMessage(company) ??
            "An active subscription or trial is required to post new shifts.",
        },
        { status: 403 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        companyId: company.id,
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

    return NextResponse.json(shift);
  } catch {
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}