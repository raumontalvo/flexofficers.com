export type CompanyProfileCompletionFields = {
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
};

export type CompanyProfileFieldId =
  | "companyName"
  | "contactEmail"
  | "phone"
  | "address"
  | "city"
  | "state";

export type CompanyProfileCompletion = {
  missingItems: string[];
  missingFieldIds: CompanyProfileFieldId[];
  completionPercent: number;
  isComplete: boolean;
};

const REQUIRED_FIELD_COUNT = 6;

function hasValue(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function getCompanyProfileCompletion(
  company: CompanyProfileCompletionFields | null | undefined,
  userEmail: string
): CompanyProfileCompletion {
  const contactEmail = company?.email?.trim() || userEmail.trim();
  const fieldChecks: Array<{ id: CompanyProfileFieldId; label: string; missing: boolean }> =
    [
      {
        id: "companyName",
        label: "Company name",
        missing: !hasValue(company?.companyName),
      },
      {
        id: "contactEmail",
        label: "Contact email",
        missing: !contactEmail,
      },
      {
        id: "phone",
        label: "Phone number",
        missing: !hasValue(company?.phone),
      },
      {
        id: "address",
        label: "Address",
        missing: !hasValue(company?.address),
      },
      {
        id: "city",
        label: "City",
        missing: !hasValue(company?.city),
      },
      {
        id: "state",
        label: "State",
        missing: !hasValue(company?.state),
      },
    ];
  const missingFields = fieldChecks.filter((field) => field.missing);
  const missingItems = missingFields.map((field) => field.label);
  const missingFieldIds = missingFields.map((field) => field.id);

  const completionPercent = Math.round(
    ((REQUIRED_FIELD_COUNT - missingItems.length) / REQUIRED_FIELD_COUNT) * 100
  );

  return {
    missingItems,
    missingFieldIds,
    completionPercent,
    isComplete: missingItems.length === 0,
  };
}
