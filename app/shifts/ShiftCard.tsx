import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { ShiftStatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftScheduleParts,
} from "@/lib/format-shift";
import type { ShiftCardData } from "@/lib/shift-card-data";
import { getShiftRequirementChips } from "@/lib/shift-requirements";

type ShiftCardProps = {
  shift: ShiftCardData;
};

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 2.5v2M11 2.5v2M2.5 6.5h11" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3.2l2 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M8 14s4-3.5 4-6.5a4 4 0 1 0-8 0C4 10.5 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="7.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ShiftCard({ shift }: ShiftCardProps) {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const hourlyRate = { toString: () => shift.hourlyRate };
  const openPositions = Math.max(shift.positionsNeeded - shift.filledCount, 0);
  const estimatedPay = formatEstimatedShiftPay(hourlyRate, startTime, endTime);
  const schedule = formatShiftScheduleParts(startTime, endTime);
  const allRequirementChips = getShiftRequirementChips(shift, 20);
  const requirementChips = allRequirementChips.slice(0, 3);
  const hiddenRequirementCount = Math.max(
    allRequirementChips.length - requirementChips.length,
    0
  );
  const locationLabel = formatShiftCityState(shift);
  const positionLabel =
    openPositions === 1
      ? "👥 1 Officer Needed"
      : `👥 ${openPositions} Officers Needed`;

  return (
    <>
      <article className="fo-glass-card overflow-hidden rounded-2xl border border-white/10 md:hidden">
        <div className="space-y-3 p-4">
          <ShiftStatusBadge
            status={shift.status}
            className="!min-h-5 !w-fit !px-2 !py-0.5 !text-[10px]"
          />

          <div className="space-y-1">
            <h2 className="text-base font-bold leading-snug text-fo-text">{shift.title}</h2>
            {shift.companyName ? (
              <p className="text-sm font-semibold text-fo-primary-bright">{shift.companyName}</p>
            ) : null}
          </div>

          <p className="flex items-center gap-1.5 text-sm text-fo-text-muted">
            <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="min-w-0 truncate">{locationLabel}</span>
          </p>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none text-fo-primary-bright">
                {formatHourlyRate(hourlyRate)}
                <span className="text-sm font-semibold text-fo-text-muted">/hr</span>
              </p>
              {estimatedPay ? (
                <p className="mt-1 text-xs text-fo-text-muted">Est. {estimatedPay}</p>
              ) : null}
            </div>

            <ShiftDetailLink
              shiftId={shift.id}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-fo-primary-bright/40 bg-fo-primary/10 px-3.5 py-2 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/15"
            >
              View Shift
            </ShiftDetailLink>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3 text-xs text-fo-text-muted">
            <span className="flex min-w-0 items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
              <span className="truncate">
                {schedule.weekday} {schedule.monthDay}
              </span>
            </span>
            <span className="flex min-w-0 items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
              <span className="truncate">{schedule.timeRange}</span>
            </span>
          </div>
        </div>
      </article>

      <article
        className={cn(
          "fo-glass-card fo-glass-card-hover hidden rounded-lg border border-white/10 transition md:block",
          "md:h-[88px] md:overflow-hidden"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-2.5 p-3",
            "md:grid md:h-full md:grid-cols-[48px_minmax(0,1fr)_minmax(92px,0.7fr)_minmax(72px,0.52fr)_minmax(0,0.55fr)_156px_auto] md:items-center md:gap-2 md:px-3 md:py-0"
          )}
        >
          <div className="flex shrink-0 items-center md:justify-center">
            <ShiftStatusBadge
              status={shift.status}
              className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5"
            />
          </div>

          <div className="min-w-0 overflow-hidden">
            <h2 className="truncate text-sm font-bold leading-tight text-fo-text">
              {shift.title}
            </h2>
            {shift.companyName ? (
              <p className="truncate text-xs font-medium leading-tight text-fo-primary-bright">
                {shift.companyName}
              </p>
            ) : null}
            <p className="mt-0.5 truncate text-[11px] leading-tight text-fo-text-muted">
              📍 {locationLabel}
            </p>
          </div>

          <div className="hidden min-w-0 overflow-hidden md:block">
            <p className="flex items-center gap-1 truncate text-[11px] leading-tight text-fo-text">
              <CalendarIcon className="h-3 w-3 shrink-0 text-fo-text-subtle" />
              <span className="truncate">
                {schedule.weekday} {schedule.monthDay}
              </span>
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] leading-tight text-fo-text-muted">
              <ClockIcon className="h-3 w-3 shrink-0 text-fo-text-subtle" />
              <span className="truncate">{schedule.timeRange}</span>
            </p>
          </div>

          <div className="min-w-0 shrink-0 overflow-hidden">
            <p className="truncate text-lg font-bold leading-none text-fo-primary-bright">
              {formatHourlyRate(hourlyRate)}
              <span className="text-[11px] font-semibold text-fo-text-muted">/hr</span>
            </p>
            {estimatedPay ? (
              <p className="mt-0.5 truncate text-[10px] leading-none text-fo-text-muted">
                Est. {estimatedPay}
              </p>
            ) : null}
          </div>

          <div className="hidden min-w-0 overflow-hidden md:block">
            {requirementChips.length > 0 ? (
              <div className="flex h-5 items-center gap-1 overflow-hidden">
                {requirementChips.map((chip) => (
                  <span
                    key={chip}
                    title={chip}
                    className="inline-flex max-w-[72px] shrink-0 truncate rounded border border-slate-600/50 bg-slate-800/50 px-1.5 py-0 text-[10px] font-medium leading-5 text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
                {hiddenRequirementCount > 0 ? (
                  <span className="shrink-0 text-[10px] font-medium text-fo-text-subtle">
                    +{hiddenRequirementCount}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="truncate text-[11px] text-fo-text-subtle">—</p>
            )}
          </div>

          <div className="hidden min-w-[156px] shrink-0 overflow-visible md:block">
            <p className="whitespace-nowrap text-[11px] font-medium leading-tight text-fo-text">
              {positionLabel}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2">
            <ShiftDetailLink
              shiftId={shift.id}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
            >
              View Shift →
            </ShiftDetailLink>
          </div>
        </div>
      </article>
    </>
  );
}
