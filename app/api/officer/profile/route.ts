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

  const result = await prisma.$transaction(async (tx) => {
    const user = existingUser
      ? await tx.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            email,
          },
        })
      : await tx.user.create({
          data: {
            clerkId: clerkUser.id,
            email,
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

    const existingLicenses = await tx.license.findMany({
      where: {
        officerId: officer.id,
      },
      select: {
        id: true,
      },
    });

    const existingLicenseIds = new Set(existingLicenses.map((license) => license.id));
    const requestedLicenseIds = parsed.data.licenses
      .map((license) => license.id)
      .filter((id): id is string => Boolean(id));

    const invalidLicenseIds = requestedLicenseIds.filter(
      (id) => !existingLicenseIds.has(id)
    );

    if (invalidLicenseIds.length > 0) {
      return {
        error: {
          status: 400,
          body: {
            error: "Invalid request payload",
            details: [
              {
                field: "licenses",
                message: "One or more license ids are invalid for this officer",
              },
            ],
          },
        },
      };
    }

    for (const license of parsed.data.licenses) {
      if (license.id) {
        await tx.license.update({
          where: {
            id: license.id,
          },
          data: {
            licenseType: license.licenseType,
            licenseNumber: license.licenseNumber,
            issuingState: license.issuingState,
            expirationDate: license.expirationDate,
          },
        });
      } else {
        await tx.license.create({
          data: {
            officerId: officer.id,
            licenseType: license.licenseType,
            licenseNumber: license.licenseNumber,
            issuingState: license.issuingState,
            expirationDate: license.expirationDate,
          },
        });
      }
    }

    const requestedLicenseIdSet = new Set(requestedLicenseIds);
    const licenseIdsToDelete = existingLicenses
      .map((license) => license.id)
      .filter((id) => !requestedLicenseIdSet.has(id));

    if (licenseIdsToDelete.length > 0) {
      await tx.license.deleteMany({
        where: {
          officerId: officer.id,
          id: {
            in: licenseIdsToDelete,
          },
        },
      });
    }

    return { officer };
  });

  const transactionError = "error" in result ? result.error : undefined;

  if (transactionError) {
    return NextResponse.json(transactionError.body, {
      status: transactionError.status,
    });
  }

  return NextResponse.json(result.officer);
}