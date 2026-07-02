import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/lib/client-auth";
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
    bucket: "client-profile-photo",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
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

  await prisma.client.update({
    where: { id: auth.client.id },
    data: { profilePhotoUrl },
  });

  return NextResponse.json({ profilePhotoUrl });
}
