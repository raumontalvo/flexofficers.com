"use client";

import type { ReactNode } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { ProfileAvatar } from "@/components/ui";
import { officerProfileNameLabel } from "@/components/company/officer-profile-name";
import { cn } from "@/lib/cn";
import {
  getOfficerLicenseChipDisplay,
  getOfficerLicenseChipTone,
  type SerializedOfficerSearchResult,
} from "@/lib/company-officers-page";
import { normalizeExperienceCategories } from "@/lib/profile-options";
import {
  formatOfficerExperienceDesktop,
  translateProfileOptionLabel,
} from "@/lib/i18n/ui-labels";

type OfficerRosterCardProps = {
  officer: SerializedOfficerSearchResult;
  actions: ReactNode;
};

const MAX_SKILL_CHIPS = 4;

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
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
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

function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-fo-text-muted">
      {label}
    </span>
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
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <ProfileAvatar
      name={name}
      size="md"
      className="!h-14 !w-14 shrink-0 !text-lg"
    />
  );
}

function getSkillChipDisplay(officer: SerializedOfficerSearchResult) {
  const chips = [
    ...new Set([
      ...officer.certifications,
      ...normalizeExperienceCategories(officer.experienceCategories),
    ]),
  ];

  if (chips.length <= MAX_SKILL_CHIPS) {
    return { chips, overflowCount: 0 };
  }

  return {
    chips: chips.slice(0, MAX_SKILL_CHIPS),
    overflowCount: chips.length - MAX_SKILL_CHIPS,
  };
}

export function OfficerRosterCard({ officer, actions }: OfficerRosterCardProps) {
  const { t } = useLandingLanguage();
  const copy = t.company.officerCards;
  const displayName = officerProfileNameLabel(officer.firstName, officer.lastName);
  const licenseDisplay = getOfficerLicenseChipDisplay(officer.licenseTypeLabels);
  const skillDisplay = getSkillChipDisplay(officer);
  const locationNotProvided = copy.locationNotProvided;
  const locationKnown =
    officer.cityStateLabel.trim().length > 0 &&
    officer.cityStateLabel !== locationNotProvided &&
    officer.cityStateLabel !== "Location not provided";
  const locationLabel = locationKnown
    ? officer.cityStateLabel
    : locationNotProvided;

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]">
      <div className="flex items-start gap-3">
        <OfficerAvatar name={displayName} photoUrl={officer.profilePhotoUrl} />

        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="truncate text-base font-semibold text-fo-text">
            {displayName}
          </h2>
          <p className="text-xs font-medium text-fo-text-muted">{copy.securityOfficer}</p>
          <p className="text-sm text-fo-text-muted">
            <span className="truncate">{locationLabel}</span>
            <span className="mx-1.5 text-fo-text-subtle">·</span>
            <span>{officer.armedStatusLabel}</span>
            <span className="mx-1.5 text-fo-text-subtle">·</span>
            <span>{formatOfficerExperienceDesktop(t, officer.experienceYears)}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {licenseDisplay.chips.length === 0 ? (
          <span className="text-xs text-fo-text-subtle">{copy.noLicensesProvided}</span>
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

      {skillDisplay.chips.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skillDisplay.chips.map((label) => (
            <SkillChip
              key={label}
              label={translateProfileOptionLabel(t, label)}
            />
          ))}
          {skillDisplay.overflowCount > 0 ? (
            <SkillChip label={`+${skillDisplay.overflowCount}`} />
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 border-t border-white/[0.06] pt-3">{actions}</div>
    </article>
  );
}
