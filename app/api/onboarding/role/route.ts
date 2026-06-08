import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { UserRole } from "@/app/generated/prisma/enums";

type OnboardingPayload = {
  role?: unknown;
};

function parseRole(payload: OnboardingPayload) {
  if (payload.role !== UserRole.OFFICER && payload.role !== UserRole.COMPANY) {
    return {
      error:
        "Invalid role. Allowed values are OFFICER or COMPANY.",
    };
  }

  return {
    role: payload.role,
  };
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "onboarding-role",
      profile: "moderate",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = (await req.json()) as OnboardingPayload;
    const parsed = parseRole(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (existingUser?.role && existingUser.role !== parsed.role) {
      return NextResponse.json(
        { error: "Role is already set and cannot be changed." },
        { status: 403 }
      );
    }

    if (existingUser) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          email,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          role: parsed.role,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}