"use client";

import Link from "next/link";
import {
  ApplicantsIcon,
  SearchIcon,
  ShiftsIcon,
  StaffIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { MobileActionCard } from "@/components/ui/mobile";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

const actionConfig = [
  {
    href: "/shifts/create",
    titleKey: "postShift" as const,
    descKey: "postShiftDesc" as const,
    icon: ShiftsIcon,
    iconClassName: "bg-blue-500/20 text-blue-300",
  },
  {
    href: "/company/applications",
    titleKey: "viewApplicants" as const,
    descKey: "viewApplicantsDesc" as const,
    icon: ApplicantsIcon,
    iconClassName: "bg-violet-500/20 text-violet-300",
  },
  {
    href: "/company/accepted-officers",
    titleKey: "upcomingShifts" as const,
    descKey: "upcomingShiftsDesc" as const,
    icon: UpcomingIcon,
    iconClassName: "bg-amber-500/20 text-amber-300",
  },
  {
    href: "/company/officers",
    titleKey: "manageOfficers" as const,
    descKey: "manageOfficersDesc" as const,
    icon: SearchIcon,
    iconClassName: "bg-emerald-500/20 text-emerald-300",
  },
  {
    href: "/company/staff",
    titleKey: "staff" as const,
    descKey: "staffDesc" as const,
    icon: StaffIcon,
    iconClassName: "bg-sky-500/20 text-sky-300",
  },
];

export function CompanyQuickActions({ canPostShifts }: { canPostShifts: boolean }) {
  const { t } = useLandingLanguage();
  const actions = t.dashboard.company.quickActions;
  const postShiftHref = canPostShifts ? "/shifts/create" : "/company/billing";

  return (
    <section className="space-y-2.5">
      <div>
        <h2 className="text-base font-bold text-fo-text">{t.common.quickActions}</h2>
        <p className="text-xs text-fo-text-muted">{t.common.quickActionsSubtitle}</p>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        {actionConfig.map((action) => {
          const Icon = action.icon;
          const href =
            action.href === "/shifts/create" ? postShiftHref : action.href;

          return (
            <MobileActionCard
              key={action.href}
              href={href}
              title={actions[action.titleKey]}
              description={actions[action.descKey]}
              icon={<Icon className="h-4 w-4" />}
              iconClassName={action.iconClassName}
              className="rounded-2xl p-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]"
            />
          );
        })}
      </div>

      <div className="hidden grid-cols-1 gap-2 sm:grid-cols-2 lg:grid lg:grid-cols-3">
        {actionConfig.map((action) => {
          const Icon = action.icon;
          const href =
            action.href === "/shifts/create" ? postShiftHref : action.href;

          return (
            <Link key={action.href} href={href} className="group block h-full">
              <Card
                variant="elevated"
                padding="none"
                className="fo-glass-card fo-glass-card-hover flex h-full flex-col gap-2 p-3 sm:gap-2.5 sm:p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      action.iconClassName
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className="text-xs text-fo-text-subtle transition group-hover:translate-x-0.5 group-hover:text-fo-primary-hover"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
                <div className="space-y-0.5">
                  <CardTitle className="text-sm">{actions[action.titleKey]}</CardTitle>
                  <CardDescription className="text-xs leading-snug">
                    {actions[action.descKey]}
                  </CardDescription>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
