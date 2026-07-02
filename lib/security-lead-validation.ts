export type SecurityLeadPayload = {
  contactName?: unknown;
  companyName?: unknown;
  email?: unknown;
  phone?: unknown;
  serviceNeeded?: unknown;
  city?: unknown;
  state?: unknown;
  address?: unknown;
  dateNeeded?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  officersNeeded?: unknown;
  budgetOffer?: unknown;
  description?: unknown;
  urgency?: unknown;
};

export type FieldError = {
  field: string;
  message: string;
};

export type ParsedSecurityLead = {
  contactName: string;
  companyName: string | null;
  contactEmail: string;
  contactPhone: string;
  serviceNeeded: string;
  city: string;
  state: string;
  address: string;
  dateNeeded: Date;
  startTime: Date;
  endTime: Date;
  officersNeeded: number;
  budgetOffer: string;
  description: string;
  urgency: "STANDARD" | "URGENT";
};

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parseRequiredString(value: unknown, field: string, errors: FieldError[]) {
  const normalized = normalizeString(value);

  if (!normalized) {
    errors.push({ field, message: `${field} is required.` });
    return "";
  }

  return normalized;
}

function parseDate(value: unknown, field: string, errors: FieldError[]) {
  const normalized = normalizeString(value);

  if (!normalized) {
    errors.push({ field, message: `${field} is required.` });
    return null;
  }

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    errors.push({ field, message: `${field} must be a valid date.` });
    return null;
  }

  return date;
}

function parseOfficersNeeded(value: unknown, errors: FieldError[]) {
  const raw =
    typeof value === "number"
      ? value
      : Number.parseInt(normalizeString(value), 10);

  if (!Number.isFinite(raw) || raw < 1 || raw > 100) {
    errors.push({
      field: "officersNeeded",
      message: "Number of officers must be between 1 and 100.",
    });
    return 1;
  }

  return raw;
}

export function parseSecurityLeadPayload(payload: SecurityLeadPayload) {
  const errors: FieldError[] = [];
  const contactName = parseRequiredString(
    payload.contactName,
    "contactName",
    errors
  );
  const companyNameRaw = normalizeString(payload.companyName);
  const contactEmail = parseRequiredString(payload.email, "email", errors);
  const contactPhone = parseRequiredString(payload.phone, "phone", errors);
  const serviceNeeded = parseRequiredString(
    payload.serviceNeeded,
    "serviceNeeded",
    errors
  );
  const city = parseRequiredString(payload.city, "city", errors);
  const state = parseRequiredString(payload.state, "state", errors);
  const address = parseRequiredString(payload.address, "address", errors);
  const budgetOffer = parseRequiredString(
    payload.budgetOffer,
    "budgetOffer",
    errors
  );
  const description = parseRequiredString(
    payload.description,
    "description",
    errors
  );
  const dateNeeded = parseDate(payload.dateNeeded, "dateNeeded", errors);
  const startTime = parseDate(payload.startTime, "startTime", errors);
  const endTime = parseDate(payload.endTime, "endTime", errors);
  const officersNeeded = parseOfficersNeeded(payload.officersNeeded, errors);
  const urgencyRaw = normalizeString(payload.urgency).toUpperCase();
  const urgency =
    urgencyRaw === "URGENT" ? ("URGENT" as const) : ("STANDARD" as const);

  if (dateNeeded && startTime && endTime && endTime <= startTime) {
    errors.push({
      field: "endTime",
      message: "End time must be after start time.",
    });
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      contactName,
      companyName: companyNameRaw || null,
      contactEmail,
      contactPhone,
      serviceNeeded,
      city,
      state,
      address,
      dateNeeded: dateNeeded!,
      startTime: startTime!,
      endTime: endTime!,
      officersNeeded,
      budgetOffer,
      description,
      urgency,
    } satisfies ParsedSecurityLead,
  };
}
