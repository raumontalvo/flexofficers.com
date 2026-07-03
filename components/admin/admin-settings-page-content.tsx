"use client";

import { AccountSettingsContent } from "@/components/settings/account-settings-content";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { SectionHeading } from "@/components/ui";

export function AdminSettingsPageContent() {
  const { t } = useLandingLanguage();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <SectionHeading
        title={t.settings.pageTitle}
        subtitle={t.settings.pageSubtitle}
      />
      <AccountSettingsContent role="admin" />
    </div>
  );
}
