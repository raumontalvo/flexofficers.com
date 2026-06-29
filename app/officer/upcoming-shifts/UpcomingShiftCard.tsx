"use client";

import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { StatusBadge, buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftScheduleParts,
} from "@/lib/format-shift";
import { fromShiftTimeType } from "@/lib/shift-form-options";
import { hasCompanyContact, type OfficerAcceptedShiftData } from "@/lib/officer-accepted-shift-data";
import {
  formatStartsInLabel,
  getDaysUntilStart,
  getUpcomingUrgencyTone,
} from "@/lib/officer-upcoming-shift-data";
import { getShiftRequirementChips } from "@/lib/shift-requirements";

const urgencyToneClasses = {
  urgent: "border-red-500/40 bg-red-500/10 text-red-200",
  soon: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  relaxed: "border-sky-500/40 bg-sky-500/10 text-sky-200",
};

type UpcomingShiftCardProps = {
  application: OfficerAcceptedShiftData;
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

export function UpcomingShiftCard({ application }: UpcomingShiftCardProps) {
  const { shift, company } = application;
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const hourlyRate = { toString: () => shift.hourlyRate };
  const schedule = formatShiftScheduleParts(startTime, endTime);
  const estimatedPay = formatEstimatedShiftPay(hourlyRate, startTime, endTime);
  const locationLabel = formatShiftCityState(shift);
  const shiftTimeLabel = fromShiftTimeType(shift.shiftTimeType);
  const requirementChips = getShiftRequirementChips(shift, 6);
  const contactAvailable = hasCompanyContact(company);
  const daysUntilStart = getDaysUntilStart(shift.startTime);
  const urgencyLabel = formatStartsInLabel(daysUntilStart);
  const urgencyTone = getUpcomingUrgencyTone(daysUntilStart);

  return (
    <>
      <article className="fo-glass-card overflow-hidden rounded-2xl border border-white/10 border-l-[3px] border-l-emerald-500/70 lg:hidden">
        <div className="space-y-2.5 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                urgencyToneClasses[urgencyTone]
              )}
            >
              {urgencyLabel}
            </span>
            <StatusBadge
              variant="success"
              className="!min-h-5 !w-fit !px-2 !py-0.5 !text-[10px]"
            >
              CONFIRMED
            </StatusBadge>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-base font-bold leading-snug text-fo-text">{shift.title}</h2>
            <p className="text-sm font-semibold text-fo-primary-bright">{company.companyName}</p>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-fo-text-muted">
            <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="min-w-0 truncate">{locationLabel}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fo-text-muted">
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

          {shiftTimeLabel ? (
            <p className="text-xs text-fo-text-subtle">{shiftTimeLabel}</p>
          ) : null}

          <div>
            <p className="text-xl font-bold leading-none text-fo-primary-bright">
              {formatHourlyRate(hourlyRate)}
              <span className="text-sm font-semibold text-fo-text-muted">/hr</span>
            </p>
            {estimatedPay ? (
              <p className="mt-0.5 text-xs text-fo-text-muted">Est. {estimatedPay}</p>
            ) : null}
          </div>

          <ShiftDetailLink
            shiftId={shift.id}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className:
                "mt-1 w-full border-fo-primary-bright/40 text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10",
            })}
          >
            View Details
          </ShiftDetailLink>
        </div>
      </article>

      <article className="fo-glass-card fo-glass-card-hover hidden rounded-lg border border-white/10 transition lg:block">
        <div className="flex flex-col gap-3 p-3 lg:grid lg:grid-cols-[108px_minmax(0,1.1fr)_minmax(120px,0.9fr)_minmax(88px,0.55fr)_minmax(0,0.75fr)_minmax(0,0.85fr)_auto] lg:items-center lg:gap-2.5 lg:px-3 lg:py-2.5">
          <div className="flex items-center lg:justify-center">
            <span
              className={cn(
                "inline-flex min-h-[52px] w-full max-w-[108px] flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center text-[10px] font-semibold leading-tight",
                urgencyToneClasses[urgencyTone]
              )}
            >
              {urgencyLabel}
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <StatusBadge
              variant="success"
              className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5"
            >
              CONFIRMED
            </StatusBadge>
            <h2 className="truncate text-sm font-bold leading-tight text-fo-text">
              {shift.title}
            </h2>
            <p className="truncate text-xs font-medium text-fo-primary-bright">
              {company.companyName}
            </p>
            <p className="truncate text-[11px] text-fo-text-muted">
              📍 {locationLabel}
            </p>
          </div>

          <div className="min-w-0 space-y-0.5 text-[11px] leading-tight">
            <p className="text-fo-text">📅 {schedule.weekday}, {schedule.monthDay}</p>
            <p className="text-fo-text-muted">🕑 {schedule.timeRange}</p>
            {shiftTimeLabel ? (
              <p className="text-[10px] text-fo-text-subtle">{shiftTimeLabel}</p>
            ) : null}
          </div>

          <div className="min-w-0 shrink-0">
            <p className="text-lg font-bold leading-none text-fo-primary-bright">
              {formatHourlyRate(hourlyRate)}
              <span className="text-[11px] font-semibold text-fo-text-muted">/hr</span>
            </p>
            {estimatedPay ? (
              <p className="mt-0.5 text-[10px] text-fo-text-muted">
                Est. {estimatedPay}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            {requirementChips.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {requirementChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-slate-600/50 bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-fo-text-subtle">—</p>
            )}
          </div>

          <div className="min-w-0">
            {contactAvailable ? (
              <div className="space-y-0.5 text-[10px] leading-tight text-fo-text-muted">
                {company.contactName ? (
                  <p className="truncate font-medium text-fo-text">
                    {company.contactName}
                  </p>
                ) : null}
                {company.phone ? (
                  <p className="truncate">
                    <a href={`tel:${company.phone}`} className="hover:text-fo-primary-bright">
                      {company.phone}
                    </a>
                  </p>
                ) : null}
                {company.email ? (
                  <p className="truncate">
                    <a
                      href={`mailto:${company.email}`}
                      className="break-all hover:text-fo-primary-bright"
                    >
                      {company.email}
                    </a>
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-[10px] leading-tight text-fo-text-subtle">
                Company contact details not provided yet.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <ShiftDetailLink
              shiftId={shift.id}
              className="inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
            >
              View Details
            </ShiftDetailLink>
            <button
              type="button"
              disabled
              title="Cancellation is not supported yet. Contact the company directly."
              className="inline-flex min-h-8 cursor-not-allowed items-center justify-center rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300/50"
            >
              Cancel Assignment
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
