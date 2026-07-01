import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensureCompanyOnSignup } from "@/lib/company-onboarding";
import { enforceRateLimit } from "@/lib/rate-limit";

type OnboardingPayload = {
  role?: unknown;
};

function parseRole(payload: OnboardingPayload) {
  if (payload.role !== UserRole.OFFICER && payload.role !== UserRole.COMPANY) {
    return {
      error: "Invalid role. Allowed values are OFFICER or COMPANY.",
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
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

    if (existingUser?.role) {
      return NextResponse.json(
        { error: "Role has already been selected and cannot be changed." },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const user = existingUser
        ? await tx.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              email,
              role: parsed.role,
            },
          })
        : await tx.user.create({
            data: {
              clerkId: clerkUser.id,
              email,
              role: parsed.role,
            },
          });

      if (parsed.role === UserRole.COMPANY) {
        await ensureCompanyOnSignup(tx, {
          userId: user.id,
          email,
          firstName: clerkUser.firstName,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}