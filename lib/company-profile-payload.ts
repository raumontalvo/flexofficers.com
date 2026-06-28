import type { CompanyProfileEditFormState } from "@/lib/company-profile-edit-data";
import { mergeProfileSelections } from "@/lib/company-profile-edit-data";

export function sanitizeProfileFieldValue(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed || trimmed.toLowerCase() === "none") {
    return "";
  }

  return trimmed;
}

export function buildCompanyProfileSavePayload(form: CompanyProfileEditFormState) {
  const logoUrl = sanitizeProfileFieldValue(form.logoUrl);
  const website = sanitizeProfileFieldValue(form.website);

  return {
    companyName: sanitizeProfileFieldValue(form.companyName),
    tagline: sanitizeProfileFieldValue(form.tagline),
    logoUrl: logoUrl || undefined,
    website: website || undefined,
    city: sanitizeProfileFieldValue(form.city),
    state: sanitizeProfileFieldValue(form.state),
    description: sanitizeProfileFieldValue(form.description),
    services: mergeProfileSelections(form.services, form.customServices),
    officerBenefits: mergeProfileSelections(
      form.officerBenefits,
      form.customBenefits
    ),
    workEnvironment: mergeProfileSelections(
      form.workEnvironment,
      form.customWorkEnvironment
    ),
    licenseNumber: sanitizeProfileFieldValue(form.licenseNumber),
    licenseType: sanitizeProfileFieldValue(form.licenseType),
    licenseState: sanitizeProfileFieldValue(form.licenseState),
    licenseIssueDate: sanitizeProfileFieldValue(form.licenseIssueDate),
    licenseExpirationDate: sanitizeProfileFieldValue(form.licenseExpirationDate),
    email: sanitizeProfileFieldValue(form.email),
    phone: sanitizeProfileFieldValue(form.phone),
    businessHours: sanitizeProfileFieldValue(form.businessHours),
    industry: sanitizeProfileFieldValue(form.industry) || undefined,
    companySize: sanitizeProfileFieldValue(form.companySize) || undefined,
    established: sanitizeProfileFieldValue(form.established) || undefined,
  };
}

export const COMPANY_PROFILE_FIELD_LABELS: Record<string, string> = {
  companyName: "Company Name",
  tagline: "Tagline / Category",
  phone: "Phone",
  email: "Contact Email",
  city: "City",
  state: "State",
  description: "Company Description",
  licenseNumber: "License Number",
  licenseType: "License Type",
  licenseState: "State Issued",
  licenseIssueDate: "Issue Date",
  licenseExpirationDate: "Expiration Date",
  businessHours: "Business Hours",
  website: "Website",
  industry: "Industry",
  companySize: "Company Size",
  established: "Established",
  logoUrl: "Logo URL",
  services: "Services",
  officerBenefits: "Benefits",
  workEnvironment: "Work Environment",
};

export function formatCompanyProfileFieldErrors(
  errors: { field: string; message: string }[]
) {
  return errors.map((error) => {
    const label = COMPANY_PROFILE_FIELD_LABELS[error.field] ?? error.field;
    return `${label}: ${error.message}`;
  });
}
