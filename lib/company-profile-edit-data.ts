import {
  buildCompanyServices,
  COMPANY_OFFICER_BENEFITS,
  COMPANY_PROFILE_SERVICES,
  COMPANY_WORK_ENVIRONMENT,
} from "@/lib/company-profile-options";
import { sanitizeProfileFieldValue } from "@/lib/company-profile-payload";
import {
  parseCompanyProfileMeta,
  splitKnownAndCustomSelections,
  stripCompanyProfileMeta,
} from "@/lib/company-profile-meta";

export type CompanyProfileEditFormState = {
  logoUrl: string;
  companyName: string;
  tagline: string;
  website: string;
  city: string;
  state: string;
  description: string;
  services: string[];
  customServices: string[];
  officerBenefits: string[];
  customBenefits: string[];
  workEnvironment: string[];
  customWorkEnvironment: string[];
  licenseNumber: string;
  licenseType: string;
  licenseState: string;
  licenseIssueDate: string;
  licenseExpirationDate: string;
  email: string;
  phone: string;
  businessHours: string;
  industry: string;
  companySize: string;
  established: string;
  hasPublicProfile: boolean;
};

type CompanyRecord = {
  companyName: string;
  contactName: string | null;
  logoUrl: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  phone: string | null;
  email: string | null;
};

export function buildCompanyProfileEditFormState(input: {
  company: CompanyRecord;
  userEmail: string;
  shifts: { requirements: string[] }[];
  hasPublicProfile: boolean;
}): CompanyProfileEditFormState {
  const { company, userEmail, shifts, hasPublicProfile } = input;
  const meta = parseCompanyProfileMeta(company.description);
  const description = stripCompanyProfileMeta(company.description) ?? "";
  const fallbackServices = buildCompanyServices(shifts);
  const servicesSource =
    meta.services.length > 0 ? meta.services : fallbackServices;
  const serviceSelections = splitKnownAndCustomSelections(
    servicesSource,
    COMPANY_PROFILE_SERVICES
  );
  const benefitSelections = splitKnownAndCustomSelections(
    meta.officerBenefits,
    COMPANY_OFFICER_BENEFITS
  );
  const environmentSelections = splitKnownAndCustomSelections(
    meta.workEnvironment,
    COMPANY_WORK_ENVIRONMENT
  );

  return {
    logoUrl: sanitizeProfileFieldValue(company.logoUrl),
    companyName: sanitizeProfileFieldValue(company.companyName),
    tagline: sanitizeProfileFieldValue(company.contactName),
    website: sanitizeProfileFieldValue(company.website) ?? "",
    city: sanitizeProfileFieldValue(company.city),
    state: sanitizeProfileFieldValue(company.state),
    description,
    services: serviceSelections.known,
    customServices: serviceSelections.custom,
    officerBenefits: benefitSelections.known,
    customBenefits: benefitSelections.custom,
    workEnvironment: environmentSelections.known,
    customWorkEnvironment: environmentSelections.custom,
    licenseNumber: sanitizeProfileFieldValue(company.licenseNumber),
    licenseType: sanitizeProfileFieldValue(company.licenseType),
    licenseState: sanitizeProfileFieldValue(company.licenseState),
    licenseIssueDate: meta.licenseIssueDate ?? "",
    licenseExpirationDate: meta.licenseExpirationDate ?? "",
    email: sanitizeProfileFieldValue(company.email) || userEmail,
    phone: sanitizeProfileFieldValue(company.phone),
    businessHours: sanitizeProfileFieldValue(meta.businessHours) ?? "",
    industry: sanitizeProfileFieldValue(meta.industry) ?? "",
    companySize: sanitizeProfileFieldValue(meta.companySize) ?? "",
    established: sanitizeProfileFieldValue(meta.established) ?? "",
    hasPublicProfile,
  };
}

export function mergeProfileSelections(
  known: string[],
  custom: string[]
) {
  return [...new Set([...known, ...custom].map((item) => item.trim()).filter(Boolean))];
}
