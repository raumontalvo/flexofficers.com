import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { normalizePhotoUrl } from "@/lib/clerk-photo-sync";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: clerkUser.id,
    bucket: "officer-profile-photo",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let payload: { profilePhotoUrl?: unknown };

  try {
    payload = (await req.json()) as { profilePhotoUrl?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const profilePhotoUrl =
    normalizePhotoUrl(
      typeof payload.profilePhotoUrl === "string"
        ? payload.profilePhotoUrl
        : clerkUser.imageUrl
    ) ?? null;

  if (!profilePhotoUrl) {
    return NextResponse.json({ error: "Profile photo URL is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      id: true,
      role: true,
      officer: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user || user.role !== UserRole.OFFICER || !user.officer) {
    return NextResponse.json({ error: "Officer profile not found." }, { status: 404 });
  }

  await prisma.officer.update({
    where: {
      id: user.officer.id,
    },
    data: {
      profilePhotoUrl,
    },
  });

  return NextResponse.json({ profilePhotoUrl });
}
