export type ClientProfileCompletionFields = {
  contactName: string | null;
  email: string | null;
  phone: string | null;
};

export type ClientProfileCompletion = {
  missingItems: string[];
  completionPercent: number;
  isComplete: boolean;
};

const REQUIRED_FIELD_COUNT = 3;

function hasValue(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function getClientProfileCompletion(
  client: ClientProfileCompletionFields | null | undefined,
  userEmail: string
): ClientProfileCompletion {
  const email = client?.email?.trim() || userEmail.trim();
  const fieldChecks = [
    { label: "Full name", missing: !hasValue(client?.contactName) },
    { label: "Email address", missing: !email },
    { label: "Phone number", missing: !hasValue(client?.phone) },
  ];
  const missingItems = fieldChecks.filter((field) => field.missing).map((field) => field.label);
  const completionPercent = Math.round(
    ((REQUIRED_FIELD_COUNT - missingItems.length) / REQUIRED_FIELD_COUNT) * 100
  );

  return {
    missingItems,
    completionPercent,
    isComplete: missingItems.length === 0,
  };
}
