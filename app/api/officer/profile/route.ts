import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { UserRole } from "@/app/generated/prisma/enums";

type OfficerProfilePayload = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  city?: unknown;
  state?: unknown;
  bio?: unknown;
  experienceYears?: unknown;
  licenses?: unknown;
};

type RawLicenseInput = {
  licenseType?: unknown;
  licenseNumber?: unknown;
  issuingState?: unknown;
  expirationDate?: unknown;
};

type ParsedLicense = {
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: Date;
};

type FieldError = {
  field: string;
  message: string;
};

function parseRequiredString(
  value: unknown,
  field: string,
  errors: FieldError[]
) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push({
      field,
      message: `${field} is required`,
    });

    return "";
  }

  return value.trim();
}

function parseOfficerPayload(payload: OfficerProfilePayload) {
  const errors: FieldError[] = [];

  const firstName = parseRequiredString(payload.firstName, "firstName", errors);
  const lastName = parseRequiredString(payload.lastName, "lastName", errors);
  const phone = parseRequiredString(payload.phone, "phone", errors);
  const city = parseRequiredString(payload.city, "city", errors);
  const state = parseRequiredString(payload.state, "state", errors);

  let bio: string | undefined;
  if (typeof payload.bio === "undefined" || payload.bio === null || payload.bio === "") {
    bio = undefined;
  } else if (typeof payload.bio !== "string") {
    errors.push({
      field: "bio",
      message: "bio must be a string",
    });
  } else {
    bio = payload.bio.trim();
  }

  let experienceYears: number | undefined;
  if (
    typeof payload.experienceYears !== "undefined" &&
    payload.experienceYears !== null &&
    payload.experienceYears !== ""
  ) {
    const parsedExperience = Number(payload.experienceYears);

    if (!Number.isFinite(parsedExperience) || parsedExperience < 0) {
      errors.push({
        field: "experienceYears",
        message: "experienceYears must be a non-negative number",
      });
    } else {
      experienceYears = parsedExperience;
    }
  }

  const parsedLicenses: ParsedLicense[] = [];

  if (typeof payload.licenses !== "undefined" && payload.licenses !== null) {
    if (!Array.isArray(payload.licenses)) {
      errors.push({
        field: "licenses",
        message: "licenses must be an array",
      });
    } else {
      payload.licenses.forEach((license, index) => {
        const entry = (license ?? {}) as RawLicenseInput;

        const licenseType =
          typeof entry.licenseType === "string" ? entry.licenseType.trim() : "";
        const licenseNumber =
          typeof entry.licenseNumber === "string" ? entry.licenseNumber.trim() : "";
        const issuingState =
          typeof entry.issuingState === "string" ? entry.issuingState.trim() : "";
        const expirationDateRaw =
          typeof entry.expirationDate === "string" ? entry.expirationDate.trim() : "";

        const isEmptyEntry =
          !licenseType &&
          !licenseNumber &&
          !issuingState &&
          !expirationDateRaw;

        if (isEmptyEntry) {
          return;
        }

        if (!licenseType) {
          errors.push({
            field: `licenses[${index}].licenseType`,
            message: "licenseType is required",
          });
        }

        if (!licenseNumber) {
          errors.push({
            field: `licenses[${index}].licenseNumber`,
            message: "licenseNumber is required",
          });
        }

        if (!issuingState) {
          errors.push({
            field: `licenses[${index}].issuingState`,
            message: "issuingState is required",
          });
        }

        if (!expirationDateRaw) {
          errors.push({
            field: `licenses[${index}].expirationDate`,
            message: "expirationDate is required",
          });

          return;
        }

        const expirationDate = new Date(expirationDateRaw);

        if (Number.isNaN(expirationDate.getTime())) {
          errors.push({
            field: `licenses[${index}].expirationDate`,
            message: "expirationDate must be a valid date",
          });

          return;
        }

        if (licenseType && licenseNumber && issuingState) {
          parsedLicenses.push({
            licenseType,
            licenseNumber,
            issuingState,
            expirationDate,
          });
        }
      });
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      firstName,
      lastName,
      phone,
      city,
      state,
      bio,
      experienceYears,
      licenses: parsedLicenses,
    },
  };
};

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