import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const user = await prisma.user.upsert({
      where: {
        clerkId: "test-officer-user",
      },
      update: {
        email: "test-officer@flexofficers.com",
        role: UserRole.OFFICER,
      },
      create: {
        clerkId: "test-officer-user",
        email: "test-officer@flexofficers.com",
        role: UserRole.OFFICER,
      },
    });

    const officer = await prisma.officer.upsert({
      where: {
        userId: user.id,
      },
      update: {
        firstName: "Test",
        lastName: "Officer",
        city: "Fort Myers",
        state: "FL",
      },
      create: {
        userId: user.id,
        firstName: "Test",
        lastName: "Officer",
        city: "Fort Myers",
        state: "FL",
      },
    });

    const application = await prisma.application.create({
      data: {
        shiftId: data.shiftId,
        officerId: officer.id,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to apply to shift" },
      { status: 500 }
    );
  }
}