import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  parseCompanyPayload,
  type CompanyProfilePayload,
} from "./validation";
import { UserRole } from "@/app/generated/prisma/enums";
import { getDefaultTrialFields } from "@/lib/company-trial";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: clerkUser.id,
    bucket: "company-profile-save",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let payload: CompanyProfilePayload;

  try {
    payload = (await req.json()) as CompanyProfilePayload;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        details: [
          {
            field: "body",
            message: "Request body must be valid JSON",
          },
        ],
      },
      { status: 400 }
    );
  }

  const parsed = parseCompanyPayload(payload);

  if ("errors" in parsed) {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        details: parsed.errors,
      },
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

  if (existingUser?.role === UserRole.OFFICER) {
    return NextResponse.json(
      { error: "Officer accounts cannot create or update company profiles." },
      { status: 403 }
    );
  }

  if (existingUser?.role && existingUser.role !== UserRole.COMPANY) {
    return NextResponse.json(
      { error: "Only company accounts can create or update company profiles." },
      { status: 403 }
    );
  }

  const user = existingUser
    ? await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          email: parsed.data.email,
        },
      })
    : await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: parsed.data.email,
          role: UserRole.COMPANY,
        },
      });

  const trialDefaults = getDefaultTrialFields();

  const company = await prisma.company.upsert({
    where: {
      userId: user.id,
    },
    update: {
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address,
      website: parsed.data.website,
      logoUrl: parsed.data.logoUrl,
    },
    create: {
      userId: user.id,
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address,
      website: parsed.data.website,
      logoUrl: parsed.data.logoUrl,
      trialStartedAt: trialDefaults.trialStartedAt,
      trialEndsAt: trialDefaults.trialEndsAt,
      accessStatus: trialDefaults.accessStatus,
    },
  });

  return NextResponse.json(company);
}
