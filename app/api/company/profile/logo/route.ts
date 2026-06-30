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
    bucket: "company-profile-logo",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let payload: { logoUrl?: unknown };

  try {
    payload = (await req.json()) as { logoUrl?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const logoUrl =
    normalizePhotoUrl(
      typeof payload.logoUrl === "string" ? payload.logoUrl : clerkUser.imageUrl
    ) ?? null;

  if (!logoUrl) {
    return NextResponse.json({ error: "Logo URL is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      role: true,
      company: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user || user.role !== UserRole.COMPANY || !user.company) {
    return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
  }

  await prisma.company.update({
    where: {
      id: user.company.id,
    },
    data: {
      logoUrl,
    },
  });

  return NextResponse.json({ logoUrl });
}
