import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  ApplicationStatus,
  ShiftStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import { officerProfileCompletionSelect } from "@/lib/officer-fields";
import { resolveSyncedPhotoUrl } from "@/lib/clerk-photo-sync";
import {
  isOfficerProfileComplete,
  OFFICER_PROFILE_APPLY_REQUIRED_MESSAGE,
} from "@/lib/officer-profile-completion";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "application-create",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const data = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    if (existingUser && existingUser.role !== UserRole.OFFICER) {
      return NextResponse.json(
        { error: "Only officer accounts can apply to shifts." },
        { status: 403 }
      );
    }

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
      },
      create: {
        clerkId: clerkUser.id,
        email,
        role: UserRole.OFFICER,
      },
    });

    const existingOfficer = await prisma.officer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        profilePhotoUrl: true,
      },
    });
    const profilePhotoUrl = resolveSyncedPhotoUrl(
      existingOfficer?.profilePhotoUrl,
      clerkUser.imageUrl
    );

    const officer = await prisma.officer.upsert({
      where: {
        userId: user.id,
      },
      update: {
        firstName: clerkUser.firstName ?? "Officer",
        lastName: clerkUser.lastName ?? "User",
        ...(profilePhotoUrl ? { profilePhotoUrl } : {}),
      },
      create: {
        userId: user.id,
        firstName: clerkUser.firstName ?? "Officer",
        lastName: clerkUser.lastName ?? "User",
        ...(profilePhotoUrl ? { profilePhotoUrl } : {}),
      },
      select: {
        id: true,
        ...officerProfileCompletionSelect,
      },
    });

    if (!isOfficerProfileComplete(officer)) {
      return NextResponse.json(
        { error: OFFICER_PROFILE_APPLY_REQUIRED_MESSAGE },
        { status: 400 }
      );
    }

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

    const officerName = `${clerkUser.firstName ?? "Officer"} ${clerkUser.lastName ?? "User"}`.trim();
    const title = "New application received";
    const message = `${officerName} applied to ${shift.title}.`;
    const companyRecipientUserId = shift.company.user.id;

    console.log("[application-create]", {
      companyRecipientUserId,
      companyUserEmail: shift.company.user.email,
      companyProfileEmail: shift.company.email ?? null,
    });

    await createNotificationWithEmail(prisma, {
      userId: companyRecipientUserId,
      title,
      message,
      type: "new_application",
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Failed to apply to shift" },
      { status: 500 }
    );
  }
}