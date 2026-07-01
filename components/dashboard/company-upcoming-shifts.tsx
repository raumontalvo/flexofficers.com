"use client";

import Link from "next/link";
import {
  formatShiftCityState,
  formatShiftTimeBadgeParts,
} from "@/lib/format-shift";
import { Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
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

function useDateLocale() {
  const { language } = useLandingLanguage();
  return language === "es" ? "es-US" : "en-US";
}

function UpcomingShiftMobileCard({ shift }: { shift: SerializedUpcomingShift }) {
  const { t } = useLandingLanguage();
  const locale = useDateLocale();
  const copy = t.dashboard.company;
  const date = new Date(shift.startTime);
  const badge = {
    weekday: date.toLocaleDateString(locale, { weekday: "short" }).toUpperCase(),
    monthDay: date
      .toLocaleDateString(locale, { month: "short", day: "numeric" })
      .toUpperCase(),
  };
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
          {shift.openPositions === 1
            ? copy.openPositionsOne
            : interpolate(copy.openPositions, { count: shift.openPositions })}
        </p>
      </div>

      <div className="flex w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-1.5 py-2 text-center">
        <span className="text-[10px] font-bold leading-tight text-fo-text">
          {timeBadge.start}
        </span>
        <span className="my-0.5 text-[9px] font-medium uppercase tracking-wide text-fo-text-subtle">
          {t.common.to}
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
  const { t } = useLandingLanguage();
  const locale = useDateLocale();
  const copy = t.dashboard.company;
  const mobilePreviewShifts = mobileShifts ?? shifts.slice(0, 2);

  function formatUpcomingDate(value: string) {
    return new Date(value).toLocaleDateString(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <>
      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card border border-white/10 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] lg:hidden"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-fo-text">{copy.upcomingShifts}</h2>
          <Link
            href="/company/accepted-officers"
            className="text-xs font-semibold text-fo-primary-hover hover:underline"
          >
            {t.common.viewAll}
          </Link>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {mobilePreviewShifts.length === 0 ? (
            <p className="text-sm text-fo-text-muted">{copy.noConfirmedSoon}</p>
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
          <h2 className="text-base font-bold text-fo-text">{copy.upcomingShifts}</h2>
          <Link
            href="/company/accepted-officers"
            className="text-xs font-semibold text-fo-primary-hover hover:underline"
          >
            {t.common.viewAll}
          </Link>
        </div>

        {shifts.length === 0 ? (
          <p className="mt-4 text-sm text-fo-text-muted">{copy.noConfirmed7Days}</p>
        ) : (
          <div className="mt-4">
            <div className="grid grid-cols-[7.5rem_minmax(0,1.2fr)_minmax(0,1fr)_6.5rem] gap-x-4 border-b border-white/[0.06] px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-fo-text-muted">
              <div>{copy.tableDate}</div>
              <div>{copy.tableShift}</div>
              <div>{copy.tableLocation}</div>
              <div className="text-right">{copy.tableOpen}</div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {shifts.slice(0, 5).map((shift) => (
                <Link
                  key={shift.id}
                  href={`/shifts/${shift.id}`}
                  className="grid grid-cols-[7.5rem_minmax(0,1.2fr)_minmax(0,1fr)_6.5rem] items-center gap-x-4 px-3 py-3 transition hover:bg-white/[0.03]"
                >
                  <p className="text-xs font-semibold text-fo-primary-hover">
                    {formatUpcomingDate(shift.startTime)}
                  </p>
                  <p className="truncate text-sm font-semibold text-fo-text">
                    {shift.title}
                  </p>
                  <p className="truncate text-xs text-fo-text-muted">
                    {formatShiftCityState(shift)}
                  </p>
                  <p className="text-right text-xs font-medium text-fo-text-muted">
                    {interpolate(copy.openCount, { count: shift.openPositions })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
