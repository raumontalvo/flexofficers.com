"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { ApplicantMobileCard } from "@/components/company/applicant-mobile-card";
import { ApplicationReviewPanel } from "@/components/company/application-review-panel";
import { ApplicantsShiftSummaryPanel } from "@/components/company/applicants-shift-summary-panel";
import { getHiddenCompanyApplicantIds } from "@/components/company/remove-company-applicant-button";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName, ProfileAvatar } from "@/components/ui";
import { MobileSecondaryButton } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import { getApplicationStatusLabel, getCompanyApplicantsTabs } from "@/lib/i18n/ui-labels";
import {
  filterCompanyApplicantsByShift,
  filterCompanyApplicantsByTab,
  formatApplicantShiftSchedule,
  getCompanyApplicantsTabCounts,
  getUniqueApplicantShifts,
  searchCompanyApplicants,
  type CompanyApplicantsTab,
  type SerializedCompanyApplicant,
} from "@/lib/company-applications-page";

const MOBILE_TAB_STYLES: Record<
  CompanyApplicantsTab,
  { selected: string; unselected: string }
> = {
  all: {
    selected: "border-blue-500/45 bg-blue-500/20 text-blue-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
  pending: {
    selected: "border-amber-500/45 bg-amber-500/20 text-amber-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
  accepted: {
    selected: "border-green-500/45 bg-green-500/20 text-green-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
  rejected: {
    selected: "border-red-500/45 bg-red-500/20 text-red-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
};

const DESKTOP_CARD_GRID = "grid grid-cols-[260px_minmax(0,1fr)_180px] items-center gap-x-6";

async function updateApplicationStatus(
  applicationId: string,
  nextStatus: "ACCEPTED" | "REJECTED",
  errorFallback: string
) {
  const response = await fetch("/api/applications/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ applicationId, status: nextStatus }),
  });

  if (response.ok) {
    window.location.reload();
    return;
  }

  const data = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  alert(data?.error || errorFallback);
}

function ApplicantDesktopRow({
  application,
  isSelected,
  onSelect,
  onView,
  updateErrorMessage,
}: {
  application: SerializedCompanyApplicant;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  updateErrorMessage: string;
}) {
  const schedule = formatApplicantShiftSchedule(
    application.shiftStartTime,
    application.shiftEndTime
  );
  const locationLine = application.shiftLocationSubtext
    ? `${application.shiftLocationLabel} · ${application.shiftLocationSubtext}`
    : application.shiftLocationLabel;
  const email = application.officerProfile.email;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        DESKTOP_CARD_GRID,
        "min-h-[128px] cursor-pointer border-b border-white/[0.04] px-5 py-4 transition hover:bg-white/[0.03]",
        isSelected && "bg-blue-500/[0.06]"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <OfficerAvatar
          name={application.officerName}
          photoUrl={application.profilePhotoUrl}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-fo-text">
            {application.officerName}
          </p>
          {application.phone ? (
            <p className="mt-1 text-xs leading-snug text-fo-text-muted">
              {application.phone}
            </p>
          ) : null}
          {email ? (
            <p className="mt-1 text-xs leading-snug text-fo-text-subtle">
              {email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-fo-text">
          {application.shiftTitle}
        </p>
        <p className="mt-1 text-xs leading-snug text-fo-text-muted">{locationLine}</p>
        <p className="mt-1 text-xs leading-snug text-fo-text-muted">
          {schedule.dateLabel}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-fo-text-subtle">
          {schedule.timeLabel}
        </p>
      </div>

      <div
        className="flex min-w-0 flex-col items-end gap-2"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="text-right">
          <p className="text-xs leading-snug text-fo-text-muted">
            {application.appliedDateLabel}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-fo-text-subtle">
            {application.appliedTimeLabel}
          </p>
        </div>
        <ApplicantStatusBadge status={application.status} />
        <ApplicantRowActions
          application={application}
          onView={onView}
          updateErrorMessage={updateErrorMessage}
        />
      </div>
    </div>
  );
}

function ApplicantStatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useLandingLanguage();
  const styles = {
    [ApplicationStatus.PENDING]: "border-amber-500/25 bg-amber-500/10 text-amber-100",
    [ApplicationStatus.ACCEPTED]: "border-green-500/25 bg-green-500/10 text-green-100",
    [ApplicationStatus.REJECTED]: "border-red-500/25 bg-red-500/10 text-red-100",
    [ApplicationStatus.WITHDRAWN]: "border-white/10 bg-white/[0.04] text-fo-text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[status]
      )}
    >
      {getApplicationStatusLabel(t, status)}
    </span>
  );
}

function ApplicantRowActions({
  application,
  onView,
  updateErrorMessage,
}: {
  application: SerializedCompanyApplicant;
  onView: () => void;
  updateErrorMessage: string;
}) {
  const { t } = useLandingLanguage();
  const actions = t.browse.companyApplicants.actions;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPending = application.status === ApplicationStatus.PENDING;

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex shrink-0 items-center justify-end gap-1">
      <button
        type="button"
        onClick={onView}
        className={buttonClassName({
          variant: "secondary",
          size: "md",
          className: "min-h-9 shrink-0 px-3 text-xs",
        })}
      >
        {actions.view}
      </button>

      {isPending ? (
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-sm font-semibold text-fo-text transition hover:bg-white/[0.06]"
            aria-label={`${actions.accept} / ${actions.reject}`}
            aria-expanded={menuOpen}
          >
            ⋮
          </button>

          {menuOpen ? (
            <div className="absolute right-0 z-30 mt-1 min-w-[132px] overflow-hidden rounded-lg border border-white/10 bg-fo-bg-elevated py-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void updateApplicationStatus(
                    application.id,
                    "ACCEPTED",
                    updateErrorMessage
                  );
                }}
                className="block w-full px-3 py-2 text-left text-xs font-semibold text-green-100 transition hover:bg-green-500/10"
              >
                {actions.accept}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void updateApplicationStatus(
                    application.id,
                    "REJECTED",
                    updateErrorMessage
                  );
                }}
                className="block w-full px-3 py-2 text-left text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
              >
                {actions.reject}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
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

function ApplicantFilters({
  activeTab,
  onTabChange,
  tabCounts,
  searchQuery,
  onSearchChange,
  shiftFilter,
  onShiftFilterChange,
  shiftOptions,
  compact = false,
}: {
  activeTab: CompanyApplicantsTab;
  onTabChange: (tab: CompanyApplicantsTab) => void;
  tabCounts: ReturnType<typeof getCompanyApplicantsTabCounts>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  shiftFilter: string | null;
  onShiftFilterChange: (shiftId: string | null) => void;
  shiftOptions: ReturnType<typeof getUniqueApplicantShifts>;
  compact?: boolean;
}) {
  const { t } = useLandingLanguage();
  const copy = t.browse.companyApplicants;
  const tabs = getCompanyApplicantsTabs(t);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className={cn("space-y-2.5", compact && "space-y-2")}>
      {compact ? (
        <div className="grid w-full min-w-0 grid-cols-4 gap-1.5">
          {tabs.map((tab) => {
            const count = tabCounts[tab.id];
            const isActive = activeTab === tab.id;
            const styles = MOBILE_TAB_STYLES[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-pressed={isActive}
                className={cn(
                  "min-w-0 rounded-full border px-0.5 py-1.5 text-center text-[9px] font-semibold leading-tight transition sm:text-[10px]",
                  isActive ? styles.selected : styles.unselected
                )}
              >
                <span className="block whitespace-normal">
                  {tab.mobileLabel ?? tab.label}
                </span>
                {count > 0 ? (
                  <span className="mt-0.5 block text-[9px] opacity-80">({count})</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex min-w-max flex-nowrap gap-1.5">
            {tabs.map((tab) => {
              const count = tabCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition",
                    activeTab === tab.id
                      ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                      : "text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                  )}
                >
                  {tab.label}
                  {count > 0 ? (
                    <span className="ml-1 text-[10px] opacity-80">({count})</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex min-w-0 items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{copy.searchPlaceholder}</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className={cn(
              "w-full rounded-xl border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20",
              compact ? "min-h-9" : "min-h-9 lg:min-h-10"
            )}
          />
        </label>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-semibold transition",
              compact ? "min-h-9" : "min-h-9 lg:min-h-10",
              shiftFilter
                ? "border-fo-primary-bright/40 bg-fo-primary-bright/10 text-fo-primary-hover"
                : "border-white/10 text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
            )}
          >
            {copy.filter}
          </button>

          {filterOpen ? (
            <div className="absolute right-0 z-30 mt-1 max-h-56 min-w-[220px] overflow-y-auto rounded-lg border border-white/10 bg-fo-bg-elevated p-2 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  onShiftFilterChange(null);
                  setFilterOpen(false);
                }}
                className={cn(
                  "block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-white/[0.04]",
                  !shiftFilter ? "text-fo-text" : "text-fo-text-muted"
                )}
              >
                All Shifts
              </button>
              {shiftOptions.map((shift) => (
                <button
                  key={shift.id}
                  type="button"
                  onClick={() => {
                    onShiftFilterChange(shift.id);
                    setFilterOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-white/[0.04]",
                    shiftFilter === shift.id
                      ? "text-fo-primary-hover"
                      : "text-fo-text-muted"
                  )}
                >
                  {shift.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type CompanyApplicantsPageContentProps = {
  applications: SerializedCompanyApplicant[];
};

export function CompanyApplicantsPageContent({
  applications,
}: CompanyApplicantsPageContentProps) {
  const { t } = useLandingLanguage();
  const copy = t.browse.companyApplicants;
  const tabs = getCompanyApplicantsTabs(t);
  const [activeTab, setActiveTab] = useState<CompanyApplicantsTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(
    applications[0]?.id ?? null
  );
  const [reviewApplicationId, setReviewApplicationId] = useState<string | null>(
    null
  );
  const [hiddenVersion, setHiddenVersion] = useState(0);

  const tabCounts = useMemo(
    () => getCompanyApplicantsTabCounts(applications),
    [applications]
  );
  const shiftOptions = useMemo(
    () => getUniqueApplicantShifts(applications),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const byTab = filterCompanyApplicantsByTab(applications, activeTab);
    const byShift = filterCompanyApplicantsByShift(byTab, shiftFilter);
    return searchCompanyApplicants(byShift, searchQuery);
  }, [activeTab, applications, searchQuery, shiftFilter]);

  const mobileVisibleApplications = useMemo(() => {
    const hidden = new Set(getHiddenCompanyApplicantIds());
    return filteredApplications.filter(
      (application) => !hidden.has(application.id)
    );
  }, [filteredApplications, hiddenVersion]);

  function handleApplicantHidden() {
    setHiddenVersion((version) => version + 1);
  }

  const selectedApplication = useMemo(() => {
    return (
      filteredApplications.find(
        (application) => application.id === selectedApplicationId
      ) ??
      filteredApplications[0] ??
      null
    );
  }, [filteredApplications, selectedApplicationId]);

  const reviewApplication = useMemo(() => {
    return (
      applications.find((application) => application.id === reviewApplicationId) ??
      null
    );
  }, [applications, reviewApplicationId]);

  useEffect(() => {
    if (
      selectedApplicationId &&
      filteredApplications.some(
        (application) => application.id === selectedApplicationId
      )
    ) {
      return;
    }

    setSelectedApplicationId(filteredApplications[0]?.id ?? null);
  }, [filteredApplications, selectedApplicationId]);

  if (applications.length === 0) {
    return (
      <section className="fo-glass-card mt-4 rounded-xl border border-white/10 px-4 py-12 text-center lg:mt-6">
        <h2 className="text-lg font-semibold text-fo-text">{copy.empty.none}</h2>
        <p className="mt-2 text-sm text-fo-text-muted">{copy.empty.noneDescription}</p>
        <MobileSecondaryButton
          href="/company/shifts"
          className="mx-auto mt-5 min-h-10 max-w-xs text-sm lg:hidden"
        >
          {copy.actions.backToShifts}
        </MobileSecondaryButton>
        <Link
          href="/company/shifts"
          className={buttonClassName({
            size: "md",
            className: "mt-5 hidden inline-flex lg:inline-flex",
          })}
        >
          Back to My Shifts
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="mt-4 space-y-3 pb-24 lg:hidden">
        <div className="fo-glass-card rounded-2xl border border-white/10 p-3 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)]">
          <ApplicantFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabCounts={tabCounts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            shiftFilter={shiftFilter}
            onShiftFilterChange={setShiftFilter}
            shiftOptions={shiftOptions}
            compact
          />
        </div>

        {mobileVisibleApplications.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-fo-text-muted">
            {copy.empty.noMatch}
          </div>
        ) : (
          <div className="space-y-2.5">
            {mobileVisibleApplications.map((application) => (
              <ApplicantMobileCard
                key={application.id}
                application={application}
                onView={() => setReviewApplicationId(application.id)}
                onRemove={handleApplicantHidden}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 hidden min-w-0 gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <ApplicantFilters
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabCounts={tabCounts}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              shiftFilter={shiftFilter}
              onShiftFilterChange={setShiftFilter}
              shiftOptions={shiftOptions}
            />
          </div>

          {filteredApplications.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-fo-text-muted">
              {copy.empty.noMatch}
            </div>
          ) : (
            <div>
              {filteredApplications.map((application) => (
                <ApplicantDesktopRow
                  key={application.id}
                  application={application}
                  isSelected={selectedApplication?.id === application.id}
                  onSelect={() => setSelectedApplicationId(application.id)}
                  onView={() => setReviewApplicationId(application.id)}
                  updateErrorMessage={copy.errors.updateFailed}
                />
              ))}
            </div>
          )}
        </section>

        <div className="min-w-0 shrink-0 lg:w-[280px]">
          <ApplicantsShiftSummaryPanel
            applications={applications}
            selectedApplication={selectedApplication}
          />
        </div>
      </div>

      <ApplicationReviewPanel
        application={reviewApplication}
        allApplications={applications}
        onClose={() => setReviewApplicationId(null)}
      />
    </>
  );
}
