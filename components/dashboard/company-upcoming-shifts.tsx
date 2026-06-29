import Link from "next/link";
import {
  formatShiftCityState,
  formatShiftTimeBadgeParts,
} from "@/lib/format-shift";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

export type SerializedUpcomingShift = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
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

function formatDateBadge(value: string) {
  const date = new Date(value);

  return {
    weekday: date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    monthDay: date
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase(),
  };
}

function UpcomingShiftMobileCard({ shift }: { shift: SerializedUpcomingShift }) {
  const badge = formatDateBadge(shift.startTime);
  const location = formatShiftCityState(shift);
  const timeBadge = formatShiftTimeBadgeParts(
    new Date(shift.startTime),
    new Date(shift.endTime)
  );

  return (
    <Link
      href={`/shifts/${shift.id}`}
      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] transition hover:bg-white/[0.05]"
    >
      <div className="flex w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border border-fo-primary-bright/20 bg-fo-primary-bright/10 px-2 py-2 text-center">
        <span className="text-[10px] font-bold tracking-wide text-fo-primary-hover">
          {badge.weekday}
        </span>
        <span className="mt-0.5 text-[10px] font-bold leading-tight text-fo-primary-hover">
          {badge.monthDay}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fo-text">{shift.title}</p>
        <p className="mt-0.5 truncate text-xs text-fo-text-muted">{location}</p>
        <p className="mt-1.5 text-xs text-fo-text-muted">
          {shift.openPositions} open position
          {shift.openPositions === 1 ? "" : "s"} remaining
        </p>
      </div>

      <div className="flex w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-1.5 py-2 text-center">
        <span className="text-[10px] font-bold leading-tight text-fo-text">
          {timeBadge.start}
        </span>
        <span className="my-0.5 text-[9px] font-medium uppercase tracking-wide text-fo-text-subtle">
          to
        </span>
        <span className="text-[10px] font-bold leading-tight text-fo-text">
          {timeBadge.end}
        </span>
      </div>
    </Link>
  );
}

type CompanyUpcomingShiftsProps = {
  shifts: SerializedUpcomingShift[];
  mobileShifts?: SerializedUpcomingShift[];
};

export function CompanyUpcomingShifts({
  shifts,
  mobileShifts,
}: CompanyUpcomingShiftsProps) {
  const mobilePreviewShifts = mobileShifts ?? shifts.slice(0, 2);

  return (
    <>
      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card border border-white/10 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] lg:hidden"
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

        <div className="mt-3.5 space-y-2.5">
          {mobilePreviewShifts.length === 0 ? (
            <p className="text-sm text-fo-text-muted">
              No confirmed shifts starting soon.
            </p>
          ) : (
            mobilePreviewShifts.map((shift) => (
              <UpcomingShiftMobileCard key={shift.id} shift={shift} />
            ))
          )}
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="none"
        className={cn(
          "fo-glass-card hidden border border-white/10 p-4 lg:block"
        )}
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
    </>
  );
}
