import Link from "next/link";
import { formatShiftCityState } from "@/lib/format-shift";
import { Card } from "@/components/ui";

export type SerializedUpcomingShift = {
  id: string;
  title: string;
  startTime: string;
  city: string | null;
  state: string | null;
  location: string;
  openPositions: number;
};

function formatUpcomingDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type CompanyUpcomingShiftsProps = {
  shifts: SerializedUpcomingShift[];
};

export function CompanyUpcomingShifts({ shifts }: CompanyUpcomingShiftsProps) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card border border-white/10 p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-fo-text">Upcoming Shifts</h2>
        <Link
          href="/company/accepted-officers"
          className="text-xs font-semibold text-fo-primary-hover hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {shifts.length === 0 ? (
          <p className="text-sm text-fo-text-muted">
            No confirmed shifts in the next 7 days.
          </p>
        ) : (
          shifts.slice(0, 5).map((shift) => (
            <Link
              key={shift.id}
              href={`/shifts/${shift.id}`}
              className="block rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.05]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-primary-hover">
                {formatUpcomingDate(shift.startTime)}
              </p>
              <p className="mt-1 text-sm font-semibold text-fo-text">
                {shift.title}
              </p>
              <p className="mt-1 text-xs text-fo-text-muted">
                {formatShiftCityState(shift)}
              </p>
              <p className="mt-2 text-xs text-fo-text-muted">
                {shift.openPositions} open position
                {shift.openPositions === 1 ? "" : "s"} remaining
              </p>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
