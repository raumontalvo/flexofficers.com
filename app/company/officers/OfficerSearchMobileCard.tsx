"use client";

import type { ReactNode } from "react";
import { ProfileAvatar } from "@/components/ui";
import { MobilePrimaryButton, MobileSecondaryButton } from "@/components/ui/mobile";
import { officerProfileNameLabel } from "@/components/company/officer-profile-name";
import { cn } from "@/lib/cn";
import type { SerializedOfficerSearchResult } from "@/lib/company-officers-page";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";
import type { OfficerInviteButtonState } from "@/lib/company-invite-workflow";
import { normalizeExperienceCategories } from "@/lib/profile-options";

type OfficerSearchMobileCardProps = {
  officer: SerializedOfficerSearchResult;
  onViewProfile: () => void;
  onInvite: () => void;
  inviteState: OfficerInviteButtonState;
  inviteLabel?: string;
  staffAction?: ReactNode;
};

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

function formatLicenseBadgeLabel(licenseType: string) {
  const classMatch = licenseType.match(/Class\s+([A-Za-z0-9]+)/i);
  if (classMatch) {
    return `${classMatch[1].toUpperCase()} License`;
  }

  const letterMatch = licenseType.match(/\b([A-Za-z])\s+License\b/i);
  if (letterMatch) {
    return `${letterMatch[1].toUpperCase()} License`;
  }

  return licenseType;
}

function QualificationBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100">
      {children}
    </span>
  );
}

function OptionalChipSection({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <QualificationBadge key={value}>{value}</QualificationBadge>
        ))}
      </div>
    </div>
  );
}

export function OfficerSearchMobileCard({
  officer,
  onViewProfile,
  onInvite,
  inviteState,
  inviteLabel = "Invite to Apply",
  staffAction,
}: OfficerSearchMobileCardProps) {
  const displayName = officerProfileNameLabel(officer.firstName, officer.lastName);
  const qualificationBadges: string[] = [];

  if (officer.armedStatuses.length > 0) {
    qualificationBadges.push(officer.armedStatusLabel);
  }

  if (officer.experienceYears !== null && officer.experienceYears !== undefined) {
    qualificationBadges.push(
      officer.experienceYears === 1 ? "1 Year" : `${officer.experienceYears} Years`
    );
  }

  for (const licenseType of officer.licenseTypeLabels) {
    qualificationBadges.push(formatLicenseBadgeLabel(licenseType));
  }

  const experienceCategories = normalizeExperienceCategories(
    officer.experienceCategories
  );

  return (
    <article className="fo-glass-card overflow-hidden rounded-2xl border border-white/10 lg:hidden">
      <div className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          {officer.profilePhotoUrl?.trim() ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-fo-bg-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={officer.profilePhotoUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <ProfileAvatar name={displayName} size="md" className="shrink-0" />
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold leading-snug text-fo-text">
              {displayName}
            </h2>
            {officer.cityStateLabel !== "Location not provided" ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-fo-text-muted">
                <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400" />
                <span className="truncate">{officer.cityStateLabel}</span>
              </p>
            ) : null}
          </div>
        </div>

        {qualificationBadges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {qualificationBadges.map((badge) => (
              <QualificationBadge key={badge}>{badge}</QualificationBadge>
            ))}
          </div>
        ) : null}

        <div className="border-t border-white/[0.06] pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
            Licenses
          </p>

          {officer.licenses.length > 0 ? (
            <div
              className={cn(
                "mt-2 gap-2",
                officer.licenses.length > 1 ? "grid grid-cols-2" : "space-y-2"
              )}
            >
              {officer.licenses.map((license) => (
                <div
                  key={license.id}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"
                >
                  <p className="text-sm font-semibold text-fo-text">
                    {formatLicenseBadgeLabel(license.licenseType)}
                  </p>
                  <p className="mt-1 text-sm text-fo-text-muted">
                    {license.licenseNumber}
                  </p>
                  <p className="mt-1 text-xs text-fo-text-subtle">
                    Expires {license.expirationDateLabel}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-fo-text-muted">Not provided</p>
          )}

          <p className="mt-2 text-[10px] leading-relaxed text-fo-text-subtle">
            {LICENSE_DISPLAY_DISCLAIMER}
          </p>
        </div>

        <OptionalChipSection
          label="Certifications"
          values={officer.certifications}
        />
        <OptionalChipSection
          label="Availability"
          values={officer.availabilityLabels}
        />
        <OptionalChipSection
          label="Experience"
          values={experienceCategories}
        />
        {officer.backgroundCategories.length > 0 ? (
          <OptionalChipSection
            label="Background"
            values={officer.backgroundCategories}
          />
        ) : null}

        {officer.introduction ? (
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-fo-text-subtle">
              Introduction
            </p>
            <p className="line-clamp-3 text-sm leading-relaxed text-fo-text-muted">
              {officer.introduction}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
          <MobileSecondaryButton
            onClick={onViewProfile}
            className="!min-h-11 !text-sm"
          >
            View Profile
          </MobileSecondaryButton>
          {inviteState.kind === "invite" ? (
            <MobilePrimaryButton
              onClick={onInvite}
              className="!min-h-11 !text-sm"
            >
              {inviteLabel}
            </MobilePrimaryButton>
          ) : (
            <div className="flex min-h-11 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 px-2 text-center">
              <div>
                <p className="text-xs font-semibold text-amber-100">
                  {inviteState.label}
                </p>
                {inviteState.kind === "pending" ? (
                  <p className="mt-0.5 text-[10px] text-amber-200/80">
                    Pending
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {staffAction ? <div className="pt-2">{staffAction}</div> : null}
      </div>
    </article>
  );
}
