import { StatCard } from "@/components/ui";

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
  filledThisMonth: number;
  upcomingConfirmedCount: number;
};

export function CompanySummaryCards({
  shiftStats,
  applicationStats,
  filledThisMonth,
  upcomingConfirmedCount,
}: CompanySummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Shifts"
        value={shiftStats.total}
        tone="blue"
        hint={`Open ${shiftStats.open} · Filled ${shiftStats.filled} · Past ${shiftStats.past}`}
      />
      <StatCard
        label="Applications"
        value={applicationStats.total}
        tone="purple"
        hint={`New ${applicationStats.new} · Reviewed ${applicationStats.reviewed}`}
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
    </div>
  );
}
