import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { officerWithUserSelect } from "@/lib/officer-fields";
import { validateInviteDeletion } from "@/lib/officer-invite-delete";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "invite-delete",
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
        { error: "Only officer accounts can delete invites." },
        { status: 403 }
      );
    }

    const { inviteId } = await req.json();

    if (!inviteId || typeof inviteId !== "string") {
      return NextResponse.json({ error: "inviteId is required" }, { status: 400 });
    }

    const existing = await prisma.shiftInvite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        officer: {
          select: officerWithUserSelect,
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (existing.officer.user.clerkId !== clerkUser.id) {
      return NextResponse.json(
        { error: "You can only delete your own invites." },
        { status: 403 }
      );
    }

    const deletionCheck = validateInviteDeletion({
      status: existing.status,
    });

    if (!deletionCheck.allowed) {
      return NextResponse.json({ error: deletionCheck.message }, { status: 400 });
    }

    await prisma.shiftInvite.delete({
      where: {
        id: inviteId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete invite" }, { status: 500 });
  }
}
