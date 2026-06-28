import {
  companyHasPublicProfile,
  sanitizeDisplayValue,
  serializeCompanyProfile,
  type SerializedCompanyProfile,
} from "@/lib/company-profile-page-data";

type CompanyRecord = {
  id: string;
  companyName: string;
  logoUrl: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  verified: boolean;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  createdAt: Date;
};

export type { SerializedCompanyProfile };

export function serializePublicCompanyProfile(
  company: CompanyRecord,
  shifts: { requirements: string[] }[] = []
): SerializedCompanyProfile | null {
  if (
    !companyHasPublicProfile({
      companyName: company.companyName,
      description: sanitizeDisplayValue(company.description),
      city: sanitizeDisplayValue(company.city),
      state: sanitizeDisplayValue(company.state),
      website: sanitizeDisplayValue(company.website),
    })
  ) {
    return null;
  }

  return serializeCompanyProfile({
    company,
    userEmail: company.email ?? "",
    shifts,
    showContactDetails: false,
  });
}
