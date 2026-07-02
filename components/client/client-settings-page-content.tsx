"use client";

import { AccountSettingsContent } from "@/components/settings/account-settings-content";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { PageShell, SectionHeading } from "@/components/ui";

export function ClientSettingsPageContent() {
  const { t } = useLandingLanguage();

  return (
    <PageShell nav="client" maxWidth="2xl" sidebar>
      <SectionHeading
        title={t.settings.pageTitle}
        subtitle={t.settings.pageSubtitle}
      />
      <div className="mt-8">
        <AccountSettingsContent role="company" />
      </div>
    </PageShell>
  );
}
