import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { UserRole } from "@/app/generated/prisma/enums";
import { validateApplicationDeletion } from "./rules";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "application-delete",
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
        { error: "Only officer accounts can delete applications." },
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
        officer: {
          select: officerWithUserSelect,
        },
        shift: {
          select: {
            status: true,
            endTime: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (existing.officer.user.clerkId !== clerkUser.id) {
      return NextResponse.json(
        { error: "You can only delete your own applications." },
        { status: 403 }
      );
    }

    const deletionCheck = validateApplicationDeletion({
      status: existing.status,
      shiftStatus: existing.shift.status,
      shiftEndTime: existing.shift.endTime,
    });

    if (!deletionCheck.allowed) {
      return NextResponse.json({ error: deletionCheck.message }, { status: 400 });
    }

    await prisma.application.delete({
      where: {
        id: applicationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
