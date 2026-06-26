export type CompanyProfilePayload = {
  companyName?: unknown;
  contactName?: unknown;
  phone?: unknown;
  email?: unknown;
  address?: unknown;
  website?: unknown;
  logoUrl?: unknown;
};

export type FieldError = {
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

export function parseCompanyPayload(payload: CompanyProfilePayload) {
  const errors: FieldError[] = [];

  const companyName = parseRequiredString(payload.companyName, "companyName", errors);
  const contactName = parseRequiredString(payload.contactName, "contactName", errors);
  const phone = parseRequiredString(payload.phone, "phone", errors);
  const email = parseRequiredString(payload.email, "email", errors);
  const address = parseRequiredString(payload.address, "address", errors);
  const website = parseOptionalString(payload.website, "website", errors);
  const logoUrl = parseOptionalUrl(payload.logoUrl, "logoUrl", errors);

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      companyName,
      contactName,
      phone,
      email,
      address,
      website,
      logoUrl,
    },
  };
}
