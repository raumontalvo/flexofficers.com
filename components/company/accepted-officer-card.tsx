"use client";

import Link from "next/link";
import { useState } from "react";
import { ProfileAvatar, StatusBadge, buttonClassName } from "@/components/ui";
import { CompanyOfficerLicenses } from "@/components/company/company-officer-licenses";
import { RemoveFromCompanyListButton } from "@/components/company/remove-from-company-list-button";
import { RemoveAcceptedOfficerButton } from "@/components/company/remove-accepted-officer-button";
import type { CompanyWorkforceOfficer } from "@/lib/company-workforce-data";
import {
  formatArmedStatuses,
  normalizeExperienceCategories,
} from "@/lib/profile-options";
import { cn } from "@/lib/cn";

type AcceptedOfficerCardProps = {
  officerRecord: CompanyWorkforceOfficer;
  showRemove?: boolean;
  showHideFromList?: boolean;
  onHidden?: () => void;
  onRemoved?: () => void;
  cancelled?: boolean;
  shiftId?: string;
  shiftTitle?: string;
  layout?: "default" | "desktop-row" | "mobile-compact";
};

function OfficerPhoto({
  name,
  photoUrl,
  compact = false,
  mobile = false,
}: {
  name: string;
  photoUrl?: string | null;
  compact?: boolean;
  mobile?: boolean;
}) {
  if (photoUrl?.trim()) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-white/10 bg-fo-bg-elevated",
          mobile ? "h-10 w-10" : compact ? "h-12 w-12" : "h-14 w-14"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <ProfileAvatar
      name={name}
      size="md"
      className={cn(
        mobile ? "!h-10 !w-10 !text-sm" : compact ? "!h-12 !w-12 !text-base" : "!h-14 !w-14"
      )}
    />
  );
}

function getOfficerSkillChips(
  officer: CompanyWorkforceOfficer["officer"],
  maxChips = 4
) {
  const armedLabel = formatArmedStatuses(officer.armedStatuses);
  const chips = [
    ...new Set([
      ...(armedLabel && armedLabel !== "Not provided" ? [armedLabel] : []),
      ...officer.certifications,
      ...normalizeExperienceCategories(officer.experienceCategories),
    ]),
  ];

  if (chips.length <= maxChips) {
    return { chips, overflowCount: 0 };
  }

  return {
    chips: chips.slice(0, maxChips),
    overflowCount: chips.length - maxChips,
  };
}

function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-fo-text-muted">
      {label}
    </span>
  );
}

function OfficerProfileDetails({
  officer,
  hasContact,
}: {
  officer: CompanyWorkforceOfficer["officer"];
  hasContact: boolean;
}) {
  return (
    <div className="space-y-3">
      {officer.certifications.length > 0 ? (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle">
            Certifications
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {officer.certifications.map((certification) => (
              <SkillChip key={certification} label={certification} />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle">
          Licenses
        </p>
        <div className="mt-1.5">
          <CompanyOfficerLicenses licenses={officer.licenses} />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle">
          Contact
        </p>
        {hasContact ? (
          <div className="mt-1.5 space-y-1 text-xs text-fo-text">
            {officer.phone ? (
              <p>
                <a href={`tel:${officer.phone}`} className="hover:text-fo-primary-bright">
                  {officer.phone}
                </a>
              </p>
            ) : null}
            {officer.email ? (
              <p>
                <a
                  href={`mailto:${officer.email}`}
                  className="break-all hover:text-fo-primary-bright"
                >
                  {officer.email}
                </a>
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-1.5 text-xs text-fo-text-muted">
            Officer has not provided contact information.
          </p>
        )}
      </div>

      {officer.introduction ? (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle">
            Introduction
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-fo-text-muted">
            {officer.introduction}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function AcceptedOfficerCard({
  officerRecord,
  showRemove = true,
  showHideFromList = false,
  onHidden,
  onRemoved,
  cancelled = false,
  shiftId,
  shiftTitle,
  layout = "default",
}: AcceptedOfficerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { officer } = officerRecord;
  const officerName = `${officer.firstName} ${officer.lastName}`.trim();
  const locationLabel = [officer.city, officer.state].filter(Boolean).join(", ");
  const experienceLabel =
    officer.experienceYears != null
      ? `${officer.experienceYears} years experience`
      : "Experience not provided";
  const hasContact = Boolean(officer.phone?.trim() || officer.email?.trim());
  const skillChips = getOfficerSkillChips(officer);

  if (layout === "mobile-compact") {
    const mobileSkillChips = getOfficerSkillChips(officer, 3);

    return (
      <article className="px-3 py-2.5">
        <div className="flex items-start gap-2.5">
          <OfficerPhoto
            name={officerName}
            photoUrl={officer.profilePhotoUrl}
            mobile
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="min-w-0 truncate text-sm font-semibold text-fo-text">
                {officerName}
              </h3>
              <StatusBadge
                variant={cancelled ? "neutral" : "success"}
                className="!min-h-5 shrink-0 !px-1.5 !py-0 !text-[9px] !leading-5"
              >
                {cancelled ? "CANCELLED" : "CONFIRMED"}
              </StatusBadge>
            </div>

            <p className="mt-0.5 truncate text-xs text-fo-text-muted">
              {locationLabel || "Location not provided"}
            </p>
            <p className="truncate text-xs text-fo-text-subtle">{experienceLabel}</p>

            {mobileSkillChips.chips.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {mobileSkillChips.chips.map((chip) => (
                  <SkillChip key={chip} label={chip} />
                ))}
                {mobileSkillChips.overflowCount > 0 ? (
                  <SkillChip label={`+${mobileSkillChips.overflowCount}`} />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {cancelled && shiftId ? (
            <Link
              href={`/shifts/${shiftId}`}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-fo-primary-bright/40 px-2.5 text-xs font-semibold text-fo-primary-bright transition hover:bg-fo-primary/10"
            >
              View Shift
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-fo-primary-bright/40 px-2.5 text-xs font-semibold text-fo-primary-bright transition hover:bg-fo-primary/10"
            >
              {expanded ? "Hide Profile" : "View Profile"}
            </button>
          )}
          {showHideFromList ? (
            <RemoveFromCompanyListButton
              applicationId={officerRecord.applicationId}
              onRemoved={() => onHidden?.()}
            />
          ) : null}
          {showRemove ? (
            <RemoveAcceptedOfficerButton
              applicationId={officerRecord.applicationId}
              officerName={officerName}
              shiftTitle={shiftTitle ?? "this shift"}
              onRemoved={() => onRemoved?.()}
              className="min-h-9 w-full px-2.5"
            />
          ) : null}
        </div>

        {expanded ? (
          <div className="mt-2.5 border-t border-white/[0.06] pt-2.5">
            <OfficerProfileDetails officer={officer} hasContact={hasContact} />
          </div>
        ) : null}
      </article>
    );
  }

  if (layout === "desktop-row") {
    return (
      <article className="px-4 py-3">
        <div className="flex items-center gap-4">
          <OfficerPhoto
            name={officerName}
            photoUrl={officer.profilePhotoUrl}
            compact
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-fo-text">
                {officerName}
              </h3>
              <StatusBadge
                variant={cancelled ? "neutral" : "success"}
                className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5"
              >
                {cancelled ? "CANCELLED" : "CONFIRMED"}
              </StatusBadge>
            </div>

            <p className="mt-1 text-xs text-fo-text-muted">
              {locationLabel || "Location not provided"}
              <span className="mx-1.5 text-fo-text-subtle">·</span>
              {experienceLabel}
            </p>

            {skillChips.chips.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {skillChips.chips.map((chip) => (
                  <SkillChip key={chip} label={chip} />
                ))}
                {skillChips.overflowCount > 0 ? (
                  <SkillChip label={`+${skillChips.overflowCount}`} />
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {cancelled && shiftId ? (
              <Link
                href={`/shifts/${shiftId}`}
                className={buttonClassName({
                  variant: "secondary",
                  size: "md",
                  className: "min-h-9 whitespace-nowrap px-3 text-xs",
                })}
              >
                View Shift
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                className={buttonClassName({
                  variant: "secondary",
                  size: "md",
                  className:
                    "min-h-9 whitespace-nowrap border-blue-500/30 px-3 text-xs text-blue-100 hover:bg-blue-500/10",
                })}
              >
                {expanded ? "Hide Profile" : "View Full Profile"}
              </button>
            )}
            {showHideFromList ? (
              <RemoveFromCompanyListButton
                applicationId={officerRecord.applicationId}
                onRemoved={() => onHidden?.()}
              />
            ) : null}
            {showRemove ? (
              <RemoveAcceptedOfficerButton
                applicationId={officerRecord.applicationId}
                officerName={officerName}
                shiftTitle={shiftTitle ?? "this shift"}
                onRemoved={() => onRemoved?.()}
                label="Remove Officer"
                className="min-h-9 whitespace-nowrap px-3"
              />
            ) : null}
          </div>
        </div>

        {expanded ? (
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            <OfficerProfileDetails officer={officer} hasContact={hasContact} />
          </div>
        ) : null}
      </article>
    );
  }

  return null;
}
