"use client";

import Link from "next/link";
import type { ApplicationStatus } from "@/app/generated/prisma/enums";
import type { ArmedStatus } from "@/app/generated/prisma/enums";
import type { ShiftStatus } from "@/app/generated/prisma/enums";
import { ShiftDetailActions } from "@/components/shifts/shift-detail-actions";
import { ShiftDetailBackLink } from "@/components/shifts/shift-detail-back-link";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Card, ShiftStatusBadge, StatusBadge } from "@/components/ui";
import { interpolate } from "@/lib/app-i18n";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";
import {
  formatShiftEstimatedEarnings,
  formatShiftPositionsOpen,
} from "@/lib/i18n/ui-labels";

type ShiftDetailDesktopProps = {
  shift: {
    id: string;
    companyId: string;
    title: string;
    description: string | null;
    location: string;
    hourlyRate: { toString: () => string };
    startTime: Date;
    endTime: Date;
    positionsNeeded: number;
    status: ShiftStatus;
    specialRequirements: string;
    reportingInstructions: string | null;
  };
  displayCompanyName: string;
  hasPublicProfile: boolean;
  openPositions: number;
  locationLabel: string;
  estimatedPay: string | null;
  workTypeLabel: string | null;
  shiftTimeLabel: string | null;
  armedLabel: string | null;
  requirementChips: string[];
  isAcceptedOfficer: boolean;
  companyContactName: string | null;
  companyContactPhone: string | null;
  companyContactEmail: string | null;
  canApply: boolean;
  profileIncomplete: boolean;
  officer?: {
    phone?: string | null;
    armedStatuses?: ArmedStatus[];
    experienceCategories?: string[];
    experienceYears?: number | null;
    licenses?: Array<{
      id: string;
      licenseType: string;
      licenseNumber: string;
      issuingState: string;
      expirationDate: Date;
    }>;
  } | null;
  applicationStatus: ApplicationStatus | null;
  isSignedIn: boolean;
  shiftAcceptingApplications: boolean;
};

export function ShiftDetailDesktop({
  shift,
  displayCompanyName,
  hasPublicProfile,
  openPositions,
  locationLabel,
  estimatedPay,
  workTypeLabel,
  shiftTimeLabel,
  armedLabel,
  requirementChips,
  isAcceptedOfficer,
  companyContactName,
  companyContactPhone,
  companyContactEmail,
  canApply,
  profileIncomplete,
  officer,
  applicationStatus,
  isSignedIn,
  shiftAcceptingApplications,
}: ShiftDetailDesktopProps) {
  const { t } = useLandingLanguage();
  const detail = t.shiftDetail;
  const earningsLabel = formatShiftEstimatedEarnings(t, estimatedPay);

  return (
    <div className="hidden md:block">
      <ShiftDetailBackLink />

      <div className="mt-6 space-y-4">
        <Card variant="elevated" className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <ShiftStatusBadge status={shift.status} />
            <StatusBadge variant="info">
              {formatShiftPositionsOpen(t, openPositions, shift.positionsNeeded, "open")}
            </StatusBadge>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
              {detail.heading}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
              {shift.title}
            </h1>

            <p className="text-4xl font-bold text-fo-primary-bright sm:text-5xl">
              {formatHourlyRate(shift.hourlyRate)}
              <span className="ml-1 text-xl font-semibold text-fo-text-muted">
                {detail.perHour}
              </span>
            </p>

            {earningsLabel ? (
              <p className="text-sm font-medium text-fo-text-muted">{earningsLabel}</p>
            ) : estimatedPay ? (
              <p className="text-sm font-medium text-fo-text-muted">
                {detail.estimatedPay} {estimatedPay}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                {detail.fields.location}
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">{shift.location}</p>
              {locationLabel ? (
                <p className="mt-1 text-sm text-fo-text-muted">{locationLabel}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                {detail.fields.positions}
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftPositionsOpen(
                  t,
                  openPositions,
                  shift.positionsNeeded,
                  "stillOpen"
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                {detail.fields.start}
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.startTime)}
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                {detail.fields.end}
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.endTime)}
              </p>
            </div>

            {workTypeLabel ? (
              <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  {detail.fields.workType}
                </p>
                <p className="mt-2 text-base font-medium text-fo-text">{workTypeLabel}</p>
              </div>
            ) : null}

            {shiftTimeLabel ? (
              <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  {detail.fields.shiftTime}
                </p>
                <p className="mt-2 text-base font-medium text-fo-text">{shiftTimeLabel}</p>
              </div>
            ) : null}

            {armedLabel ? (
              <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  {detail.fields.armedRequirement}
                </p>
                <p className="mt-2 text-base font-medium text-fo-text">{armedLabel}</p>
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-fo-text">{detail.sections.description}</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text-muted">
            {shift.description?.trim() || detail.sections.noDescription}
          </p>
        </Card>

        {requirementChips.length > 0 ? (
          <Card variant="muted" className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">
              {detail.sections.requirements}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {requirementChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-fo-text"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {shift.specialRequirements?.trim() && requirementChips.length === 0 ? (
          <Card variant="muted" className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">
              {detail.sections.specialRequirements}
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text">
              {shift.specialRequirements}
            </p>
          </Card>
        ) : null}

        {isAcceptedOfficer && shift.reportingInstructions?.trim() ? (
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">
              {detail.sections.reportingInstructions}
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text-muted">
              {shift.reportingInstructions}
            </p>
          </Card>
        ) : null}

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-fo-text">{detail.sections.company}</h2>
          {hasPublicProfile ? (
            <Link
              href={`/companies/${shift.companyId}`}
              className="text-base font-medium text-fo-primary-bright hover:text-fo-primary-hover"
            >
              {displayCompanyName}
            </Link>
          ) : (
            <p className="text-base font-medium text-fo-text">{displayCompanyName}</p>
          )}
          {isAcceptedOfficer ? (
            <dl className="space-y-2 text-sm text-fo-text-muted">
              {companyContactName ? (
                <div>
                  <dt className="font-semibold text-fo-text">{detail.sections.contact}</dt>
                  <dd>{companyContactName}</dd>
                </div>
              ) : null}
              {companyContactPhone ? (
                <div>
                  <dt className="font-semibold text-fo-text">{detail.company.phone}</dt>
                  <dd>{companyContactPhone}</dd>
                </div>
              ) : null}
              {companyContactEmail ? (
                <div>
                  <dt className="font-semibold text-fo-text">{detail.company.email}</dt>
                  <dd>
                    <a
                      href={`mailto:${companyContactEmail}`}
                      className="text-fo-primary-bright hover:text-fo-primary-hover"
                    >
                      {companyContactEmail}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-sm leading-relaxed text-fo-text-muted">
              {detail.company.contactLocked}
            </p>
          )}
        </Card>

        <ShiftDetailActions
          shiftId={shift.id}
          companyId={shift.companyId}
          hasPublicProfile={hasPublicProfile}
          canApply={canApply}
          profileIncomplete={profileIncomplete}
          officer={officer}
          applicationStatus={applicationStatus}
          isSignedIn={isSignedIn}
          shiftAcceptingApplications={shiftAcceptingApplications}
        />
      </div>
    </div>
  );
}
