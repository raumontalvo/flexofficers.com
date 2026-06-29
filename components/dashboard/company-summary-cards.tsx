import {
  ApplicantsIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { StatCard, MobileStatGrid } from "@/components/ui";

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
  return (
    <>
      <MobileStatGrid className="gap-3.5 lg:hidden">
        <StatCard
          label="Total Shifts"
          value={shiftStats.total}
          tone="blue"
          showChevron
          icon={<ShiftsIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Applicants"
          value={applicationsSummary.total}
          tone="purple"
          showChevron
          icon={<ApplicantsIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Filled Shifts"
          value={filledThisMonth}
          tone="green"
          showChevron
          icon={<AcceptedShiftsIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Upcoming Shifts"
          value={upcomingConfirmedCount}
          tone="amber"
          showChevron
          icon={<UpcomingIcon className="h-5 w-5" />}
        />
      </MobileStatGrid>

      <MobileStatGrid className="hidden lg:grid">
        <StatCard
          label="Total Shifts"
          value={shiftStats.total}
          tone="blue"
          hint={`Open ${shiftStats.open} · Filled ${shiftStats.filled} · Past ${shiftStats.past}`}
        />
        <StatCard
          label="Applicants"
          value={applicationsSummary.total}
          tone="purple"
          hint={`${applicationsSummary.pending} Pending · ${applicationsSummary.invited} Invited · ${applicationsSummary.accepted} Accepted`}
        />
        <StatCard
          label="Filled Shifts"
          value={filledThisMonth}
          tone="green"
          hint="Filled this month"
        />
        <StatCard
          label="Upcoming Shifts"
          value={upcomingConfirmedCount}
          tone="amber"
          hint="Confirmed in the next 7 days"
        />
      </MobileStatGrid>
    </>
  );
}
