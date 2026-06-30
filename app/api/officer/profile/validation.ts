import {
  ALL_EXPERIENCE_CATEGORIES,
  ARMED_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
} from "@/lib/profile-options";
import {
  US_STATE_OPTIONS,
} from "@/lib/license-options";
import { ArmedStatus } from "@/app/generated/prisma/enums";

export type OfficerLicensePayload = {
  id?: unknown;
  licenseNumber?: unknown;
  licenseType?: unknown;
  issuingState?: unknown;
  expirationDate?: unknown;
};

export type OfficerProfilePayload = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
  city?: unknown;
  profilePhotoUrl?: unknown;
  armedStatus?: unknown;
  armedStatuses?: unknown;
  experienceYears?: unknown;
  licenses?: unknown;
  availability?: unknown;
  certifications?: unknown;
  experienceCategories?: unknown;
  introduction?: unknown;
  licenseCertificationAccepted?: unknown;
};

export type FieldError = {
  field: string;
  message: string;
};

export type ParsedOfficerLicense = {
  id?: string;
  licenseNumber: string;
  licenseType: string;
  issuingState: string;
  expirationDate: Date;
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

function parseStringArrayWithCustomValues(
  value: unknown,
  field: string,
  errors: FieldError[],
  maxItemLength = 80,
  maxItems = 20
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

    if (trimmed.length > maxItemLength) {
      errors.push({
        field: `${field}[${index}]`,
        message: `must be ${maxItemLength} characters or fewer`,
      });

      return;
    }

    if (!parsed.includes(trimmed)) {
      parsed.push(trimmed);
    }
  });

  if (parsed.length > maxItems) {
    errors.push({
      field,
      message: `no more than ${maxItems} items are allowed`,
    });
  }

  return parsed;
}

function parseArmedStatuses(
  payload: OfficerProfilePayload,
  errors: FieldError[]
): ArmedStatus[] {
  const allowed = new Set(ARMED_STATUS_OPTIONS);
  const parsed: ArmedStatus[] = [];

  const rawValues: unknown[] = [];

  if (Array.isArray(payload.armedStatuses)) {
    rawValues.push(...payload.armedStatuses);
  } else if (
    typeof payload.armedStatuses === "string" &&
    payload.armedStatuses.trim() !== ""
  ) {
    rawValues.push(payload.armedStatuses);
  } else if (
    typeof payload.armedStatus === "string" &&
    payload.armedStatus.trim() !== ""
  ) {
    rawValues.push(payload.armedStatus);
  }

  if (rawValues.length === 0) {
    errors.push({
      field: "armedStatuses",
      message: "armedStatuses is required",
    });

    return parsed;
  }

  rawValues.forEach((entry, index) => {
    if (typeof entry !== "string") {
      errors.push({
        field: `armedStatuses[${index}]`,
        message: "must be a string",
      });

      return;
    }

    const normalized = entry.trim().toUpperCase();

    if (!allowed.has(normalized as (typeof ARMED_STATUS_OPTIONS)[number])) {
      errors.push({
        field: `armedStatuses[${index}]`,
        message: "must be ARMED or UNARMED",
      });

      return;
    }

    const status = normalized as ArmedStatus;

    if (!parsed.includes(status)) {
      parsed.push(status);
    }
  });

  return parsed;
}

function parseLicenses(
  value: unknown,
  errors: FieldError[]
): ParsedOfficerLicense[] {
  if (!Array.isArray(value)) {
    errors.push({
      field: "licenses",
      message: "licenses must be an array",
    });

    return [];
  }

  if (value.length === 0) {
    errors.push({
      field: "licenses",
      message: "at least one license is required",
    });

    return [];
  }

  const stateSet = new Set<string>(US_STATE_OPTIONS);
  const parsed: ParsedOfficerLicense[] = [];
  const LICENSE_TYPE_MAX_LENGTH = 80;

  value.forEach((entry, index) => {
    const prefix = `licenses[${index}]`;

    if (!entry || typeof entry !== "object") {
      errors.push({
        field: prefix,
        message: "must be an object",
      });

      return;
    }

    const license = entry as OfficerLicensePayload;

    const licenseNumber = parseRequiredString(
      license.licenseNumber,
      `${prefix}.licenseNumber`,
      errors
    );
    const licenseType = parseRequiredString(
      license.licenseType,
      `${prefix}.licenseType`,
      errors
    );
    const issuingState = parseRequiredString(
      license.issuingState,
      `${prefix}.issuingState`,
      errors
    );

    if (licenseType === "Other") {
      errors.push({
        field: `${prefix}.licenseType`,
        message: "enter a custom license type",
      });
    } else if (licenseType.length > LICENSE_TYPE_MAX_LENGTH) {
      errors.push({
        field: `${prefix}.licenseType`,
        message: `license type must be ${LICENSE_TYPE_MAX_LENGTH} characters or fewer`,
      });
    }

    if (issuingState && !stateSet.has(issuingState)) {
      errors.push({
        field: `${prefix}.issuingState`,
        message: "invalid issuing state",
      });
    }

    const expirationDateRaw =
      typeof license.expirationDate === "string"
        ? license.expirationDate.trim()
        : "";

    if (!expirationDateRaw) {
      errors.push({
        field: `${prefix}.expirationDate`,
        message: "expirationDate is required",
      });
    }

    let expirationDate: Date | undefined;
    if (expirationDateRaw) {
      const parsedDate = new Date(expirationDateRaw);

      if (Number.isNaN(parsedDate.getTime())) {
        errors.push({
          field: `${prefix}.expirationDate`,
          message: "expirationDate must be a valid date",
        });
      } else {
        expirationDate = parsedDate;
      }
    }

    let id: string | undefined;
    if (
      typeof license.id === "string" &&
      license.id.trim() !== "" &&
      license.id !== "new"
    ) {
      id = license.id.trim();
    }

    if (
      licenseNumber &&
      licenseType &&
      issuingState &&
      expirationDate
    ) {
      parsed.push({
        id,
        licenseNumber,
        licenseType,
        issuingState,
        expirationDate,
      });
    }
  });

  return parsed;
}

function parseLicenseCertificationAccepted(
  value: unknown,
  errors: FieldError[]
): boolean {
  if (value !== true) {
    errors.push({
      field: "licenseCertificationAccepted",
      message:
        "You must certify that your license information is accurate before saving.",
    });

    return false;
  }

  return true;
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

  const armedStatuses = parseArmedStatuses(payload, errors);
  const licenses = parseLicenses(payload.licenses, errors);
  const licenseCertificationAccepted = parseLicenseCertificationAccepted(
    payload.licenseCertificationAccepted,
    errors
  );

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

  const availability = parseStringArrayFromOptions(
    payload.availability,
    "availability",
    AVAILABILITY_OPTIONS,
    errors
  );
  const certifications = parseStringArrayWithCustomValues(
    payload.certifications,
    "certifications",
    errors
  );
  const experienceCategories = parseStringArrayFromOptions(
    payload.experienceCategories,
    "experienceCategories",
    ALL_EXPERIENCE_CATEGORIES,
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
      armedStatuses,
      experienceYears: experienceYears!,
      licenses,
      availability,
      certifications,
      experienceCategories,
      introduction,
      licenseCertificationAccepted,
    },
  };
}
