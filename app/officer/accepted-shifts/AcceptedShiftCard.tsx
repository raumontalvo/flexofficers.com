"use client";

import { StatusBadge, ProfileAvatar } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
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
import type { AppTranslations } from "@/lib/app-i18n";
import {
  getAcceptedShiftTabBadge,
  translateShiftFormLabel,
} from "@/lib/i18n/ui-labels";
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

function statusBadgeForTab(t: AppTranslations, tab: AcceptedShiftTab) {
  const label = getAcceptedShiftTabBadge(t, tab);
  const variant = tab === "cancelled" ? "neutral" : "success";

  return (
    <StatusBadge variant={variant} className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5">
      {label}
    </StatusBadge>
  );
}

function desktopStatusBadgeForTab(t: AppTranslations, tab: AcceptedShiftTab) {
  const label = getAcceptedShiftTabBadge(t, tab);
  const variant = tab === "cancelled" ? "neutral" : "success";

  return (
    <StatusBadge variant={variant} className="!min-h-5 !w-fit !px-2 !py-0.5 !text-[10px]">
      {label}
    </StatusBadge>
  );
}

export function AcceptedShiftCard({
  application,
  tab,
  onListChange,
}: AcceptedShiftCardProps) {
  const { t } = useLandingLanguage();
  const card = t.acceptedShifts.card;
  const { shift, company } = application;
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const hourlyRate = { toString: () => shift.hourlyRate };
  const schedule = formatShiftScheduleParts(startTime, endTime);
  const estimatedPay = formatEstimatedShiftPay(hourlyRate, startTime, endTime);
  const locationLabel = formatShiftCityState(shift);
  const shiftTimeLabel = translateShiftFormLabel(t, fromShiftTimeType(shift.shiftTimeType));
  const completedDateLabel = formatCompletedDate(shift.endTime);
  const contactAvailable = hasCompanyContact(company);
  const contactName = company.contactName?.trim() || company.companyName;
  const dateTimeLabel = `${schedule.weekday} ${schedule.monthDay} · ${schedule.timeRange}`;

  return (
    <>
      <article className="fo-glass-card fo-glass-card-hover overflow-hidden rounded-xl border border-white/10 transition lg:hidden">
        <div className="space-y-2 p-3">
          <div className="flex items-start justify-between gap-3">
            {statusBadgeForTab(t, tab)}
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold leading-none text-fo-primary-bright">
                {formatHourlyRate(hourlyRate)}
                <span className="text-[11px] font-semibold text-fo-text-muted">{t.shiftDetail.perHour}</span>
              </p>
              {estimatedPay ? (
                <p className="mt-0.5 text-[10px] leading-tight text-fo-text-muted">
                  {interpolate(card.estAbbrev, { pay: estimatedPay })}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm font-bold leading-snug text-fo-text">{shift.title}</h2>
            <p className="truncate text-xs font-semibold text-fo-primary-bright">
              {company.companyName}
            </p>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-fo-text-muted">
            <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="min-w-0 truncate">{locationLabel}</span>
          </p>

          <p className="truncate text-[11px] leading-tight text-fo-text-muted">
            {dateTimeLabel}
            {shiftTimeLabel ? (
              <span className="text-fo-text-subtle"> · {shiftTimeLabel}</span>
            ) : null}
          </p>

          <AcceptedShiftActions
            applicationId={application.id}
            shiftId={shift.id}
            tab={tab}
            completedDateLabel={completedDateLabel}
            onListChange={onListChange}
            layout="mobile-row"
          />
        </div>
      </article>

      <article className="fo-glass-card fo-glass-card-hover hidden min-h-[150px] rounded-xl border border-white/10 lg:block">
        <div className="grid h-full min-h-[150px] grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-5 p-5">
          <div className="flex min-w-0 flex-col justify-center gap-3 border-r border-white/[0.06] pr-5">
            <div>{desktopStatusBadgeForTab(t, tab)}</div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold leading-tight text-fo-text">{shift.title}</h2>
              <p className="text-base font-semibold text-fo-primary-bright">
                {company.companyName}
              </p>
            </div>

            <p className="flex items-center gap-2 text-sm text-fo-text-muted">
              <LocationIcon className="h-4 w-4 shrink-0 text-red-400" />
              <span className="min-w-0 truncate">{locationLabel}</span>
            </p>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-2.5 border-r border-white/[0.06] px-1 pr-5">
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
            {shiftTimeLabel ? (
              <p className="text-sm text-fo-text-subtle">{shiftTimeLabel}</p>
            ) : null}
            <div className="mt-1 border-t border-white/[0.06] pt-2.5">
              <p className="text-2xl font-bold leading-none text-fo-primary-bright">
                {formatHourlyRate(hourlyRate)}
                <span className="ml-1 text-sm font-semibold text-fo-text-muted">{t.shiftDetail.perHour}</span>
              </p>
              {estimatedPay ? (
                <p className="mt-1 text-sm text-fo-text-muted">
                  {interpolate(card.estEarnings, { pay: estimatedPay })}
                </p>
              ) : (
                <p className="mt-1 text-sm text-fo-text-subtle">{card.estEarningsUnavailable}</p>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-4">
            <div className="space-y-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-muted">
                {card.companyContact}
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
                    <p className="text-xs text-fo-text-subtle">{card.phoneNotProvided}</p>
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
                    <p className="text-xs text-fo-text-subtle">{card.emailNotProvided}</p>
                  )}
                </div>
              </div>
            </div>

            <AcceptedShiftActions
              applicationId={application.id}
              shiftId={shift.id}
              tab={tab}
              completedDateLabel={completedDateLabel}
              onListChange={onListChange}
              layout="desktop"
            />
          </div>
        </div>
      </article>
    </>
  );
}
