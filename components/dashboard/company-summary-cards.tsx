"use client";

import {
  ApplicantsIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { StatCard, MobileStatGrid } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";

function AcceptedShiftsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CompanySummaryCardsProps = {
  shiftStats: {
    total: number;
    open: number;
    filled: number;
    past: number;
  };
  applicationStats: {
    total: number;
    new: number;
    reviewed: number;
  };
  applicationsSummary: {
    total: number;
    pending: number;
    invited: number;
    accepted: number;
  };
  filledThisMonth: number;
  upcomingConfirmedCount: number;
};

export function CompanySummaryCards({
  shiftStats,
  applicationsSummary,
  filledThisMonth,
  upcomingConfirmedCount,
}: CompanySummaryCardsProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.company;

  return (
    <>
      <MobileStatGrid className="gap-3.5 lg:hidden">
        <StatCard
          label={copy.statTotalShifts}
          value={shiftStats.total}
          tone="blue"
          icon={<ShiftsIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.statApplicants}
          value={applicationsSummary.total}
          tone="purple"
          icon={<ApplicantsIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.statFilledShifts}
          value={filledThisMonth}
          tone="green"
          icon={<AcceptedShiftsIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.statUpcomingShifts}
          value={upcomingConfirmedCount}
          tone="amber"
          icon={<UpcomingIcon className="h-5 w-5" />}
        />
      </MobileStatGrid>

      <MobileStatGrid className="hidden lg:grid">
        <StatCard
          label={copy.statTotalShifts}
          value={shiftStats.total}
          tone="blue"
          hint={interpolate(copy.statOpenFilledPast, {
            open: shiftStats.open,
            filled: shiftStats.filled,
            past: shiftStats.past,
          })}
        />
        <StatCard
          label={copy.statApplicants}
          value={applicationsSummary.total}
          tone="purple"
          hint={interpolate(copy.statApplicantBreakdown, {
            pending: applicationsSummary.pending,
            invited: applicationsSummary.invited,
            accepted: applicationsSummary.accepted,
          })}
        />
        <StatCard
          label={copy.statFilledShifts}
          value={filledThisMonth}
          tone="green"
          hint={copy.statFilledThisMonth}
        />
        <StatCard
          label={copy.statUpcomingShifts}
          value={upcomingConfirmedCount}
          tone="amber"
          hint={copy.statConfirmedNext7}
        />
      </MobileStatGrid>
    </>
  );
}
