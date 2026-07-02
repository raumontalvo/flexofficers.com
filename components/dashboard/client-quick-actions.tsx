"use client";

import Link from "next/link";
import {
  ApplicantsIcon,
  BillingIcon,
  BrowseIcon,
} from "@/components/nav/icons";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { MobileActionCard } from "@/components/ui/mobile";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

const actionConfig = [
  {
    href: "/client/leads/new",
    titleKey: "createLead" as const,
    descKey: "createLeadDesc" as const,
    icon: BrowseIcon,
    iconClassName: "bg-blue-500/20 text-blue-300",
  },
  {
    href: "/client/applicants",
    titleKey: "viewApplicants" as const,
    descKey: "viewApplicantsDesc" as const,
    icon: ApplicantsIcon,
    iconClassName: "bg-emerald-500/20 text-emerald-300",
  },
  {
    href: "/client/billing",
    titleKey: "billingHistory" as const,
    descKey: "billingHistoryDesc" as const,
    icon: BillingIcon,
    iconClassName: "bg-violet-500/20 text-violet-300",
  },
];

export function ClientQuickActions() {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.client.quickActions;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-bold text-fo-text">{t.common.quickActions}</h2>
        <p className="text-xs text-fo-text-muted">{t.common.quickActionsSubtitle}</p>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        {actionConfig.map((action) => {
          const Icon = action.icon;

          return (
            <MobileActionCard
              key={action.href}
              href={action.href}
              title={copy[action.titleKey]}
              description={copy[action.descKey]}
              icon={<Icon className="h-4 w-4" />}
              iconClassName={action.iconClassName}
              className="rounded-2xl p-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]"
            />
          );
        })}
      </div>

      <div className="hidden flex-col gap-2 lg:flex">
        {actionConfig.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.href} href={action.href} className="group block">
              <Card
                variant="elevated"
                padding="none"
                className="fo-glass-card fo-glass-card-hover flex items-center gap-3 border border-white/10 p-3.5"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    action.iconClassName
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm">{copy[action.titleKey]}</CardTitle>
                  <CardDescription className="text-xs leading-snug">
                    {copy[action.descKey]}
                  </CardDescription>
                </div>
                <span
                  className="shrink-0 text-xs text-fo-text-subtle transition group-hover:translate-x-0.5 group-hover:text-fo-primary-hover"
                  aria-hidden="true"
                >
                  →
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
