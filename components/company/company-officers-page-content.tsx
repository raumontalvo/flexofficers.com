"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OfficerProfilePanel } from "@/components/company/officer-profile-panel";
import { InviteOfficerModal } from "@/components/company/invite-officer-modal";
import type { CompanyOpenShiftOption } from "@/components/company/invite-officer-to-shift";
import {
  getOfficerInviteButtonState,
  type CompanyOfficerInviteRecord,
} from "@/lib/company-invite-workflow";
import { buttonClassName, ProfileAvatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  OFFICER_AVAILABILITY_FILTER_OPTIONS,
  OFFICER_BACKGROUND_FILTER_OPTIONS,
  OFFICER_CERTIFICATION_FILTER_OPTIONS,
  OFFICER_LICENSE_FILTER_OPTIONS,
  sortOfficerSearchResults,
  type OfficerSortOption,
  type OfficerViewMode,
  type SerializedOfficerSearchResult,
} from "@/lib/company-officers-page";
import type { OfficerSearchFilters } from "@/lib/officer-search";
import { US_STATES } from "@/lib/license-options";

const fieldClassName =
  "min-h-10 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M10 17s5-4.5 5-8.5a5 5 0 1 0-10 0C5 12.5 10 17 10 17Z" />
      <circle cx="10" cy="8.5" r="1.75" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
      <path d="M7 3.5v2M13 3.5v2M3.5 8h13" />
    </svg>
  );
}

function ChipList({ values }: { values: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value) => (
        <span
          key={value}
          className="inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-100"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function QualificationSection({
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
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle">
        {label}
      </p>
      <div className="mt-1">
        <ChipList values={values} />
      </div>
    </div>
  );
}

function OfficerQualifications({
  officer,
  compact = false,
}: {
  officer: SerializedOfficerSearchResult;
  compact?: boolean;
}) {
  const sections = [
    { label: "Background", values: officer.backgroundCategories },
    { label: "Licenses", values: officer.licenseTypeLabels },
    { label: "Certifications", values: officer.certifications },
    { label: "Availability", values: officer.availabilityLabels },
  ];

  const visibleSections = sections.filter((section) => section.values.length > 0);

  if (visibleSections.length === 0) {
    return (
      <p className="text-sm text-fo-text-muted">Not provided</p>
    );
  }

  return (
    <div
      className={cn(
        "grid min-w-0 gap-3",
        compact ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-4"
      )}
    >
      {visibleSections.map((section) => (
        <QualificationSection
          key={section.label}
          label={section.label}
          values={section.values}
        />
      ))}
    </div>
  );
}

function OfficerIdentity({
  officer,
  stacked = false,
}: {
  officer: SerializedOfficerSearchResult;
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0",
        stacked ? "flex flex-col items-center text-center" : "flex items-start gap-3"
      )}
    >
      <ProfileAvatar
        name={officer.fullName}
        src={officer.profilePhotoUrl}
        size="md"
        className={stacked ? "shrink-0" : undefined}
      />
      <div className={cn("min-w-0", stacked && "mt-2 w-full")}>
        <p className="truncate text-sm font-semibold text-fo-text">
          {officer.fullName}
        </p>
        <span className="mt-1 inline-flex max-w-full rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-100">
          <span className="truncate">{officer.statusBadgeLabel}</span>
        </span>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-fo-text-muted">
          <LocationIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
          <span className="truncate">{officer.cityStateLabel}</span>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-fo-text-muted">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
          <span>{officer.experienceYearsLabel}</span>
        </p>
      </div>
    </div>
  );
}

function OfficerCardActions({
  onViewProfile,
  onInvite,
  inviteState,
}: {
  onViewProfile: () => void;
  onInvite: () => void;
  inviteState: ReturnType<typeof getOfficerInviteButtonState>;
}) {
  return (
    <div className="flex w-[148px] shrink-0 flex-col justify-center gap-2">
      <button
        type="button"
        onClick={onViewProfile}
        className={buttonClassName({
          variant: "secondary",
          size: "md",
          className:
            "min-h-9 w-full border-blue-500/30 px-3 text-xs text-blue-100 hover:bg-blue-500/10",
        })}
      >
        View Profile
      </button>
      {inviteState.kind === "invite" ? (
        <button
          type="button"
          onClick={onInvite}
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "min-h-9 w-full px-3 text-xs",
          })}
        >
          Invite to Apply
        </button>
      ) : (
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center">
          <p className="text-[11px] font-semibold text-amber-100">
            {inviteState.label}
          </p>
          {inviteState.kind === "pending" ? (
            <p className="mt-0.5 text-[10px] text-amber-200/80">
              Pending Response
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function OfficerResultCard({
  officer,
  viewMode,
  onViewProfile,
  onInvite,
  inviteState,
}: {
  officer: SerializedOfficerSearchResult;
  viewMode: OfficerViewMode;
  onViewProfile: () => void;
  onInvite: () => void;
  inviteState: ReturnType<typeof getOfficerInviteButtonState>;
}) {
  if (viewMode === "grid") {
    return (
      <article className="fo-glass-card flex h-full min-h-[220px] flex-col rounded-xl border border-white/10 p-4 transition hover:border-white/15 hover:bg-white/[0.04]">
        <OfficerIdentity officer={officer} stacked />
        <div className="mt-4 flex-1">
          <OfficerQualifications officer={officer} compact />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onViewProfile}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className:
                "min-h-9 w-full border-blue-500/30 text-xs text-blue-100 hover:bg-blue-500/10",
            })}
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={onInvite}
            disabled={inviteState.kind !== "invite"}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "min-h-9 w-full text-center text-xs",
            })}
          >
            {inviteState.kind === "invite"
              ? "Invite to Apply"
              : inviteState.label}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="fo-glass-card grid min-h-[132px] grid-cols-1 gap-4 rounded-xl border border-white/10 p-4 transition hover:border-white/15 hover:bg-white/[0.04] lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)_132px] lg:items-center">
      <OfficerIdentity officer={officer} />
      <OfficerQualifications officer={officer} />
      <OfficerCardActions
        onViewProfile={onViewProfile}
        onInvite={onInvite}
        inviteState={inviteState}
      />
    </article>
  );
}

function FilterCheckboxGroup({
  name,
  options,
  selected,
}: {
  name: string;
  options: readonly string[];
  selected: string[];
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
        >
          <input
            type="checkbox"
            name={name}
            value={option}
            defaultChecked={selected.includes(option)}
            className="rounded border-fo-border text-fo-primary-bright focus:ring-fo-primary-bright/30"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

type CompanyOfficersPageContentProps = {
  officers: SerializedOfficerSearchResult[];
  filters: OfficerSearchFilters;
  hasActiveFilters: boolean;
  openShifts: CompanyOpenShiftOption[];
  invites: CompanyOfficerInviteRecord[];
};

export function CompanyOfficersPageContent({
  officers,
  filters,
  hasActiveFilters,
  openShifts,
  invites: initialInvites,
}: CompanyOfficersPageContentProps) {
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(
    Boolean(
      filters.backgrounds?.length ||
        filters.licenseTypes?.length ||
        filters.certifications?.length ||
        filters.availabilities?.length
    )
  );
  const [sort, setSort] = useState<OfficerSortOption>("alphabetical");
  const [viewMode, setViewMode] = useState<OfficerViewMode>("list");
  const [profileOfficerId, setProfileOfficerId] = useState<string | null>(null);
  const [inviteOfficerId, setInviteOfficerId] = useState<string | null>(null);
  const [invites, setInvites] = useState(initialInvites);

  const sortedOfficers = useMemo(
    () => sortOfficerSearchResults(officers, sort),
    [officers, sort]
  );

  const profileOfficer = useMemo(
    () => officers.find((officer) => officer.id === profileOfficerId) ?? null,
    [officers, profileOfficerId]
  );

  const inviteOfficer = useMemo(
    () => officers.find((officer) => officer.id === inviteOfficerId) ?? null,
    [officers, inviteOfficerId]
  );

  return (
    <div className="mt-6 space-y-4">
      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <form method="get" className="space-y-3">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] lg:items-end">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-fo-text-muted">
                Officer Name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={filters.name ?? ""}
                placeholder="Officer name"
                className={fieldClassName}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="city" className="text-xs font-medium text-fo-text-muted">
                City
              </label>
              <input
                id="city"
                name="city"
                defaultValue={filters.city ?? ""}
                placeholder="City"
                className={fieldClassName}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="state" className="text-xs font-medium text-fo-text-muted">
                State
              </label>
              <input
                id="state"
                name="state"
                list="officer-state-options"
                defaultValue={filters.state ?? ""}
                placeholder="State"
                className={fieldClassName}
              />
              <datalist id="officer-state-options">
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.name} />
                ))}
                {US_STATES.map((state) => (
                  <option key={`${state.code}-code`} value={state.code} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className={buttonClassName({
                  size: "md",
                  fullWidth: true,
                  className: "min-h-12 sm:min-h-10 sm:flex-1",
                })}
              >
                Search
              </button>
              <Link
                href="/company/officers"
                className={buttonClassName({
                  variant: "secondary",
                  size: "md",
                  fullWidth: true,
                  className: "min-h-12 text-center sm:min-h-10 sm:flex-1",
                })}
              >
                Clear Filters
              </Link>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-3">
            <button
              type="button"
              onClick={() => setMoreFiltersOpen((open) => !open)}
              className="flex w-full items-center justify-between text-sm font-semibold text-fo-text"
            >
              <span>{moreFiltersOpen ? "▲" : "▼"} More Filters</span>
            </button>

            {moreFiltersOpen ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
                    Background
                  </p>
                  <FilterCheckboxGroup
                    name="background"
                    options={OFFICER_BACKGROUND_FILTER_OPTIONS}
                    selected={filters.backgrounds ?? []}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
                    License Types
                  </p>
                  <FilterCheckboxGroup
                    name="licenseType"
                    options={OFFICER_LICENSE_FILTER_OPTIONS}
                    selected={filters.licenseTypes ?? []}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
                    Certifications
                  </p>
                  <FilterCheckboxGroup
                    name="certification"
                    options={OFFICER_CERTIFICATION_FILTER_OPTIONS}
                    selected={filters.certifications ?? []}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
                    Availability
                  </p>
                  <FilterCheckboxGroup
                    name="availability"
                    options={OFFICER_AVAILABILITY_FILTER_OPTIONS}
                    selected={filters.availabilities ?? []}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </form>
      </section>

      {sortedOfficers.length === 0 ? (
        <section className="fo-glass-card rounded-xl border border-white/10 px-4 py-12 text-center">
          <h2 className="text-lg font-semibold text-fo-text">No officers found.</h2>
          <p className="mt-2 text-sm text-fo-text-muted">
            Try another city or adjust your filters.
          </p>
          <Link
            href="/company/officers"
            className={buttonClassName({
              size: "md",
              className: "mt-5 inline-flex",
            })}
          >
            Clear Filters
          </Link>
        </section>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-fo-text">
              {sortedOfficers.length} officer{sortedOfficers.length === 1 ? "" : "s"} found
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-fo-text-muted">
                <span>Sort By</span>
                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as OfficerSortOption)
                  }
                  className="min-h-9 rounded-lg border border-fo-border bg-fo-bg/80 px-2 py-1.5 text-sm text-fo-text"
                >
                  <option value="alphabetical">Alphabetical</option>
                  <option value="experience">Most Experience</option>
                  <option value="newest">Newest</option>
                </select>
              </label>

              <div className="inline-flex rounded-lg border border-white/10 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                    viewMode === "list"
                      ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                      : "text-fo-text-muted hover:text-fo-text"
                  )}
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                    viewMode === "grid"
                      ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                      : "text-fo-text-muted hover:text-fo-text"
                  )}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              viewMode === "grid"
                ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                : "space-y-3"
            )}
          >
            {sortedOfficers.map((officer) => (
              <OfficerResultCard
                key={officer.id}
                officer={officer}
                viewMode={viewMode}
                onViewProfile={() => setProfileOfficerId(officer.id)}
                onInvite={() => setInviteOfficerId(officer.id)}
                inviteState={getOfficerInviteButtonState(officer.id, invites)}
              />
            ))}
          </div>
        </>
      )}

      <OfficerProfilePanel
        officer={profileOfficer}
        onClose={() => setProfileOfficerId(null)}
      />

      <InviteOfficerModal
        officerId={inviteOfficerId}
        officerName={inviteOfficer?.fullName ?? "Officer"}
        openShifts={openShifts}
        invites={invites}
        onClose={() => setInviteOfficerId(null)}
        onInviteSent={(invite) =>
          setInvites((current) => {
            const withoutDuplicate = current.filter(
              (item) =>
                !(
                  item.officerId === invite.officerId &&
                  item.shiftId === invite.shiftId
                )
            );

            return [...withoutDuplicate, invite];
          })
        }
      />
    </div>
  );
}
