import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ShiftPayload = {
  title?: unknown;
  description?: unknown;
  location?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  hourlyRate?: unknown;
  requiredLicense?: unknown;
  positionsNeeded?: unknown;
};

function parseShiftPayload(payload: ShiftPayload) {
  const errors: string[] = [];

  const title =
    typeof payload.title === "string" ? payload.title.trim() : "";
  if (!title) {
    errors.push("title is required");
  }

  const location =
    typeof payload.location === "string" ? payload.location.trim() : "";
  if (!location) {
    errors.push("location is required");
  }

  const requiredLicense =
    typeof payload.requiredLicense === "string"
      ? payload.requiredLicense.trim()
      : "";
  if (!requiredLicense) {
    errors.push("requiredLicense is required");
  }

  if (typeof payload.description !== "undefined" && typeof payload.description !== "string") {
    errors.push("description must be a string");
  }
  const description = typeof payload.description === "string" ? payload.description : undefined;

  const hourlyRate = Number(payload.hourlyRate);
  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    errors.push("hourlyRate must be a number greater than 0");
  }

  const positionsNeededRaw =
    typeof payload.positionsNeeded === "undefined" || payload.positionsNeeded === ""
      ? 1
      : Number(payload.positionsNeeded);

  if (!Number.isInteger(positionsNeededRaw) || positionsNeededRaw <= 0) {
    errors.push("positionsNeeded must be a positive integer");
  }

  const startTime = new Date(String(payload.startTime ?? ""));
  if (Number.isNaN(startTime.getTime())) {
    errors.push("startTime must be a valid date-time");
  }

  const endTime = new Date(String(payload.endTime ?? ""));
  if (Number.isNaN(endTime.getTime())) {
    errors.push("endTime must be a valid date-time");
  }

  if (!Number.isNaN(startTime.getTime()) && !Number.isNaN(endTime.getTime()) && endTime <= startTime) {
    errors.push("endTime must be after startTime");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      title,
      description,
      location,
      hourlyRate,
      startTime,
      endTime,
      requiredLicense,
      positionsNeeded: positionsNeededRaw,
    },
  };
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const shift = await prisma.shift.create({
      data: {
        companyId: company.id,
        title: parsed.data.title,
        description: parsed.data.description,
        location: parsed.data.location,
        hourlyRate: parsed.data.hourlyRate,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        requiredLicense: parsed.data.requiredLicense,
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