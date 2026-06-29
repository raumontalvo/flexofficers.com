import Link from "next/link";
import type { ReactNode } from "react";
import type { ApplicationStatus } from "@/app/generated/prisma/enums";
import { ShiftDetailActions } from "@/components/shifts/shift-detail-actions";
import { ShiftDetailBackLink } from "@/components/shifts/shift-detail-back-link";
import { ShiftStatusBadge, StatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatHourlyRate,
  formatShiftScheduleParts,
} from "@/lib/format-shift";
import {
  parseCertificationRequirementsFromShift,
  parseFreeformOtherRequirements,
  parseLicenseRequirementsFromShift,
} from "@/lib/shift-create-form";
import type { ShiftStatus } from "@/app/generated/prisma/enums";

type ShiftDetailMobileProps = {
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
    requirements: string[];
    otherRequirements: string | null;
    specialRequirements: string;
    reportingInstructions: string | null;
  };
  company: {
    companyName: string;
    description: string | null;
  };
  displayCompanyName: string;
  hasPublicProfile: boolean;
  openPositions: number;
  locationLabel: string;
  estimatedPay: string | null;
  workTypeLabel: string | null;
  shiftTimeLabel: string | null;
  armedLabel: string | null;
  canApply: boolean;
  applicationStatus: ApplicationStatus | null;
  isSignedIn: boolean;
  shiftAcceptingApplications: boolean;
  isAcceptedOfficer: boolean;
};

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="w-5 shrink-0 text-center text-base leading-5" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
          {label}
        </p>
        <div className="mt-0.5 text-sm leading-snug text-fo-text">{children}</div>
      </div>
    </div>
  );
}

function RequirementChipGroup({
  title,
  chips,
}: {
  title: string;
  chips: readonly string[];
}) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
        {title}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-fo-text"
          >
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function shiftTimeIcon(label: string | null) {
  if (!label) {
    return "🕒";
  }

  if (/overnight/i.test(label)) {
    return "🌙";
  }

  if (/night/i.test(label)) {
    return "🌃";
  }

  return "☀️";
}

export function ShiftDetailMobile({
  shift,
  company,
  displayCompanyName,
  hasPublicProfile,
  openPositions,
  locationLabel,
  estimatedPay,
  workTypeLabel,
  shiftTimeLabel,
  armedLabel,
  canApply,
  applicationStatus,
  isSignedIn,
  shiftAcceptingApplications,
  isAcceptedOfficer,
}: ShiftDetailMobileProps) {
  const schedule = formatShiftScheduleParts(shift.startTime, shift.endTime);
  const licenseRequirements = parseLicenseRequirementsFromShift({
    requirements: shift.requirements,
    otherRequirements: shift.otherRequirements,
    armedRequirement: armedLabel,
  });
  const certificationRequirements = parseCertificationRequirementsFromShift({
    requirements: shift.requirements,
    otherRequirements: shift.otherRequirements,
  });
  const freeformOther = parseFreeformOtherRequirements(shift.otherRequirements);
  const otherChips = freeformOther
    ? freeformOther.split(/[,;]+/).map((entry) => entry.trim()).filter(Boolean)
    : [];
  const fallbackRequirementChips =
    licenseRequirements.length === 0 &&
    certificationRequirements.length === 0 &&
    otherChips.length === 0 &&
    shift.specialRequirements?.trim()
      ? shift.specialRequirements
          .split(/[,;\n]+/)
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [];
  const showRequirementsCard =
    licenseRequirements.length > 0 ||
    certificationRequirements.length > 0 ||
    otherChips.length > 0 ||
    fallbackRequirementChips.length > 0;
  const showShiftInformation =
    workTypeLabel || shiftTimeLabel || armedLabel || shift.positionsNeeded > 0;

  return (
    <div className="space-y-3 pb-2 md:hidden">
      <ShiftDetailBackLink />

      <article className="fo-glass-card space-y-3 rounded-2xl border border-white/10 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <ShiftStatusBadge status={shift.status} />
          <StatusBadge variant="info" className="uppercase tracking-wide">
            {openPositions} of {shift.positionsNeeded} open
          </StatusBadge>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-fo-text">
            {shift.title}
          </h1>

          {hasPublicProfile ? (
            <Link
              href={`/companies/${shift.companyId}`}
              className="text-base font-semibold text-fo-primary-bright"
            >
              {displayCompanyName}
            </Link>
          ) : (
            <p className="text-base font-semibold text-fo-primary-bright">
              {displayCompanyName}
            </p>
          )}

          <p className="text-3xl font-bold leading-none text-fo-primary-bright">
            {formatHourlyRate(shift.hourlyRate)}
            <span className="text-lg font-semibold text-fo-text-muted">/hr</span>
          </p>

          {estimatedPay ? (
            <p className="text-sm text-fo-text-muted">Estimated earnings {estimatedPay}</p>
          ) : null}

          <div className="space-y-1.5 border-t border-white/[0.06] pt-2.5 text-sm text-fo-text-muted">
            <p className="flex items-start gap-1.5">
              <span className="text-red-400" aria-hidden>
                📍
              </span>
              <span>
                {locationLabel}
                <span className="mt-0.5 block text-xs text-fo-text-subtle">
                  {shift.location}
                </span>
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <span aria-hidden>📅</span>
              <span>
                {schedule.weekday}, {schedule.monthDay}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <span aria-hidden>🕒</span>
              <span>{schedule.timeRange}</span>
            </p>
          </div>
        </div>
      </article>

      {showShiftInformation ? (
        <article className="fo-glass-card space-y-3 rounded-2xl border border-white/10 p-4">
          <h2 className="text-sm font-semibold text-fo-text">Shift Information</h2>

          {workTypeLabel ? (
            <InfoRow icon="💼" label="Work Type">
              <p>{workTypeLabel}</p>
            </InfoRow>
          ) : null}

          {shiftTimeLabel ? (
            <InfoRow icon={shiftTimeIcon(shiftTimeLabel)} label="Shift Time">
              <p>{shiftTimeLabel}</p>
            </InfoRow>
          ) : null}

          {armedLabel ? (
            <InfoRow icon="🛡" label="Armed Requirement">
              <p>{armedLabel}</p>
            </InfoRow>
          ) : null}

          <InfoRow icon="👥" label="Open Positions">
            <p>
              {openPositions} of {shift.positionsNeeded} available
            </p>
          </InfoRow>
        </article>
      ) : null}

      <article className="fo-glass-card rounded-2xl border border-white/10 p-4">
        <h2 className="text-sm font-semibold text-fo-text">About this Shift</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fo-text-muted">
          {shift.description?.trim() || "No description provided."}
        </p>
      </article>

      {showRequirementsCard ? (
        <article className="fo-glass-card space-y-3 rounded-2xl border border-white/10 p-4">
          <h2 className="text-sm font-semibold text-fo-text">Requirements</h2>
          <RequirementChipGroup
            title="License Requirements"
            chips={licenseRequirements}
          />
          <RequirementChipGroup
            title="Certification Requirements"
            chips={certificationRequirements}
          />
          <RequirementChipGroup title="Other Requirements" chips={otherChips} />
          <RequirementChipGroup
            title="Additional Requirements"
            chips={fallbackRequirementChips}
          />
        </article>
      ) : null}

      {isAcceptedOfficer && shift.reportingInstructions?.trim() ? (
        <article className="fo-glass-card rounded-2xl border border-white/10 p-4">
          <h2 className="text-sm font-semibold text-fo-text">Reporting Instructions</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fo-text-muted">
            {shift.reportingInstructions}
          </p>
        </article>
      ) : null}

      <article className="fo-glass-card space-y-2.5 rounded-2xl border border-white/10 p-4">
        <h2 className="text-sm font-semibold text-fo-text">Company</h2>
        <p className="text-base font-semibold text-fo-text">{displayCompanyName}</p>
        {company.description ? (
          <p className="text-sm leading-relaxed text-fo-text-muted">
            {company.description}
          </p>
        ) : null}
        <p className="text-xs leading-relaxed text-fo-text-muted">
          Company contact information is shared after your application is accepted.
        </p>
        {hasPublicProfile ? (
          <Link
            href={`/companies/${shift.companyId}`}
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15",
              "text-sm font-semibold text-fo-text transition hover:bg-white/[0.04]"
            )}
          >
            View Company Profile
          </Link>
        ) : null}
      </article>

      <ShiftDetailActions
        shiftId={shift.id}
        companyId={shift.companyId}
        hasPublicProfile={hasPublicProfile}
        canApply={canApply}
        applicationStatus={applicationStatus}
        isSignedIn={isSignedIn}
        shiftAcceptingApplications={shiftAcceptingApplications}
        layout="mobile"
      />
    </div>
  );
}
