import { StatCard, MobileStatGrid } from "@/components/ui";

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
    <MobileStatGrid>
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
  );
}
