import {
  companyHasPublicProfile,
  sanitizeDisplayValue,
  serializeCompanyProfile,
  type SerializedCompanyProfile,
} from "@/lib/company-profile-page-data";
import { stripCompanyProfileMeta } from "@/lib/company-profile-meta";

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
  shifts: { requirements: string[] }[] = [],
  options: {
    /**
     * Only set true when the viewer is authorized (e.g. an officer with an
     * ACCEPTED application for one of this company's shifts). Controls whether
     * contact email/phone are released.
     */
    showContactDetails?: boolean;
    /** Fallback contact email (company owner's account email). */
    userEmail?: string;
  } = {}
): SerializedCompanyProfile | null {
  const { showContactDetails = false, userEmail } = options;

  const hasPublicProfile = companyHasPublicProfile({
    companyName: company.companyName,
    description: stripCompanyProfileMeta(company.description),
    city: sanitizeDisplayValue(company.city),
    state: sanitizeDisplayValue(company.state),
    website: sanitizeDisplayValue(company.website),
  });

  // Authorized officers can view the profile even when the company has not
  // published a public profile, so they can still reach the contact details.
  if (!hasPublicProfile && !showContactDetails) {
    return null;
  }

  return serializeCompanyProfile({
    company,
    userEmail: userEmail ?? company.email ?? "",
    shifts,
    showContactDetails,
  });
}
