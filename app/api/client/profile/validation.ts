const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ClientProfilePayload = {
  contactName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  industry?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
};

export type ClientNotificationPrefsPayload = {
  emailNotifications: boolean;
  newCompanyApplications: boolean;
  messages: boolean;
  marketingEmails: boolean;
};

type FieldError = { field: string; message: string };

function trimOptional(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function requiredString(value: unknown, field: string, label: string): string | FieldError {
  if (typeof value !== "string" || !value.trim()) {
    return { field, message: `${label} is required.` };
  }

  return value.trim();
}

export function parseClientProfilePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return {
      errors: [{ field: "body", message: "Request body must be a JSON object." }],
    };
  }

  const body = payload as Record<string, unknown>;
  const errors: FieldError[] = [];

  const contactName = requiredString(body.contactName, "contactName", "Full name");
  if (typeof contactName !== "string") {
    errors.push(contactName);
  }

  const email = requiredString(body.email, "email", "Email address");
  if (typeof email !== "string") {
    errors.push(email);
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.push({ field: "email", message: "Enter a valid email address." });
  }

  const phone = requiredString(body.phone, "phone", "Phone number");
  if (typeof phone !== "string") {
    errors.push(phone);
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      contactName: contactName as string,
      email: email as string,
      phone: phone as string,
      companyName: trimOptional(body.companyName),
      industry: trimOptional(body.industry),
      website: trimOptional(body.website),
      address: trimOptional(body.address),
      city: trimOptional(body.city),
      state: trimOptional(body.state),
      zipCode: trimOptional(body.zipCode),
      country: trimOptional(body.country),
    } satisfies ClientProfilePayload,
  };
}

export function parseClientNotificationPrefsPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return {
      errors: [{ field: "body", message: "Request body must be a JSON object." }],
    };
  }

  const body = payload as Record<string, unknown>;
  const boolFields = [
    "emailNotifications",
    "newCompanyApplications",
    "messages",
    "marketingEmails",
  ] as const;
  const errors: FieldError[] = [];
  const data: Partial<ClientNotificationPrefsPayload> = {};

  for (const field of boolFields) {
    if (typeof body[field] !== "boolean") {
      errors.push({ field, message: `${field} must be a boolean.` });
    } else {
      data[field] = body[field];
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { data: data as ClientNotificationPrefsPayload };
}
