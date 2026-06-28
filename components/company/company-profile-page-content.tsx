"use client";

import { CompanyProfileView } from "@/components/company/company-profile-view";
import type { SerializedCompanyProfile } from "@/lib/company-profile-page-data";

type CompanyProfilePageContentProps = {
  profile: SerializedCompanyProfile;
};

export function CompanyProfilePageContent({
  profile,
}: CompanyProfilePageContentProps) {
  return <CompanyProfileView profile={profile} mode="owner" />;
}
