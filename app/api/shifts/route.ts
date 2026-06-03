import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const shift = await prisma.shift.create({
      data: {
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        location: data.location,
        hourlyRate: data.hourlyRate,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        requiredLicense: data.requiredLicense,
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}