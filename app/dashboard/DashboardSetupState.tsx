"use client";

import Link from "next/link";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
import DashboardSignOutButton from "./SignOutButton";

type DashboardSetupStateProps = {
  firstName?: string | null;
  variant: "onboarding" | "officer-profile" | "company-profile";
};

const variantConfig = {
  onboarding: {
    copyKey: "onboarding" as const,
    actionHref: "/onboarding",
    nav: "none" as const,
  },
  "officer-profile": {
    copyKey: "officerProfile" as const,
    actionHref: "/officer/profile",
    nav: "officer" as const,
  },
  "company-profile": {
    copyKey: "companyProfile" as const,
    actionHref: "/company/profile",
    nav: "company" as const,
  },
};

export function DashboardSetupState({
  firstName,
  variant,
}: DashboardSetupStateProps) {
  const { t } = useLandingLanguage();
  const config = variantConfig[variant];
  const content = t.dashboard.setup[config.copyKey];
  const welcomeName = firstName?.trim();
  const title = welcomeName
    ? interpolate(t.common.welcomeName, { name: welcomeName })
    : t.common.welcome;

  return (
    <PageShell
      nav={config.nav}
      maxWidth="2xl"
      sidebar={config.nav !== "none"}
    >
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          title={title}
          subtitle={t.common.finishSetup}
          className="flex-1"
        />
        <DashboardSignOutButton />
      </div>

      <Card
        variant="elevated"
        className="fo-glass-card mt-8 border-yellow-500/20 bg-fo-pending-bg"
      >
        <CardTitle className="text-lg text-fo-pending">{content.title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed text-fo-text">
          {content.description}
        </CardDescription>
        <Link
          href={config.actionHref}
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "mt-5 border-yellow-500/30 text-fo-pending hover:bg-yellow-500/10",
          })}
        >
          {content.action}
        </Link>
      </Card>
    </PageShell>
  );
}
