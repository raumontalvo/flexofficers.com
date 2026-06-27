"use client";

import Link from "next/link";
import { useState } from "react";
import { ProfileAvatar, StatusBadge } from "@/components/ui";
import { CompanyOfficerLicenses } from "@/components/company/company-officer-licenses";
import { RemoveFromCompanyListButton } from "@/components/company/remove-from-company-list-button";
import type { CompanyWorkforceOfficer } from "@/lib/company-workforce-data";
import { formatArmedStatuses, normalizeExperienceCategories } from "@/lib/profile-options";

type AcceptedOfficerCardProps = {
  officerRecord: CompanyWorkforceOfficer;
  showRemove?: boolean;
  showHideFromList?: boolean;
  onHidden?: () => void;
  cancelled?: boolean;
  shiftId?: string;
};

function OfficerPhoto({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  if (photoUrl?.trim()) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-fo-bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return <ProfileAvatar name={name} size="lg" />;
}

export function AcceptedOfficerCard({
  officerRecord,
  showRemove = true,
  showHideFromList = false,
  onHidden,
  cancelled = false,
  shiftId,
}: AcceptedOfficerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { officer } = officerRecord;
  const officerName = `${officer.firstName} ${officer.lastName}`.trim();
  const locationLabel = [officer.city, officer.state].filter(Boolean).join(", ");
  const experienceCategories = normalizeExperienceCategories(
    officer.experienceCategories
  );
  const armedLabel = formatArmedStatuses(officer.armedStatuses);
  const hasContact = Boolean(officer.phone?.trim() || officer.email?.trim());

  return (
    <article className="fo-glass-card rounded-lg border border-white/10 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <OfficerPhoto name={officerName} photoUrl={officer.profilePhotoUrl} />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                variant={cancelled ? "neutral" : "success"}
                className="!min-h-5 !px-1.5 !py-0 !text-[9px] !leading-5"
              >
                {cancelled ? "CANCELLED" : "CONFIRMED"}
              </StatusBadge>
            </div>

            <div>
              <h3 className="text-base font-bold text-fo-text">{officerName}</h3>
              <p className="text-xs text-fo-text-muted">
                {locationLabel || "Location not provided"}
              </p>
              <p className="mt-0.5 text-xs text-fo-text-muted">
                {officer.experienceYears != null
                  ? `${officer.experienceYears} years experience`
                  : "Experience not provided"}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {armedLabel ? (
                <span className="rounded-full border border-slate-600/50 bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                  {armedLabel}
                </span>
              ) : null}
              {experienceCategories.slice(0, 4).map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-600/50 bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                >
                  {category}
                </span>
              ))}
              {experienceCategories.length > 4 ? (
                <span className="text-[10px] text-fo-text-subtle">
                  +{experienceCategories.length - 4}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row lg:flex-col">
          {cancelled && shiftId ? (
            <Link
              href={`/shifts/${shiftId}`}
              className="inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
            >
              View Shift
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className="inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
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
            <button
              type="button"
              disabled
              title="Officer removal is not supported yet."
              className="inline-flex min-h-8 cursor-not-allowed items-center justify-center rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300/50"
            >
              Remove Officer
            </button>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3">
          {officer.certifications.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle">
                Certifications
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {officer.certifications.map((certification) => (
                  <span
                    key={certification}
                    className="rounded-full border border-slate-600/50 bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                  >
                    {certification}
                  </span>
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
      ) : null}
    </article>
  );
}
