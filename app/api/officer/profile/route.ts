import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  parseOfficerPayload,
  type OfficerProfilePayload,
} from "./validation";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: clerkUser.id,
    bucket: "officer-profile-save",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let payload: OfficerProfilePayload;

  try {
    payload = (await req.json()) as OfficerProfilePayload;
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

  const parsed = parseOfficerPayload(payload);

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

  if (existingUser?.role === UserRole.COMPANY) {
    return NextResponse.json(
      { error: "Company accounts cannot create or update officer profiles." },
      { status: 403 }
    );
  }

  if (existingUser?.role && existingUser.role !== UserRole.OFFICER) {
    return NextResponse.json(
      { error: "Only officer accounts can create or update officer profiles." },
      { status: 403 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = existingUser
      ? await tx.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            email: parsed.data.email,
          },
        })
      : await tx.user.create({
          data: {
            clerkId: clerkUser.id,
            email: parsed.data.email,
            role: UserRole.OFFICER,
          },
        });

    const officer = await tx.officer.upsert({
      where: {
        userId: user.id,
      },
      update: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        city: parsed.data.city,
        profilePhotoUrl: parsed.data.profilePhotoUrl,
        armedStatus: parsed.data.armedStatus,
        experienceYears: parsed.data.experienceYears,
        licenseExpirationDate: parsed.data.licenseExpirationDate,
        availability: parsed.data.availability,
        certifications: parsed.data.certifications,
        experienceCategories: parsed.data.experienceCategories,
        introduction: parsed.data.introduction,
      },
      create: {
        userId: user.id,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        city: parsed.data.city,
        profilePhotoUrl: parsed.data.profilePhotoUrl,
        armedStatus: parsed.data.armedStatus,
        experienceYears: parsed.data.experienceYears,
        licenseExpirationDate: parsed.data.licenseExpirationDate,
        availability: parsed.data.availability,
        certifications: parsed.data.certifications,
        experienceCategories: parsed.data.experienceCategories,
        introduction: parsed.data.introduction,
      },
    });

    return { officer };
  });

  return NextResponse.json(result.officer);
}
