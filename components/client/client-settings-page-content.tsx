"use client";

import { AccountSettingsContent } from "@/components/settings/account-settings-content";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { PageShell, SectionHeading } from "@/components/ui";

export function ClientSettingsPageContent() {
  const { t } = useLandingLanguage();

  return (
    <PageShell nav="client" maxWidth="2xl" sidebar>
      <div className="min-w-0 space-y-8">
        <SectionHeading
          title={t.settings.pageTitle}
          subtitle={t.settings.pageSubtitle}
        />
        <AccountSettingsContent role="company" />
      </div>
    </PageShell>
  );
}
