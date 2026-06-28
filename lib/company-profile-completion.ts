export type CompanyProfileCompletionFields = {
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
};

export type CompanyProfileCompletion = {
  missingItems: string[];
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
  const missingItems = [
    !hasValue(company?.companyName) ? "Company name" : null,
    !contactEmail ? "Contact email" : null,
    !hasValue(company?.phone) ? "Phone number" : null,
    !hasValue(company?.address) ? "Address" : null,
    !hasValue(company?.city) ? "City" : null,
    !hasValue(company?.state) ? "State" : null,
  ].filter((item): item is string => Boolean(item));

  const completionPercent = Math.round(
    ((REQUIRED_FIELD_COUNT - missingItems.length) / REQUIRED_FIELD_COUNT) * 100
  );

  return {
    missingItems,
    completionPercent,
    isComplete: missingItems.length === 0,
  };
}
