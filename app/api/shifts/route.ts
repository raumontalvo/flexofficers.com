import { randomUUID } from "node:crypto";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canCompanyPostNewShifts, getCompanyPostingBlockMessage } from "@/lib/company-access";
import {
  buildRecurringOccurrences,
  MAX_RECURRING_OCCURRENCES,
  parseRecurringShiftPayload,
  recurringPayloadToConfig,
} from "@/lib/recurring-shifts";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseShiftPayload, type ShiftPayload } from "./validation";

type CreateShiftRequestBody = ShiftPayload & {
  recurring?: unknown;
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
      bucket: "shift-create",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = (await req.json()) as CreateShiftRequestBody;
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

    const recurringParsed = parseRecurringShiftPayload(body.recurring);

    if (recurringParsed.enabled && "errors" in recurringParsed) {
      return NextResponse.json(
        {
          error: "Invalid recurring shift configuration",
          details: recurringParsed.errors,
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

    const shiftData = {
      companyId: company.id,
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      city: parsed.data.city,
      state: parsed.data.state,
      hourlyRate: parsed.data.hourlyRate,
      workType: parsed.data.workType,
      shiftTimeType: parsed.data.shiftTimeType,
      armedRequirement: parsed.data.armedRequirement,
      requirements: parsed.data.requirements,
      otherRequirements: parsed.data.otherRequirements,
      specialRequirements: parsed.data.specialRequirements,
      reportingInstructions: parsed.data.reportingInstructions,
      positionsNeeded: parsed.data.positionsNeeded,
      visibility: parsed.data.visibility,
    };

    if (!recurringParsed.enabled) {
      const shift = await prisma.shift.create({
        data: {
          ...shiftData,
          startTime: parsed.data.startTime,
          endTime: parsed.data.endTime,
        },
      });

      return NextResponse.json(shift);
    }

    const recurringConfig = recurringPayloadToConfig(recurringParsed.data);
    const occurrences = buildRecurringOccurrences(
      parsed.data.startTime,
      parsed.data.endTime,
      recurringConfig
    );

    if (occurrences.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid recurring shift configuration",
          details: ["No recurring shift occurrences matched the selected schedule."],
        },
        { status: 400 }
      );
    }

    if (occurrences.length > MAX_RECURRING_OCCURRENCES) {
      return NextResponse.json(
        {
          error: "Invalid recurring shift configuration",
          details: [
            `Recurring schedules are limited to ${MAX_RECURRING_OCCURRENCES} shifts.`,
          ],
        },
        { status: 400 }
      );
    }

    const recurringScheduleId = randomUUID();
    const shifts = await prisma.$transaction(
      occurrences.map((occurrence) =>
        prisma.shift.create({
          data: {
            ...shiftData,
            startTime: occurrence.startTime,
            endTime: occurrence.endTime,
            recurringScheduleId,
          },
        })
      )
    );

    return NextResponse.json({
      recurringScheduleId,
      count: shifts.length,
      shifts,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}
