import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { validateApplicationWithdrawal } from "./rules";
import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "application-withdraw",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const actor = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    if (!actor || actor.role !== UserRole.OFFICER) {
      return NextResponse.json(
        { error: "Only officer accounts can withdraw applications." },
        { status: 403 }
      );
    }

    const { applicationId } = await req.json();

    if (!applicationId || typeof applicationId !== "string") {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        shift: {
          include: {
            company: {
              include: {
                user: true,
              },
            },
          },
        },
        officer: {
          select: officerWithUserSelect,
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (existing.officer.user.clerkId !== clerkUser.id) {
      return NextResponse.json(
        { error: "You can only withdraw your own applications." },
        { status: 403 }
      );
    }

    const withdrawalCheck = validateApplicationWithdrawal({
      currentStatus: existing.status,
    });

    if (!withdrawalCheck.allowed) {
      return NextResponse.json(
        { error: withdrawalCheck.message },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: ApplicationStatus.WITHDRAWN,
      },
    });

    const officerName =
      `${existing.officer.firstName} ${existing.officer.lastName}`.trim();
    const title = "Officer withdrew application";
    const message = `${officerName} withdrew their application for ${existing.shift.title}.`;
    const companyRecipientUserId = existing.shift.company.user.id;

    console.log("[application-withdraw] Creating company notification", {
      companyRecipientUserId,
      officerUserId: existing.officer.user.id,
      companyAccountEmail: existing.shift.company.user.email,
      companyProfileEmail: existing.shift.company.email ?? null,
    });

    await createNotificationWithEmail(prisma, {
      userId: companyRecipientUserId,
      title,
      message,
      type: "application_withdrawn",
      linkUrl: "/company/applications",
    });

    return NextResponse.json(updatedApplication);
  } catch {
    return NextResponse.json(
      { error: "Failed to withdraw application" },
      { status: 500 }
    );
  }
}
