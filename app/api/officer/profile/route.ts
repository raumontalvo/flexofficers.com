import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeExperienceCategories } from "@/lib/profile-options";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  resolveProfilePhotoUrl,
} from "@/lib/profile-photo";
import {
  parseOfficerPayload,
  type OfficerProfilePayload,
} from "./validation";
import { UserRole } from "@/app/generated/prisma/enums";

async function syncOfficerLicenses(
  tx: Prisma.TransactionClient,
  officerId: string,
  licenses: Array<{
    id?: string;
    licenseNumber: string;
    licenseType: string;
    issuingState: string;
    expirationDate: Date;
  }>
) {
  const existingLicenses = await tx.license.findMany({
    where: { officerId },
    select: { id: true },
  });

  const submittedIds = new Set(
    licenses.map((license) => license.id).filter((id): id is string => Boolean(id))
  );

  const idsToDelete = existingLicenses
    .map((license) => license.id)
    .filter((id) => !submittedIds.has(id));

  if (idsToDelete.length > 0) {
    await tx.license.deleteMany({
      where: {
        officerId,
        id: {
          in: idsToDelete,
        },
      },
    });
  }

  for (const license of licenses) {
    if (license.id) {
      const updated = await tx.license.updateMany({
        where: {
          id: license.id,
          officerId,
        },
        data: {
          licenseNumber: license.licenseNumber,
          licenseType: license.licenseType,
          issuingState: license.issuingState,
          expirationDate: license.expirationDate,
        },
      });

      if (updated.count === 0) {
        throw new Error("Invalid license id for officer");
      }

      continue;
    }

    await tx.license.create({
      data: {
        officerId,
        licenseNumber: license.licenseNumber,
        licenseType: license.licenseType,
        issuingState: license.issuingState,
        expirationDate: license.expirationDate,
      },
    });
  }
}

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

  try {
    const experienceCategories = normalizeExperienceCategories(
      parsed.data.experienceCategories
    );
    const profilePhotoUrl =
      resolveProfilePhotoUrl(parsed.data.profilePhotoUrl, clerkUser.imageUrl) ||
      null;

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
          profilePhotoUrl,
          armedStatuses: parsed.data.armedStatuses,
          experienceYears: parsed.data.experienceYears,
          availability: parsed.data.availability,
          certifications: parsed.data.certifications,
          experienceCategories,
          introduction: parsed.data.introduction,
          licenseCertificationAccepted: parsed.data.licenseCertificationAccepted,
        },
        create: {
          userId: user.id,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          phone: parsed.data.phone,
          city: parsed.data.city,
          profilePhotoUrl,
          armedStatuses: parsed.data.armedStatuses,
          experienceYears: parsed.data.experienceYears,
          availability: parsed.data.availability,
          certifications: parsed.data.certifications,
          experienceCategories,
          introduction: parsed.data.introduction,
          licenseCertificationAccepted: parsed.data.licenseCertificationAccepted,
        },
      });

      await syncOfficerLicenses(tx, officer.id, parsed.data.licenses);

      const licenses = await tx.license.findMany({
        where: {
          officerId: officer.id,
        },
        select: {
          id: true,
          licenseType: true,
          licenseNumber: true,
          issuingState: true,
          expirationDate: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return { officer, licenses };
    });

    return NextResponse.json({
      ...result.officer,
      licenses: result.licenses,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save officer profile" },
      { status: 400 }
    );
  }
}
