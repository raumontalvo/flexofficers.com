export type CompanyProfilePayload = {
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

export function parseCompanyPayload(payload: CompanyProfilePayload) {
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
