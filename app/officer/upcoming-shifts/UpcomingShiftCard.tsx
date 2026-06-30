"use client";

import { CancelAssignmentButton } from "@/app/officer/CancelAssignmentButton";
import { ShiftDetailLink } from "@/components/shifts/shift-detail-link";
import { StatusBadge, ProfileAvatar, buttonClassName } from "@/components/ui";
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

function formatUrgencyBadgeLabel(label: string) {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
  const contactAvailable = hasCompanyContact(company);
  const daysUntilStart = getDaysUntilStart(shift.startTime);
  const urgencyLabel = formatUrgencyBadgeLabel(formatStartsInLabel(daysUntilStart));
  const urgencyTone = getUpcomingUrgencyTone(daysUntilStart);
  const contactName = company.contactName?.trim() || company.companyName;

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

      <article className="fo-glass-card fo-glass-card-hover hidden min-h-[220px] rounded-xl border border-white/10 lg:block">
        <div className="grid h-full grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-5 p-5">
          <div className="flex min-w-0 flex-col gap-3 border-r border-white/[0.06] pr-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
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

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold leading-tight text-fo-text">{shift.title}</h2>
              <p className="text-base font-semibold text-fo-primary-bright">
                {company.companyName}
              </p>
            </div>

            <div className="space-y-2 text-sm text-fo-text-muted">
              <p className="flex items-center gap-2">
                <LocationIcon className="h-4 w-4 shrink-0 text-red-400" />
                <span className="min-w-0 truncate">{locationLabel}</span>
              </p>
              <p className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
                <span>
                  {schedule.weekday}, {schedule.monthDay}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 shrink-0 text-fo-text-subtle" />
                <span>{schedule.timeRange}</span>
              </p>
              {shiftTimeLabel ? (
                <p className="text-xs text-fo-text-subtle">{shiftTimeLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-2 border-r border-white/[0.06] px-1 pr-5">
            <p className="text-3xl font-bold leading-none text-fo-primary-bright">
              {formatHourlyRate(hourlyRate)}
              <span className="ml-1 text-base font-semibold text-fo-text-muted">/hr</span>
            </p>
            {estimatedPay ? (
              <p className="text-sm text-fo-text-muted">Est. earnings {estimatedPay}</p>
            ) : (
              <p className="text-sm text-fo-text-subtle">Estimated earnings unavailable</p>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-4">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-muted">
                Company contact
              </p>
              <div className="flex items-start gap-3">
                <ProfileAvatar
                  name={company.companyName}
                  size="sm"
                  className="!h-10 !w-10 shrink-0 !text-xs"
                />
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-semibold text-fo-text">{contactName}</p>
                  {contactAvailable && company.phone ? (
                    <p className="truncate text-xs text-fo-text-muted">
                      <a
                        href={`tel:${company.phone}`}
                        className="transition hover:text-fo-primary-bright"
                      >
                        {company.phone}
                      </a>
                    </p>
                  ) : (
                    <p className="text-xs text-fo-text-subtle">Phone not provided</p>
                  )}
                  {contactAvailable && company.email ? (
                    <p className="truncate text-xs text-fo-text-muted">
                      <a
                        href={`mailto:${company.email}`}
                        className="break-all transition hover:text-fo-primary-bright"
                      >
                        {company.email}
                      </a>
                    </p>
                  ) : (
                    <p className="text-xs text-fo-text-subtle">Email not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <ShiftDetailLink
                shiftId={shift.id}
                className={buttonClassName({
                  variant: "secondary",
                  size: "md",
                  className:
                    "w-full border-fo-primary-bright/40 text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10",
                })}
              >
                View Details
              </ShiftDetailLink>
              <CancelAssignmentButton applicationId={application.id} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
