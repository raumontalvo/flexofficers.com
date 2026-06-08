import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { UserRole } from "@/app/generated/prisma/enums";

type CompanyProfilePayload = {
  companyName?: unknown;
  contactName?: unknown;
  phone?: unknown;
  website?: unknown;
  city?: unknown;
  state?: unknown;
  description?: unknown;
  licenseType?: unknown;
  licenseNumber?: unknown;
  licenseState?: unknown;
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

function parseOptionalString(
  value: unknown,
  field: string,
  errors: FieldError[]
) {
  if (typeof value === "undefined" || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    errors.push({
      field,
      message: `${field} must be a string`,
    });

    return undefined;
  }

  return value.trim();
}

function parseCompanyPayload(payload: CompanyProfilePayload) {
  const errors: FieldError[] = [];

  const companyName = parseRequiredString(payload.companyName, "companyName", errors);
  const contactName = parseRequiredString(payload.contactName, "contactName", errors);
  const phone = parseRequiredString(payload.phone, "phone", errors);
  const city = parseRequiredString(payload.city, "city", errors);
  const state = parseRequiredString(payload.state, "state", errors);
  const licenseType = parseRequiredString(payload.licenseType, "licenseType", errors);
  const licenseNumber = parseRequiredString(payload.licenseNumber, "licenseNumber", errors);
  const licenseState = parseRequiredString(payload.licenseState, "licenseState", errors);

  const website = parseOptionalString(payload.website, "website", errors);
  const description = parseOptionalString(payload.description, "description", errors);

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      companyName,
      contactName,
      phone,
      website,
      city,
      state,
      description,
      licenseType,
      licenseNumber,
      licenseState,
    },
  };
}

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

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
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
          email,
        },
      })
    : await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          role: UserRole.COMPANY,
        },
      });

  const company = await prisma.company.upsert({
    where: {
      userId: user.id,
    },
    update: {
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      phone: parsed.data.phone,
      website: parsed.data.website,
      city: parsed.data.city,
      state: parsed.data.state,
      description: parsed.data.description,
      licenseType: parsed.data.licenseType,
      licenseNumber: parsed.data.licenseNumber,
      licenseState: parsed.data.licenseState,
    },
    create: {
      userId: user.id,
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      phone: parsed.data.phone,
      website: parsed.data.website,
      city: parsed.data.city,
      state: parsed.data.state,
      description: parsed.data.description,
      licenseType: parsed.data.licenseType,
      licenseNumber: parsed.data.licenseNumber,
      licenseState: parsed.data.licenseState,
    },
  });

  return NextResponse.json(company);
}