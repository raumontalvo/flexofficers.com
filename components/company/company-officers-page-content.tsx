"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AddToStaffButton } from "@/components/company/add-to-staff-button";
import { OfficerProfilePanel } from "@/components/company/officer-profile-panel";
import { officerProfileNameLabel } from "@/components/company/officer-profile-name";
import { InviteOfficerModal } from "@/components/company/invite-officer-modal";
import type { CompanyOpenShiftOption } from "@/components/company/invite-officer-to-shift";
import {
  getOfficerInviteButtonState,
  type CompanyOfficerInviteRecord,
} from "@/lib/company-invite-workflow";
import { buttonClassName } from "@/components/ui";
import {
  OFFICER_AVAILABILITY_FILTER_OPTIONS,
  OFFICER_BACKGROUND_FILTER_OPTIONS,
  OFFICER_CERTIFICATION_FILTER_OPTIONS,
  OFFICER_LICENSE_FILTER_OPTIONS,
  sortOfficerSearchResults,
  type OfficerSortOption,
  type SerializedOfficerSearchResult,
} from "@/lib/company-officers-page";
import type { OfficerSearchFilters } from "@/lib/officer-search";
import {
  buildOfficerSearchQuery,
  countAdvancedOfficerFilters,
  getOfficerQuickSearchDisplay,
} from "@/lib/officer-search-params";
import { US_STATES } from "@/lib/license-options";
import { OfficerSearchCard } from "@/app/company/officers/OfficerSearchCard";
import { OfficerFiltersSheet } from "@/app/company/officers/OfficerFiltersSheet";
import { OfficerSearchMobileCard } from "@/app/company/officers/OfficerSearchMobileCard";

const fieldClassName =
  "min-h-10 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

const mobileSearchFieldClassName =
  "min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function OfficerResultCard({
  officer,
  onViewProfile,
  onInvite,
  inviteState,
  isOnStaff,
  onStaffChange,
}: {
  officer: SerializedOfficerSearchResult;
  onViewProfile: () => void;
  onInvite: () => void;
  inviteState: ReturnType<typeof getOfficerInviteButtonState>;
  isOnStaff: boolean;
  onStaffChange: (officerId: string, onStaff: boolean) => void;
}) {
  return (
    <OfficerSearchCard
      officer={officer}
      actions={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onViewProfile}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className:
                "min-h-10 flex-1 border-blue-500/30 px-4 text-sm text-blue-100 hover:bg-blue-500/10",
            })}
          >
            View Full Profile
          </button>
          {inviteState.kind === "invite" ? (
            <button
              type="button"
              onClick={onInvite}
              className={buttonClassName({
                size: "md",
                className: "min-h-10 flex-1 px-4 text-sm",
              })}
            >
              Invite to Apply
            </button>
          ) : (
            <div className="flex min-h-10 flex-1 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-center">
              <div>
                <p className="text-sm font-semibold text-amber-100">
                  {inviteState.label}
                </p>
                {inviteState.kind === "pending" ? (
                  <p className="mt-0.5 text-xs text-amber-200/80">
                    Pending Response
                  </p>
                ) : null}
              </div>
            </div>
          )}
          <AddToStaffButton
            officerId={officer.id}
            isOnStaff={isOnStaff}
            className="flex-1"
            onAdded={() => onStaffChange(officer.id, true)}
            onRemoved={() => onStaffChange(officer.id, false)}
          />
        </div>
      }
    />
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
  staffOfficerIds: string[];
};

export function CompanyOfficersPageContent({
  officers,
  filters,
  hasActiveFilters: _hasActiveFilters,
  openShifts,
  invites: initialInvites,
  staffOfficerIds: initialStaffOfficerIds,
}: CompanyOfficersPageContentProps) {
  const router = useRouter();
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(
    Boolean(
      filters.backgrounds?.length ||
        filters.licenseTypes?.length ||
        filters.certifications?.length ||
        filters.availabilities?.length
    )
  );
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);
  const [sort, setSort] = useState<OfficerSortOption>("alphabetical");
  const [profileOfficerId, setProfileOfficerId] = useState<string | null>(null);
  const [inviteOfficerId, setInviteOfficerId] = useState<string | null>(null);
  const [invites, setInvites] = useState(initialInvites);
  const [staffOfficerIds, setStaffOfficerIds] = useState(
    () => new Set(initialStaffOfficerIds)
  );

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

  const advancedFilterCount = countAdvancedOfficerFilters(filters);
  const openShiftIds = openShifts.map((shift) => shift.id);

  function handleStaffChange(officerId: string, onStaff: boolean) {
    setStaffOfficerIds((current) => {
      const next = new Set(current);
      if (onStaff) {
        next.add(officerId);
      } else {
        next.delete(officerId);
      }
      return next;
    });
  }

  function handleMobileQuickSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    const nextFilters: OfficerSearchFilters = {};

    if (search) {
      nextFilters.search = search;
    }

    if (filters.backgrounds?.length) {
      nextFilters.backgrounds = filters.backgrounds;
    }

    if (filters.licenseTypes?.length) {
      nextFilters.licenseTypes = filters.licenseTypes;
    }

    if (filters.certifications?.length) {
      nextFilters.certifications = filters.certifications;
    }

    if (filters.availabilities?.length) {
      nextFilters.availabilities = filters.availabilities;
    }

    if (filters.state) {
      nextFilters.state = filters.state;
    }

    if (typeof filters.minExperienceYears === "number") {
      nextFilters.minExperienceYears = filters.minExperienceYears;
    }

    if (filters.experienceCategory) {
      nextFilters.experienceCategory = filters.experienceCategory;
    }

    if (filters.armedStatuses?.length) {
      nextFilters.armedStatuses = filters.armedStatuses;
    }

    const query = buildOfficerSearchQuery(nextFilters).toString();
    router.push(query ? `/company/officers?${query}` : "/company/officers");
  }

  return (
    <div className="mt-4 space-y-3 lg:mt-6 lg:space-y-4">
      <div className="lg:hidden">
        <form
          onSubmit={handleMobileQuickSearch}
          className="flex items-center gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fo-text-subtle" />
            <input
              name="search"
              defaultValue={getOfficerQuickSearchDisplay(filters)}
              placeholder="Search by name or city"
              className={mobileSearchFieldClassName}
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersSheetOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-semibold text-fo-text"
          >
            Filters
            {advancedFilterCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-fo-primary-bright/20 px-1.5 text-[10px] font-bold text-fo-primary-hover">
                {advancedFilterCount}
              </span>
            ) : null}
          </button>
        </form>
      </div>

      <section className="hidden fo-glass-card rounded-xl border border-white/10 p-4 lg:block">
        <form method="get" className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-xs font-medium text-fo-text-muted">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                defaultValue={filters.firstName ?? ""}
                placeholder="First name"
                className={fieldClassName}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-xs font-medium text-fo-text-muted">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                defaultValue={filters.lastName ?? ""}
                placeholder="Last name"
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
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
            <p className="text-sm font-medium text-fo-text">
              {sortedOfficers.length} officer{sortedOfficers.length === 1 ? "" : "s"} found
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-fo-text-muted">
                <span className="lg:hidden">Sort:</span>
                <span className="hidden lg:inline">Sort By</span>
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
            </div>
          </div>

          <div className="space-y-2.5 pb-24 lg:hidden">
            {sortedOfficers.map((officer) => (
              <OfficerSearchMobileCard
                key={officer.id}
                officer={officer}
                onViewProfile={() => setProfileOfficerId(officer.id)}
                onInvite={() => setInviteOfficerId(officer.id)}
                inviteState={getOfficerInviteButtonState(
                  officer.id,
                  invites,
                  openShiftIds
                )}
              />
            ))}
          </div>

          <div className="hidden space-y-4 lg:block">
            {sortedOfficers.map((officer) => (
              <OfficerResultCard
                key={officer.id}
                officer={officer}
                onViewProfile={() => setProfileOfficerId(officer.id)}
                onInvite={() => setInviteOfficerId(officer.id)}
                inviteState={getOfficerInviteButtonState(
                  officer.id,
                  invites,
                  openShiftIds
                )}
                isOnStaff={staffOfficerIds.has(officer.id)}
                onStaffChange={handleStaffChange}
              />
            ))}
          </div>
        </>
      )}

      <OfficerFiltersSheet
        open={filtersSheetOpen}
        filters={filters}
        onClose={() => setFiltersSheetOpen(false)}
      />

      <OfficerProfilePanel
        officer={profileOfficer}
        onClose={() => setProfileOfficerId(null)}
        isOnStaff={profileOfficer ? staffOfficerIds.has(profileOfficer.id) : false}
        onStaffChange={
          profileOfficer
            ? (onStaff) => handleStaffChange(profileOfficer.id, onStaff)
            : undefined
        }
      />

      <InviteOfficerModal
        officerId={inviteOfficerId}
        officerName={
          inviteOfficer
            ? officerProfileNameLabel(
                inviteOfficer.firstName,
                inviteOfficer.lastName
              )
            : "Officer"
        }
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
