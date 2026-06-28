import {
  COMPANY_OFFICER_BENEFITS,
  COMPANY_PROFILE_SERVICES,
  COMPANY_WORK_ENVIRONMENT,
} from "@/lib/company-profile-options";
import { US_STATE_OPTIONS } from "@/lib/license-options";

export type CompanyProfilePayload = {
  companyName?: unknown;
  tagline?: unknown;
  phone?: unknown;
  email?: unknown;
  website?: unknown;
  logoUrl?: unknown;
  city?: unknown;
  state?: unknown;
  description?: unknown;
  services?: unknown;
  officerBenefits?: unknown;
  workEnvironment?: unknown;
  licenseNumber?: unknown;
  licenseType?: unknown;
  licenseState?: unknown;
  licenseIssueDate?: unknown;
  licenseExpirationDate?: unknown;
  businessHours?: unknown;
  industry?: unknown;
  companySize?: unknown;
  established?: unknown;
};

export type FieldError = {
  field: string;
  message: string;
};

export type ParsedCompanyProfile = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  logoUrl?: string;
  city: string;
  state: string;
  description: string;
  licenseNumber: string;
  licenseType: string;
  licenseState: string;
  services: string[];
  officerBenefits: string[];
  workEnvironment: string[];
  businessHours: string;
  licenseIssueDate: string;
  licenseExpirationDate: string;
  industry?: string;
  companySize?: string;
  established?: string;
};

const DESCRIPTION_MAX_LENGTH = 500;

function normalizeInputValue(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.toLowerCase() === "none") {
    return "";
  }

  return trimmed;
}

function parseRequiredString(
  value: unknown,
  field: string,
  errors: FieldError[]
) {
  const normalized = normalizeInputValue(value);

  if (typeof normalized !== "string" || normalized === "") {
    errors.push({
      field,
      message: `${field} is required`,
    });

    return "";
  }

  return normalized;
}

function parseOptionalString(
  value: unknown,
  field: string,
  errors: FieldError[]
) {
  const normalized = normalizeInputValue(value);

  if (normalized === "" || normalized === undefined || normalized === null) {
    return undefined;
  }

  if (typeof normalized !== "string") {
    errors.push({
      field,
      message: `${field} must be a string`,
    });

    return undefined;
  }

  return normalized;
}

function parseOptionalUrl(
  value: unknown,
  field: string,
  errors: FieldError[]
) {
  const normalized = normalizeInputValue(value);

  if (normalized === "" || normalized === undefined || normalized === null) {
    return undefined;
  }

  if (typeof normalized !== "string") {
    errors.push({
      field,
      message: `${field} must be a string`,
    });

    return undefined;
  }

  try {
    new URL(normalized);
  } catch {
    errors.push({
      field,
      message: `${field} must be a valid URL`,
    });

    return undefined;
  }

  return normalized;
}

function parseStringArray(value: unknown, field: string, errors: FieldError[]) {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.push({
      field,
      message: `${field} must be an array`,
    });

    return [];
  }

  const items = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => normalizeInputValue(entry))
    .filter((entry): entry is string => typeof entry === "string" && entry !== "");

  return [...new Set(items)];
}

function parseRequiredDate(value: unknown, field: string, errors: FieldError[]) {
  const raw = parseRequiredString(value, field, errors);

  if (!raw) {
    return "";
  }

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    errors.push({
      field,
      message: `${field} must be a valid date`,
    });

    return "";
  }

  return raw;
}

function parseStateCode(value: unknown, errors: FieldError[]) {
  const state = parseRequiredString(value, "state", errors).toUpperCase();
  const allowed = new Set<string>(US_STATE_OPTIONS);

  if (state && !allowed.has(state)) {
    errors.push({
      field: "state",
      message: "state must be a valid US state code",
    });
  }

  return state;
}

function parseLicenseState(value: unknown, errors: FieldError[]) {
  const state = parseRequiredString(value, "licenseState", errors).toUpperCase();
  const allowed = new Set<string>(US_STATE_OPTIONS);

  if (state && !allowed.has(state)) {
    errors.push({
      field: "licenseState",
      message: "licenseState must be a valid US state code",
    });
  }

  return state;
}

export function parseCompanyPayload(payload: CompanyProfilePayload) {
  const errors: FieldError[] = [];

  const companyName = parseRequiredString(
    payload.companyName,
    "companyName",
    errors
  );
  const contactName = parseRequiredString(payload.tagline, "tagline", errors);
  const phone = parseRequiredString(payload.phone, "phone", errors);
  const email = parseRequiredString(payload.email, "email", errors);
  const city = parseRequiredString(payload.city, "city", errors);
  const state = parseStateCode(payload.state, errors);
  const description = parseRequiredString(
    payload.description,
    "description",
    errors
  );
  const licenseNumber = parseRequiredString(
    payload.licenseNumber,
    "licenseNumber",
    errors
  );
  const licenseType = parseRequiredString(
    payload.licenseType,
    "licenseType",
    errors
  );
  const licenseState = parseLicenseState(payload.licenseState, errors);
  const licenseIssueDate = parseRequiredDate(
    payload.licenseIssueDate,
    "licenseIssueDate",
    errors
  );
  const licenseExpirationDate = parseRequiredDate(
    payload.licenseExpirationDate,
    "licenseExpirationDate",
    errors
  );
  const businessHours = parseRequiredString(
    payload.businessHours,
    "businessHours",
    errors
  );
  const website = parseOptionalString(payload.website, "website", errors);
  const logoUrl = parseOptionalUrl(payload.logoUrl, "logoUrl", errors);
  const services = parseStringArray(payload.services, "services", errors);
  const officerBenefits = parseStringArray(
    payload.officerBenefits,
    "officerBenefits",
    errors
  );
  const workEnvironment = parseStringArray(
    payload.workEnvironment,
    "workEnvironment",
    errors
  );
  const industry = parseOptionalString(payload.industry, "industry", errors);
  const companySize = parseOptionalString(
    payload.companySize,
    "companySize",
    errors
  );
  const established = parseOptionalString(
    payload.established,
    "established",
    errors
  );

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push({
      field: "description",
      message: `description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`,
    });
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      companyName,
      contactName,
      phone,
      email,
      address: `${city}, ${state}`,
      website,
      logoUrl,
      city,
      state,
      description,
      licenseNumber,
      licenseType,
      licenseState,
      services,
      officerBenefits,
      workEnvironment,
      businessHours,
      licenseIssueDate,
      licenseExpirationDate,
      industry,
      companySize,
      established,
    } satisfies ParsedCompanyProfile,
  };
}

export const COMPANY_PROFILE_FORM_OPTIONS = {
  services: COMPANY_PROFILE_SERVICES,
  officerBenefits: COMPANY_OFFICER_BENEFITS,
  workEnvironment: COMPANY_WORK_ENVIRONMENT,
  descriptionMaxLength: DESCRIPTION_MAX_LENGTH,
};
