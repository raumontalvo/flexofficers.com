import {
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
} from "@/lib/profile-options";
import { ArmedStatus } from "@/app/generated/prisma/enums";

export type OfficerProfilePayload = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  city?: unknown;
  profilePhotoUrl?: unknown;
  armedStatus?: unknown;
  experienceYears?: unknown;
  licenseExpirationDate?: unknown;
  availability?: unknown;
  certifications?: unknown;
  experienceCategories?: unknown;
  introduction?: unknown;
};

export type FieldError = {
  field: string;
  message: string;
};

const INTRODUCTION_MAX_LENGTH = 300;

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

function parseOptionalUrl(
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

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  try {
    new URL(trimmed);
  } catch {
    errors.push({
      field,
      message: `${field} must be a valid URL`,
    });

    return undefined;
  }

  return trimmed;
}

function parseStringArrayFromOptions(
  value: unknown,
  field: string,
  allowed: readonly string[],
  errors: FieldError[]
) {
  if (typeof value === "undefined" || value === null) {
    return [] as string[];
  }

  if (!Array.isArray(value)) {
    errors.push({
      field,
      message: `${field} must be an array`,
    });

    return [] as string[];
  }

  const allowedSet = new Set(allowed);
  const parsed: string[] = [];

  value.forEach((entry, index) => {
    if (typeof entry !== "string") {
      errors.push({
        field: `${field}[${index}]`,
        message: "must be a string",
      });

      return;
    }

    const trimmed = entry.trim();

    if (!trimmed) {
      return;
    }

    if (!allowedSet.has(trimmed)) {
      errors.push({
        field: `${field}[${index}]`,
        message: "invalid option",
      });

      return;
    }

    if (!parsed.includes(trimmed)) {
      parsed.push(trimmed);
    }
  });

  return parsed;
}

export function parseOfficerPayload(payload: OfficerProfilePayload) {
  const errors: FieldError[] = [];

  const firstName = parseRequiredString(payload.firstName, "firstName", errors);
  const lastName = parseRequiredString(payload.lastName, "lastName", errors);
  const phone = parseRequiredString(payload.phone, "phone", errors);
  const email = parseRequiredString(payload.email, "email", errors);
  const city = parseRequiredString(payload.city, "city", errors);
  const profilePhotoUrl = parseOptionalUrl(
    payload.profilePhotoUrl,
    "profilePhotoUrl",
    errors
  );

  let armedStatus: ArmedStatus | undefined;
  if (typeof payload.armedStatus !== "string" || payload.armedStatus.trim() === "") {
    errors.push({
      field: "armedStatus",
      message: "armedStatus is required",
    });
  } else {
    const normalized = payload.armedStatus.trim().toUpperCase();

    if (
      normalized !== ArmedStatus.ARMED &&
      normalized !== ArmedStatus.UNARMED
    ) {
      errors.push({
        field: "armedStatus",
        message: "armedStatus must be ARMED or UNARMED",
      });
    } else {
      armedStatus = normalized as ArmedStatus;
    }
  }

  let experienceYears: number | undefined;
  if (
    typeof payload.experienceYears === "undefined" ||
    payload.experienceYears === null ||
    payload.experienceYears === ""
  ) {
    errors.push({
      field: "experienceYears",
      message: "experienceYears is required",
    });
  } else {
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

  let licenseExpirationDate: Date | undefined;
  const licenseExpirationDateRaw =
    typeof payload.licenseExpirationDate === "string"
      ? payload.licenseExpirationDate.trim()
      : "";

  if (!licenseExpirationDateRaw) {
    errors.push({
      field: "licenseExpirationDate",
      message: "licenseExpirationDate is required",
    });
  } else {
    const parsedDate = new Date(licenseExpirationDateRaw);

    if (Number.isNaN(parsedDate.getTime())) {
      errors.push({
        field: "licenseExpirationDate",
        message: "licenseExpirationDate must be a valid date",
      });
    } else {
      licenseExpirationDate = parsedDate;
    }
  }

  const availability = parseStringArrayFromOptions(
    payload.availability,
    "availability",
    AVAILABILITY_OPTIONS,
    errors
  );
  const certifications = parseStringArrayFromOptions(
    payload.certifications,
    "certifications",
    CERTIFICATION_OPTIONS,
    errors
  );
  const experienceCategories = parseStringArrayFromOptions(
    payload.experienceCategories,
    "experienceCategories",
    EXPERIENCE_CATEGORIES,
    errors
  );

  let introduction: string | undefined;
  if (
    typeof payload.introduction === "undefined" ||
    payload.introduction === null ||
    payload.introduction === ""
  ) {
    introduction = undefined;
  } else if (typeof payload.introduction !== "string") {
    errors.push({
      field: "introduction",
      message: "introduction must be a string",
    });
  } else {
    const trimmed = payload.introduction.trim();

    if (trimmed.length > INTRODUCTION_MAX_LENGTH) {
      errors.push({
        field: "introduction",
        message: `introduction must be ${INTRODUCTION_MAX_LENGTH} characters or fewer`,
      });
    } else {
      introduction = trimmed || undefined;
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
      email,
      city,
      profilePhotoUrl,
      armedStatus: armedStatus!,
      experienceYears: experienceYears!,
      licenseExpirationDate: licenseExpirationDate!,
      availability,
      certifications,
      experienceCategories,
      introduction,
    },
  };
}
