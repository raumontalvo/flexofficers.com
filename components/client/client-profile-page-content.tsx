"use client";

import { ClientProfileView } from "@/components/client/client-profile-view";
import type { SerializedClientProfile } from "@/lib/client-profile-page-data";

type ClientProfilePageContentProps = {
  profile: SerializedClientProfile;
};

export function ClientProfilePageContent({ profile }: ClientProfilePageContentProps) {
  return <ClientProfileView profile={profile} />;
}
