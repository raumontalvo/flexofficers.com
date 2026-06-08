import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  parseOfficerPayload,
  type OfficerProfilePayload,
  type ParsedLicense,
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

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
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

  const user = existingUser
    ? await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          email,
        },
      })
    : await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          role: UserRole.OFFICER,
        },
      });

  const officer = await prisma.officer.upsert({
    where: {
      userId: user.id,
    },
    update: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      city: parsed.data.city,
      state: parsed.data.state,
      bio: parsed.data.bio,
      experienceYears: parsed.data.experienceYears,
    },
    create: {
      userId: user.id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      city: parsed.data.city,
      state: parsed.data.state,
      bio: parsed.data.bio,
      experienceYears: parsed.data.experienceYears,
    },
  });

  await prisma.license.deleteMany({
    where: {
      officerId: officer.id,
    },
  });

  if (parsed.data.licenses.length > 0) {
    await prisma.license.createMany({
      data: parsed.data.licenses.map((license: ParsedLicense) => ({
        officerId: officer.id,
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        issuingState: license.issuingState,
        expirationDate: license.expirationDate,
      })),
    });
  }

  return NextResponse.json(officer);
}