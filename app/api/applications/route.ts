import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";
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
        company: {
          include: {
            user: true,
          },
        },
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

    const existingApplication = await prisma.application.findUnique({
      where: {
        shiftId_officerId: {
          shiftId: data.shiftId,
          officerId: officer.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You already applied to this shift." },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        shiftId: data.shiftId,
        officerId: officer.id,
      },
    });

    const title = "New application received";
    const message = `${officer.firstName} ${officer.lastName} applied to ${shift.title}.`;

    await prisma.notification.create({
      data: {
        userId: shift.company.user.id,
        title,
        message,
      },
    });

    await sendNotificationEmail({
      to: shift.company.user.email,
      subject: title,
      message,
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Failed to apply to shift" },
      { status: 500 }
    );
  }
}