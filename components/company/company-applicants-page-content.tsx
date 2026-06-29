"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { ApplicationReviewPanel } from "@/components/company/application-review-panel";
import { ApplicantsShiftSummaryPanel } from "@/components/company/applicants-shift-summary-panel";
import { buttonClassName, ProfileAvatar } from "@/components/ui";
import {
  MobileListCard,
  MobileListCardActions,
  MobileListCardGroup,
  MobilePrimaryButton,
  MobileSecondaryButton,
} from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
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

const TABS: { id: CompanyApplicantsTab; label: string }[] = [
  { id: "all", label: "All Applicants" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

const ROW_GRID =
  "grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.75fr)_72px_118px] items-center gap-x-3";

type ApplicantRowActionsProps = {
  application: SerializedCompanyApplicant;
  onView: () => void;
};

async function updateApplicationStatus(
  applicationId: string,
  nextStatus: "ACCEPTED" | "REJECTED"
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

  alert(data?.error || "Failed to update application");
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 17s5-4.5 5-8.5a5 5 0 1 0-10 0C5 12.5 10 17 10 17Z" />
      <circle cx="10" cy="8.5" r="1.75" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
      <path d="M7 3.5v2M13 3.5v2M3.5 8h13" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.5 4.5h2l1 3-1.5 1.2a8.5 8.5 0 0 0 3.8 3.8L13 11l3 1v2a1.5 1.5 0 0 1-1.5 1.5C8.2 15.5 4.5 11.8 4.5 6A1.5 1.5 0 0 1 6 4.5Z" />
    </svg>
  );
}

function LicenseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3.5" width="12" height="13" rx="1.5" />
      <circle cx="10" cy="9" r="2.25" />
      <path d="M7 14h6" />
    </svg>
  );
}

function ApplicantStatusBadge({ status }: { status: ApplicationStatus }) {
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
      {status}
    </span>
  );
}

function ApplicantRowActions({
  application,
  onView,
  stacked = false,
}: ApplicantRowActionsProps & { stacked?: boolean }) {
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

  if (stacked) {
    return (
      <MobileListCardActions>
        <MobileSecondaryButton onClick={onView}>View</MobileSecondaryButton>
        {isPending ? (
          <>
            <MobilePrimaryButton
              onClick={() => void updateApplicationStatus(application.id, "ACCEPTED")}
            >
              Accept
            </MobilePrimaryButton>
            <MobileSecondaryButton
              onClick={() => void updateApplicationStatus(application.id, "REJECTED")}
              variant="danger"
            >
              Reject
            </MobileSecondaryButton>
          </>
        ) : null}
      </MobileListCardActions>
    );
  }

  return (
    <div className="flex shrink-0 items-center justify-end gap-1">
      <button
        type="button"
        onClick={onView}
        className={buttonClassName({
          variant: "secondary",
          size: "md",
          className: "min-h-8 shrink-0 px-2.5 text-[11px]",
        })}
      >
        View
      </button>

      {isPending ? (
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-sm font-semibold text-fo-text transition hover:bg-white/[0.06]"
            aria-label="Accept or reject applicant"
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
                  void updateApplicationStatus(application.id, "ACCEPTED");
                }}
                className="block w-full px-3 py-2 text-left text-xs font-semibold text-green-100 transition hover:bg-green-500/10"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void updateApplicationStatus(application.id, "REJECTED");
                }}
                className="block w-full px-3 py-2 text-left text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
              >
                Reject
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
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return <ProfileAvatar name={name} size="md" />;
}

function MetaLine({
  icon: Icon,
  children,
}: {
  icon: typeof LocationIcon;
  children: string;
}) {
  return (
    <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] leading-snug text-fo-text-muted">
      <Icon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
      <span className="truncate">{children}</span>
    </p>
  );
}

type CompanyApplicantsPageContentProps = {
  applications: SerializedCompanyApplicant[];
};

export function CompanyApplicantsPageContent({
  applications,
}: CompanyApplicantsPageContentProps) {
  const [activeTab, setActiveTab] = useState<CompanyApplicantsTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(
    applications[0]?.id ?? null
  );
  const [reviewApplicationId, setReviewApplicationId] = useState<string | null>(
    null
  );

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
      <section className="fo-glass-card mt-6 rounded-xl border border-white/10 px-4 py-12 text-center">
        <h2 className="text-lg font-semibold text-fo-text">No applicants yet.</h2>
        <p className="mt-2 text-sm text-fo-text-muted">
          Once officers apply to your shifts, they&apos;ll appear here for review.
        </p>
        <Link
          href="/company/shifts"
          className={buttonClassName({
            size: "md",
            className: "mt-5 inline-flex",
          })}
        >
          View My Shifts
        </Link>
      </section>
    );
  }

  return (
    <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/[0.06] px-3 py-3 sm:px-4">
          <div className="overflow-x-auto">
            <div className="flex min-w-max flex-nowrap gap-2">
              {TABS.map((tab) => {
                const count = tabCounts[tab.id];

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      activeTab === tab.id
                        ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                        : "text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                    )}
                  >
                    {tab.label}
                    {count > 0 ? (
                      <span className="ml-1.5 text-[11px] opacity-80">({count})</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search applicants</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search applicants..."
                className="min-h-9 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20"
              />
            </label>

            <div className="relative w-full shrink-0 sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                className={cn(
                  "min-h-12 w-full rounded-lg border px-3 py-2 text-xs font-semibold transition sm:min-h-9 sm:w-auto",
                  shiftFilter
                    ? "border-fo-primary-bright/40 bg-fo-primary-bright/10 text-fo-primary-hover"
                    : "border-white/10 text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                )}
              >
                Filter
              </button>

              {filterOpen ? (
                <div className="absolute right-0 z-30 mt-1 max-h-56 min-w-[220px] overflow-y-auto rounded-lg border border-white/10 bg-fo-bg-elevated p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setShiftFilter(null);
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
                        setShiftFilter(shift.id);
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

        <div
          className={cn(
            ROW_GRID,
            "hidden border-b border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-fo-text-muted sm:px-4 lg:grid"
          )}
        >
          <div>Applicant</div>
          <div>Shift</div>
          <div>Applied</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-fo-text-muted">
            No applicants match this filter.
          </div>
        ) : (
          <MobileListCardGroup className="lg:hidden">
            {filteredApplications.map((application) => {
              const schedule = formatApplicantShiftSchedule(
                application.shiftStartTime,
                application.shiftEndTime
              );
              const locationLine = application.shiftLocationSubtext
                ? `${application.shiftLocationLabel} · ${application.shiftLocationSubtext}`
                : application.shiftLocationLabel;
              const isSelected = selectedApplication?.id === application.id;

              return (
                <MobileListCard
                  key={application.id}
                  onClick={() => setSelectedApplicationId(application.id)}
                  selected={isSelected}
                >
                    <div className="flex items-start gap-3">
                      <OfficerAvatar
                        name={application.officerName}
                        photoUrl={application.profilePhotoUrl}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-fo-text">
                          {application.officerName}
                        </p>
                        <ApplicantStatusBadge status={application.status} />
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-fo-text">{application.shiftTitle}</p>
                      <MetaLine icon={LocationIcon}>{locationLine}</MetaLine>
                      <MetaLine icon={CalendarIcon}>
                        {`${schedule.dateLabel} · ${schedule.timeLabel}`}
                      </MetaLine>
                      <p className="text-xs text-fo-text-muted">
                        Applied {application.appliedDateLabel} ·{" "}
                        {application.appliedTimeLabel}
                      </p>
                    </div>

                    <ApplicantRowActions
                      application={application}
                      onView={() => setReviewApplicationId(application.id)}
                      stacked
                    />
                </MobileListCard>
              );
            })}
          </MobileListCardGroup>
        )}

        {filteredApplications.length > 0 ? (
          <div className="hidden divide-y divide-white/[0.04] lg:block">
            {filteredApplications.map((application) => {
              const schedule = formatApplicantShiftSchedule(
                application.shiftStartTime,
                application.shiftEndTime
              );
              const locationLine = application.shiftLocationSubtext
                ? `${application.shiftLocationLabel} · ${application.shiftLocationSubtext}`
                : application.shiftLocationLabel;
              const isSelected = selectedApplication?.id === application.id;

              return (
                <div
                  key={application.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedApplicationId(application.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedApplicationId(application.id);
                    }
                  }}
                  className={cn(
                    ROW_GRID,
                    "min-h-[104px] cursor-pointer px-3 py-3 transition hover:bg-white/[0.03] sm:px-4",
                    isSelected && "bg-blue-500/[0.06]"
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-start gap-2.5">
                      <OfficerAvatar
                        name={application.officerName}
                        photoUrl={application.profilePhotoUrl}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-fo-text">
                          {application.officerName}
                        </p>
                        {application.licenseNumbers.length > 0 ? (
                          <MetaLine icon={LicenseIcon}>
                            {application.licenseNumbers.join(", ")}
                          </MetaLine>
                        ) : null}
                        {application.phone ? (
                          <MetaLine icon={PhoneIcon}>{application.phone}</MetaLine>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fo-text">
                      {application.shiftTitle}
                    </p>
                    <MetaLine icon={LocationIcon}>{locationLine}</MetaLine>
                    <MetaLine icon={CalendarIcon}>
                      {`${schedule.dateLabel} · ${schedule.timeLabel}`}
                    </MetaLine>
                  </div>

                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs text-fo-text">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
                      <span className="truncate">{application.appliedDateLabel}</span>
                    </p>
                    <p className="mt-1 pl-5 text-[11px] text-fo-text-muted">
                      {application.appliedTimeLabel}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <ApplicantStatusBadge status={application.status} />
                  </div>

                  <div
                    className="flex justify-end"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <ApplicantRowActions
                      application={application}
                      onView={() => setReviewApplicationId(application.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      <div className="min-w-0 shrink-0 lg:w-[320px]">
        <ApplicantsShiftSummaryPanel
          applications={applications}
          selectedApplication={selectedApplication}
        />
      </div>

      <ApplicationReviewPanel
        application={reviewApplication}
        onClose={() => setReviewApplicationId(null)}
      />
    </div>
  );
}
