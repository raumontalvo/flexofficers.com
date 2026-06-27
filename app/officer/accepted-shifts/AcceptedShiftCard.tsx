"use client";

import { StatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftScheduleParts,
} from "@/lib/format-shift";
import { fromShiftTimeType } from "@/lib/shift-form-options";
import {
  formatCompletedDate,
  hasCompanyContact,
  type AcceptedShiftTab,
  type OfficerAcceptedShiftData,
} from "@/lib/officer-accepted-shift-data";
import { getShiftRequirementChips } from "@/lib/shift-requirements";
import { AcceptedShiftActions } from "./AcceptedShiftActions";

type AcceptedShiftCardProps = {
  application: OfficerAcceptedShiftData;
  tab: AcceptedShiftTab;
  onListChange: () => void;
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

function statusBadgeForTab(tab: AcceptedShiftTab) {
  switch (tab) {
    case "completed":
      return (
        <StatusBadge variant="success" className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5">
          COMPLETED
        </StatusBadge>
      );
    case "cancelled":
      return (
        <StatusBadge variant="neutral" className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5">
          CANCELLED
        </StatusBadge>
      );
    default:
      return (
        <StatusBadge variant="success" className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5">
          CONFIRMED
        </StatusBadge>
      );
  }
}

export function AcceptedShiftCard({
  application,
  tab,
  onListChange,
}: AcceptedShiftCardProps) {
  const { shift, company } = application;
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const hourlyRate = { toString: () => shift.hourlyRate };
  const schedule = formatShiftScheduleParts(startTime, endTime);
  const estimatedPay = formatEstimatedShiftPay(hourlyRate, startTime, endTime);
  const locationLabel = formatShiftCityState(shift);
  const shiftTimeLabel = fromShiftTimeType(shift.shiftTimeType);
  const allRequirementChips = getShiftRequirementChips(shift, 20);
  const requirementChips = allRequirementChips.slice(0, 2);
  const hiddenRequirementCount = Math.max(
    allRequirementChips.length - requirementChips.length,
    0
  );
  const completedDateLabel = formatCompletedDate(shift.endTime);
  const contactAvailable = hasCompanyContact(company);

  return (
    <article
      className={cn(
        "fo-glass-card fo-glass-card-hover rounded-lg border border-white/10 transition",
        "md:h-[116px] md:overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 p-3",
          "md:grid md:h-full md:grid-cols-[80px_minmax(0,0.95fr)_minmax(100px,0.72fr)_minmax(72px,0.48fr)_minmax(0,0.55fr)_minmax(112px,0.62fr)_auto] md:items-center md:gap-2 md:px-3 md:py-0"
        )}
      >
        <div className="flex shrink-0 items-center md:justify-center">
          {statusBadgeForTab(tab)}
        </div>

        <div className="min-w-0 overflow-hidden">
          <h2 className="truncate text-sm font-bold leading-tight text-fo-text">
            {shift.title}
          </h2>
          <p className="truncate text-xs font-medium leading-tight text-fo-primary-bright">
            {company.companyName}
          </p>
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
                  className="inline-flex max-w-[68px] shrink-0 truncate rounded border border-slate-600/50 bg-slate-800/50 px-1.5 py-0 text-[10px] font-medium leading-5 text-slate-300"
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

        <div className="hidden min-w-0 overflow-hidden md:block">
          {contactAvailable ? (
            <div className="space-y-0.5 text-[10px] leading-tight text-fo-text-muted">
              {company.contactName ? (
                <p className="truncate font-medium text-fo-text">{company.contactName}</p>
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
                  <a href={`mailto:${company.email}`} className="hover:text-fo-primary-bright">
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

        <div className="flex items-end justify-between gap-2 md:block">
          <div className="min-w-0 flex-1 text-[11px] text-fo-text-muted md:hidden">
            <p>
              {schedule.weekday} {schedule.monthDay} · {schedule.timeRange}
            </p>
            {contactAvailable ? (
              <p className="mt-0.5 truncate">{company.contactName ?? company.phone ?? company.email}</p>
            ) : (
              <p className="mt-0.5">Contact details not provided yet.</p>
            )}
          </div>
          <AcceptedShiftActions
            applicationId={application.id}
            shiftId={shift.id}
            tab={tab}
            completedDateLabel={completedDateLabel}
            onListChange={onListChange}
          />
        </div>
      </div>
    </article>
  );
}
