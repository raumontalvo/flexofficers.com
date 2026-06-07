import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    await prisma.user.upsert({
      where: {
        clerkId: clerkUser.id,
      },
      update: {
        role: parsed.role,
        email,
      },
      create: {
        clerkId: clerkUser.id,
        email,
        role: parsed.role,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}