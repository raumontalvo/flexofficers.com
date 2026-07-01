"use client";

import { AccountSettingsContent } from "@/components/settings/account-settings-content";
import { CompanyMobileSettingsLinks } from "@/components/settings/company-mobile-settings-links";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { PageShell, SectionHeading } from "@/components/ui";

type SettingsPageContentProps = {
  role: "officer" | "company";
  nav: "officer" | "company";
};

export function SettingsPageContent({ role, nav }: SettingsPageContentProps) {
  const { t } = useLandingLanguage();

  return (
    <PageShell nav={nav} maxWidth="2xl" sidebar>
      <SectionHeading
        title={t.settings.pageTitle}
        subtitle={t.settings.pageSubtitle}
      />

      <div className="mt-8">
        {role === "company" ? <CompanyMobileSettingsLinks /> : null}
        <AccountSettingsContent role={role} />
      </div>
    </PageShell>
  );
}
