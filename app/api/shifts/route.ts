import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

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
        title: data.title,
        description: data.description,
        location: data.location,
        hourlyRate: Number(data.hourlyRate),
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