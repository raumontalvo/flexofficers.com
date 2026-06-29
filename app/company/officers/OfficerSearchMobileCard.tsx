"use client";

import type { ReactNode } from "react";
import { ProfileAvatar } from "@/components/ui";
import { MobilePrimaryButton, MobileSecondaryButton } from "@/components/ui/mobile";
import { officerProfileNameLabel } from "@/components/company/officer-profile-name";
import { cn } from "@/lib/cn";
import {
  getOfficerLicenseChipDisplay,
  getOfficerLicenseChipTone,
  type SerializedOfficerSearchResult,
} from "@/lib/company-officers-page";
import type { OfficerInviteButtonState } from "@/lib/company-invite-workflow";

type OfficerSearchMobileCardProps = {
  officer: SerializedOfficerSearchResult;
  onViewProfile: () => void;
  onInvite: () => void;
  inviteState: OfficerInviteButtonState;
  inviteLabel?: string;
};

const buttonClassName = "!min-h-11 !rounded-xl !text-sm";

function LicenseChip({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "green" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        tone === "blue" && "border-blue-500/25 bg-blue-500/10 text-blue-100",
        tone === "green" && "border-green-500/25 bg-green-500/10 text-green-100",
        tone === "neutral" &&
          "border-white/10 bg-white/[0.04] text-fo-text-muted"
      )}
    >
      {label}
    </span>
  );
}

function MutedPill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-fo-text-subtle">
      {children}
    </span>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <p className="flex min-w-0 items-center gap-2 text-xs leading-snug text-fo-text-muted">
      <span className="w-4 shrink-0 text-center text-sm leading-none" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </p>
  );
}

function OfficerAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  if (photoUrl?.trim()) {
    return (
      <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <ProfileAvatar
      name={name}
      size="md"
      className="!h-[4.5rem] !w-[4.5rem] shrink-0 !text-xl"
    />
  );
}

function formatExperienceLabel(experienceYears: number | null) {
  if (experienceYears === null || experienceYears === undefined) {
    return null;
  }

  return `${experienceYears} ${experienceYears === 1 ? "Year" : "Years"} Experience`;
}

function hasKnownLocation(cityStateLabel: string) {
  return (
    cityStateLabel.trim().length > 0 &&
    cityStateLabel !== "Location not provided"
  );
}

export function OfficerSearchMobileCard({
  officer,
  onViewProfile,
  onInvite,
  inviteState,
  inviteLabel = "Invite to Apply",
}: OfficerSearchMobileCardProps) {
  const displayName = officerProfileNameLabel(officer.firstName, officer.lastName);
  const licenseDisplay = getOfficerLicenseChipDisplay(officer.licenseTypeLabels);
  const experienceLabel = formatExperienceLabel(officer.experienceYears);
  const locationKnown = hasKnownLocation(officer.cityStateLabel);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] lg:hidden">
      <div className="flex items-start gap-3">
        <OfficerAvatar name={displayName} photoUrl={officer.profilePhotoUrl} />

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h2 className="truncate text-base font-bold leading-snug text-fo-text">
              {displayName}
            </h2>
            <p className="mt-1 text-xs font-medium text-fo-text-muted">
              Security Officer
            </p>
          </div>

          <div className="space-y-2">
            <InfoRow icon="📍">
              {locationKnown ? (
                <span className="truncate">{officer.cityStateLabel}</span>
              ) : (
                <MutedPill>Location Unknown</MutedPill>
              )}
            </InfoRow>

            <InfoRow icon="🛡">
              <span className="truncate">{officer.armedStatusLabel}</span>
            </InfoRow>

            <InfoRow icon="🕒">
              {experienceLabel ? (
                <span>{experienceLabel}</span>
              ) : (
                <MutedPill>Experience Unknown</MutedPill>
              )}
            </InfoRow>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {licenseDisplay.chips.length === 0 ? (
          <MutedPill>No Licenses</MutedPill>
        ) : (
          <>
            {licenseDisplay.chips.map((licenseType) => (
              <LicenseChip
                key={licenseType}
                label={licenseType}
                tone={getOfficerLicenseChipTone(licenseType)}
              />
            ))}
            {licenseDisplay.overflowCount > 0 ? (
              <LicenseChip
                label={`+${licenseDisplay.overflowCount}`}
                tone="neutral"
              />
            ) : null}
          </>
        )}
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <MobileSecondaryButton
          onClick={onViewProfile}
          className={buttonClassName}
        >
          View Profile
        </MobileSecondaryButton>
        {inviteState.kind === "invite" ? (
          <MobilePrimaryButton onClick={onInvite} className={buttonClassName}>
            {inviteLabel}
          </MobilePrimaryButton>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 px-2 text-center",
              buttonClassName
            )}
          >
            <div>
              <p className="text-xs font-semibold text-amber-100">
                {inviteState.label}
              </p>
              {inviteState.kind === "pending" ? (
                <p className="mt-0.5 text-[10px] text-amber-200/80">Pending</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
