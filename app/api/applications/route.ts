import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ApplicationStatus,
  ShiftStatus,
  UserRole,
} from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const data = await req.json();

    const shift = await prisma.shift.findUnique({
      where: {
        id: data.shiftId,
      },
      include: {
        applications: {
          where: {
            status: ApplicationStatus.ACCEPTED,
          },
        },
      },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    if (shift.status !== ShiftStatus.OPEN) {
      return NextResponse.json(
        { error: "This shift is no longer open" },
        { status: 400 }
      );
    }

    if (shift.applications.length >= shift.positionsNeeded) {
      return NextResponse.json(
        { error: "This shift is already filled" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: {
        clerkId: clerkUser.id,
      },
      update: {
        email,
        role: UserRole.OFFICER,
      },
      create: {
        clerkId: clerkUser.id,
        email,
        role: UserRole.OFFICER,
      },
    });

    const officer = await prisma.officer.upsert({
      where: {
        userId: user.id,
      },
      update: {
        firstName: clerkUser.firstName ?? "Officer",
        lastName: clerkUser.lastName ?? "User",
      },
      create: {
        userId: user.id,
        firstName: clerkUser.firstName ?? "Officer",
        lastName: clerkUser.lastName ?? "User",
      },
    });

    const application = await prisma.application.create({
      data: {
        shiftId: data.shiftId,
        officerId: officer.id,
      },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Failed to apply to shift" },
      { status: 500 }
    );
  }
}