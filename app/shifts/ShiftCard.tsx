import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { ShiftStatusBadge, buttonClassName } from "@/components/ui";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftScheduleParts,
} from "@/lib/format-shift";
import { fromShiftWorkType } from "@/lib/shift-form-options";
import type { ShiftCardData } from "@/lib/shift-card-data";

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

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect x="3" y="5.5" width="10" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 5.5V4.8a1.3 1.3 0 0 1 1.3-1.3h1.4A1.3 1.3 0 0 1 10 4.8V5.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function formatOfficersNeededLabel(count: number) {
  return count === 1 ? "1 officer needed" : `${count} officers needed`;
}

export function ShiftCard({ shift }: ShiftCardProps) {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const hourlyRate = { toString: () => shift.hourlyRate };
  const openPositions = Math.max(shift.positionsNeeded - shift.filledCount, 0);
  const estimatedPay = formatEstimatedShiftPay(hourlyRate, startTime, endTime);
  const schedule = formatShiftScheduleParts(startTime, endTime);
  const locationLabel = formatShiftCityState(shift);
  const workTypeLabel = fromShiftWorkType(shift.workType ?? null);

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

      <article className="fo-glass-card fo-glass-card-hover hidden min-h-[140px] rounded-xl border border-white/10 transition md:block">
        <div className="grid h-full min-h-[140px] grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)] gap-5 p-5">
          <div className="flex min-w-0 flex-col justify-center gap-3 border-r border-white/[0.06] pr-5">
            <ShiftStatusBadge
              status={shift.status}
              className="!min-h-5 !w-fit !px-2 !py-0.5 !text-[10px]"
            />

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold leading-tight text-fo-text">{shift.title}</h2>
              {shift.companyName ? (
                <p className="text-base font-semibold text-fo-primary-bright">
                  {shift.companyName}
                </p>
              ) : null}
            </div>

            <p className="flex items-start gap-2 text-sm leading-snug text-fo-text-muted">
              <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span className="min-w-0">{locationLabel}</span>
            </p>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-2 border-r border-white/[0.06] px-1 pr-5">
            <p className="flex items-center gap-2 text-sm text-fo-text">
              <CalendarIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
              <span>
                {schedule.weekday}, {schedule.monthDay}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm text-fo-text-muted">
              <ClockIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
              <span>{schedule.timeRange}</span>
            </p>
            {workTypeLabel ? (
              <p className="flex items-center gap-2 text-sm text-fo-text-subtle">
                <BriefcaseIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
                <span>{workTypeLabel}</span>
              </p>
            ) : null}
            <div className="mt-1 border-t border-white/[0.06] pt-2.5">
              <p className="text-2xl font-bold leading-none text-fo-primary-bright">
                {formatHourlyRate(hourlyRate)}
                <span className="ml-1 text-sm font-semibold text-fo-text-muted">/hr</span>
              </p>
              {estimatedPay ? (
                <p className="mt-1 text-sm text-fo-text-muted">Est. earnings {estimatedPay}</p>
              ) : (
                <p className="mt-1 text-sm text-fo-text-subtle">Estimated earnings unavailable</p>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-muted">
                Officers needed
              </p>
              <p className="text-sm font-semibold text-fo-text">
                {formatOfficersNeededLabel(openPositions)}
              </p>
              <p className="text-xs text-fo-text-subtle">
                {openPositions} of {shift.positionsNeeded} open
              </p>
            </div>

            <ShiftDetailLink
              shiftId={shift.id}
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className:
                  "min-h-10 w-full border-fo-primary-bright/40 text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10",
              })}
            >
              View Shift
            </ShiftDetailLink>
          </div>
        </div>
      </article>
    </>
  );
}
