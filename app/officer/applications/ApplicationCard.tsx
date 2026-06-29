"use client";

import { ApplicationStatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftScheduleParts,
} from "@/lib/format-shift";
import { fromShiftTimeType } from "@/lib/shift-form-options";
import {
  formatAppliedDate,
  type OfficerApplicationData,
} from "@/lib/officer-application-data";
import { getShiftRequirementChips } from "@/lib/shift-requirements";
import { ApplicationActions } from "./ApplicationActions";

type ApplicationCardProps = {
  application: OfficerApplicationData;
  onListChange: () => void;
  onDeleted?: (applicationId: string) => void;
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

export function ApplicationCard({
  application,
  onListChange,
  onDeleted,
}: ApplicationCardProps) {
  const { shift } = application;
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const hourlyRate = { toString: () => shift.hourlyRate };
  const schedule = formatShiftScheduleParts(startTime, endTime);
  const estimatedPay = formatEstimatedShiftPay(hourlyRate, startTime, endTime);
  const locationLabel = formatShiftCityState(shift);
  const shiftTimeLabel = fromShiftTimeType(shift.shiftTimeType);
  const allRequirementChips = getShiftRequirementChips(shift, 20);
  const requirementChips = allRequirementChips.slice(0, 3);
  const hiddenRequirementCount = Math.max(
    allRequirementChips.length - requirementChips.length,
    0
  );

  return (
    <>
      <article className="fo-glass-card overflow-hidden rounded-2xl border border-white/10 md:hidden">
        <div className="space-y-2.5 p-4">
          <ApplicationStatusBadge
            status={application.status}
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

          <div>
            <p className="text-2xl font-bold leading-none text-fo-primary-bright">
              {formatHourlyRate(hourlyRate)}
              <span className="text-sm font-semibold text-fo-text-muted">/hr</span>
            </p>
            {estimatedPay ? (
              <p className="mt-1 text-xs text-fo-text-muted">Est. {estimatedPay}</p>
            ) : null}
          </div>

          <div className="space-y-2 border-t border-white/[0.06] pt-2.5">
            <div className="flex items-center gap-3 text-xs text-fo-text-muted">
              <span className="flex min-w-0 items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  {schedule.weekday} {schedule.monthDay}
                </span>
              </span>
              <span className="flex min-w-0 items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{schedule.timeRange}</span>
              </span>
            </div>

            <p className="text-xs text-fo-text-muted">
              Applied {formatAppliedDate(application.appliedAt)}
            </p>
          </div>

          <ApplicationActions
            applicationId={application.id}
            shiftId={shift.id}
            status={application.status}
            shiftStatus={shift.status}
            shiftEndTime={shift.endTime}
            onListChange={onListChange}
            onDeleted={onDeleted}
            layout="mobile-row"
          />
        </div>
      </article>

      <article
        className={cn(
          "fo-glass-card fo-glass-card-hover hidden rounded-lg border border-white/10 transition md:block",
          "md:h-[116px] md:overflow-hidden"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3 p-3",
            "md:grid md:h-full md:grid-cols-[76px_minmax(0,1.05fr)_minmax(108px,0.82fr)_minmax(84px,0.55fr)_minmax(0,0.72fr)_minmax(92px,0.48fr)_auto] md:items-center md:gap-2.5 md:px-3 md:py-0"
          )}
        >
          <div className="flex shrink-0 items-center md:justify-center">
            <ApplicationStatusBadge
              status={application.status}
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
            {shiftTimeLabel ? (
              <p className="mt-0.5 truncate text-[10px] leading-tight text-fo-text-subtle">
                {shiftTimeLabel}
              </p>
            ) : null}
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
              <div className="flex h-5 flex-wrap items-center gap-1 overflow-hidden">
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

          <div className="hidden min-w-0 shrink-0 md:block">
            <p className="text-[10px] font-medium uppercase tracking-wide text-fo-text-subtle">
              Applied on
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[11px] font-medium leading-tight text-fo-text">
              {formatAppliedDate(application.appliedAt)}
            </p>
          </div>

          <ApplicationActions
            applicationId={application.id}
            shiftId={shift.id}
            status={application.status}
            shiftStatus={shift.status}
            shiftEndTime={shift.endTime}
            onListChange={onListChange}
            onDeleted={onDeleted}
          />
        </div>
      </article>
    </>
  );
}
