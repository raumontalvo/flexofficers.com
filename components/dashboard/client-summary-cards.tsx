"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconClipboard, IconDollar } from "@/components/landing/icons";
import {
  ApplicantsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { Card } from "@/components/ui";
import { MobileStatGrid } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { ClientDashboardStats } from "@/lib/client-dashboard-data";
import { cn } from "@/lib/cn";

type ClientSummaryCardsProps = {
  stats: ClientDashboardStats;
  postingFeeLabel: string;
};

type StatCardConfig = {
  href: string;
  label: string;
  value: ReactNode;
  hint: string;
  linkLabel: string;
  tone: "blue" | "green" | "amber" | "purple";
  icon: ReactNode;
};

const toneClasses = {
  blue: "bg-blue-500/20 text-blue-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)]",
  green:
    "bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_-6px_rgba(16,185,129,0.35)]",
  amber:
    "bg-amber-500/20 text-amber-300 shadow-[0_0_20px_-6px_rgba(245,158,11,0.35)]",
  purple:
    "bg-violet-500/20 text-violet-300 shadow-[0_0_20px_-6px_rgba(139,92,246,0.35)]",
};

function ClientDashboardStatCard({
  href,
  label,
  value,
  hint,
  linkLabel,
  tone,
  icon,
}: StatCardConfig) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card fo-glass-card-hover flex h-full flex-col border border-white/10 p-4"
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              toneClasses[tone]
            )}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-fo-text-muted">{label}</p>
            <p className="mt-1 break-words text-2xl font-bold leading-none tracking-tight text-fo-text sm:text-3xl">
              {value}
            </p>
            <p className="mt-1.5 text-xs leading-snug text-fo-text-subtle">{hint}</p>
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-fo-primary-hover transition group-hover:text-fo-primary-bright">
          {linkLabel}
        </p>
      </Card>
    </Link>
  );
}

export function ClientSummaryCards({
  stats,
  postingFeeLabel,
}: ClientSummaryCardsProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.client;

  const cards: StatCardConfig[] = [
    {
      href: "/client/leads",
      label: copy.statMyLeads,
      value: stats.totalLeads,
      hint: copy.statMyLeadsHint,
      linkLabel: copy.statMyLeadsLink,
      tone: "blue",
      icon: <IconClipboard className="h-5 w-5" />,
    },
    {
      href: "/client/leads?status=active",
      label: copy.statActiveLeads,
      value: stats.activeLeads,
      hint: copy.statActiveLeadsHint,
      linkLabel: copy.statActiveLeadsLink,
      tone: "green",
      icon: <UpcomingIcon className="h-5 w-5" />,
    },
    {
      href: "/client/applicants",
      label: copy.statPendingApplicants,
      value: stats.pendingApplicants,
      hint: copy.statPendingApplicantsHint,
      linkLabel: copy.statPendingApplicantsLink,
      tone: "amber",
      icon: <ApplicantsIcon className="h-5 w-5" />,
    },
    {
      href: "/client/billing",
      label: copy.statPostingFee,
      value: postingFeeLabel,
      hint: copy.statPostingFeeHint,
      linkLabel: copy.statPostingFeeLink,
      tone: "purple",
      icon: <IconDollar className="h-5 w-5" />,
    },
  ];

  return (
    <MobileStatGrid desktopColumns={4} className="gap-4 md:gap-3">
      {cards.map((card) => (
        <ClientDashboardStatCard key={card.href} {...card} />
      ))}
    </MobileStatGrid>
  );
}
