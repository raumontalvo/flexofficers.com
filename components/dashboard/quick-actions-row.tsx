"use client";

import Link from "next/link";
import {
  AcceptedIcon,
  BrowseIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

const quickActionConfig = [
  {
    href: "/shifts",
    titleKey: "browseShifts" as const,
    descKey: "browseShiftsDesc" as const,
    icon: BrowseIcon,
    iconClassName: "bg-blue-500/20 text-blue-300",
  },
  {
    href: "/officer/applications",
    titleKey: "applications" as const,
    descKey: "applicationsDesc" as const,
    icon: ShiftsIcon,
    iconClassName: "bg-violet-500/20 text-violet-300",
  },
  {
    href: "/officer/accepted-shifts",
    titleKey: "acceptedShifts" as const,
    descKey: "acceptedShiftsDesc" as const,
    icon: AcceptedIcon,
    iconClassName: "bg-emerald-500/20 text-emerald-300",
  },
  {
    href: "/officer/upcoming-shifts",
    titleKey: "upcomingShifts" as const,
    descKey: "upcomingShiftsDesc" as const,
    icon: UpcomingIcon,
    iconClassName: "bg-amber-500/20 text-amber-300",
  },
];

type QuickActionsRowProps = {
  className?: string;
};

export function QuickActionsRow({ className }: QuickActionsRowProps) {
  const { t } = useLandingLanguage();
  const actions = t.dashboard.officer.quickActions;

  return (
    <section className={cn("space-y-2.5", className)}>
      <div>
        <h2 className="text-base font-bold text-fo-text">{t.common.quickActions}</h2>
        <p className="text-xs text-fo-text-muted">{t.common.quickActionsSubtitle}</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {quickActionConfig.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.href} href={action.href} className="group block h-full">
              <Card
                variant="elevated"
                padding="none"
                className="fo-glass-card fo-glass-card-hover flex h-full flex-col gap-2.5 p-3.5"
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
