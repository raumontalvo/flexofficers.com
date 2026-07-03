"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { IconShield } from "@/components/landing/icons";
import { BrowseListPagination } from "@/components/i18n/browse-list-pagination";
import { ApplicantsIcon, NotificationsIcon, SearchIcon } from "@/components/nav/icons";
import { buttonClassName, Card, ProfileAvatar } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { useUnreadNotificationCount } from "@/components/dashboard/use-unread-notification-count";
import {
  COMPANY_APPLICATIONS_PAGE_SIZE,
  filterCompanyApplicationsByTab,
  formatCompanyApplicationsPagination,
  getCompanyApplicationDisplayStatusLabel,
  getCompanyApplicationTabCounts,
  paginateCompanyApplications,
  searchCompanyApplications,
  type CompanyApplicationDisplayStatus,
  type CompanyApplicationPageTab,
  type CompanyApplicationsPageStats,
  type SerializedCompanyLeadApplication,
} from "@/lib/company-lead-applications-page";
import { cn } from "@/lib/cn";

type CompanyLeadApplicationsPageProps = {
  applications: SerializedCompanyLeadApplication[];
  stats: CompanyApplicationsPageStats;
};

const TAB_ORDER: CompanyApplicationPageTab[] = [
  "all",
  "pending",
  "hired",
  "notSelected",
  "withdrawn",
];

const STATUS_BADGE_STYLES: Record<CompanyApplicationDisplayStatus, string> = {
  PENDING_REVIEW: "border-amber-500/25 bg-amber-500/10 text-amber-200",
  HIRED: "border-green-500/25 bg-green-500/10 text-green-200",
  NOT_SELECTED: "border-red-500/25 bg-red-500/10 text-red-200",
  WITHDRAWN: "border-violet-500/25 bg-violet-500/10 text-violet-200",
};

const SHIELD_TONE_STYLES: Record<CompanyApplicationDisplayStatus, string> = {
  PENDING_REVIEW: "bg-amber-500/20 text-amber-300",
  HIRED: "bg-emerald-500/20 text-emerald-300",
  NOT_SELECTED: "bg-red-500/20 text-red-300",
  WITHDRAWN: "bg-violet-500/20 text-violet-300",
};

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M10 17s5-4.5 5-8.5a5 5 0 1 0-10 0C5 12.5 10 17 10 17Z" />
      <circle cx="10" cy="8.5" r="1.75" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" />
      <path d="M6.5 3.5v2M13.5 3.5v2M3.5 8.5h13" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 6.5V10l2.5 1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M5.5 10.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M3.5 5h13M5.5 10h9M8.5 15h3" strokeLinecap="round" />
    </svg>
  );
}

function ApplicationStatusBadge({ status }: { status: CompanyApplicationDisplayStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        STATUS_BADGE_STYLES[status]
      )}
    >
      {getCompanyApplicationDisplayStatusLabel(status)}
    </span>
  );
}

function StatCard({
  label,
  hint,
  value,
  tone,
  icon,
}: {
  label: string;
  hint: string;
  value: number;
  tone: "blue" | "green" | "amber" | "red";
  icon: ReactNode;
}) {
  const toneClasses = {
    blue: "bg-blue-500/20 text-blue-300",
    green: "bg-emerald-500/20 text-emerald-300",
    amber: "bg-amber-500/20 text-amber-300",
    red: "bg-red-500/20 text-red-300",
  };

  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card fo-glass-card-hover border border-white/10 p-4"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            toneClasses[tone]
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none text-fo-text">{value}</p>
          <p className="mt-2 text-sm font-semibold text-fo-text">{label}</p>
          <p className="mt-0.5 text-xs text-fo-text-muted">{hint}</p>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.companyLeadApplications;

  return (
    <div className="px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
        <IconShield className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-fo-text">
        {filtered ? copy.emptyFiltered : copy.emptyTitle}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fo-text-muted">
        {filtered ? copy.emptyFiltered : copy.emptyDescription}
      </p>
      {!filtered ? (
        <Link href="/company/leads" className={buttonClassName({ size: "md", className: "mt-6 inline-flex" })}>
          {copy.browseLeads}
        </Link>
      ) : null}
    </div>
  );
}

function MobileApplicationCard({ application }: { application: SerializedCompanyLeadApplication }) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.companyLeadApplications.table;

  return (
    <Link
      href={application.detailHref}
      className="fo-glass-card fo-glass-card-hover block rounded-2xl border border-white/10 p-4 transition"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            SHIELD_TONE_STYLES[application.displayStatus]
          )}
        >
          <IconShield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-fo-text">{application.leadTitle}</p>
            <ApplicationStatusBadge status={application.displayStatus} />
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-fo-text-muted">
            <LocationIcon className="h-3.5 w-3.5 text-blue-400" />
            {application.leadLocation}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-fo-text-muted">
            <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
            {application.leadDateLabel} | {application.leadTimeLabel}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-white/[0.06] pt-3">
        <ProfileAvatar name={application.clientName} src={application.clientPhotoUrl} size="sm" />
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-fo-text">{application.clientName}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-fo-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5" />
          {application.appliedDateLabel} · {application.appliedTimeLabel}
        </span>
        <span>
          <span className="font-semibold text-fo-text">{application.offerLabel}</span>
          <span className="ml-1 text-[11px]">{copy.offerTotal}</span>
        </span>
        <span className="font-semibold text-fo-primary-hover">{copy.viewDetails} ›</span>
      </div>
    </Link>
  );
}

export function CompanyLeadApplicationsPage({
  applications,
  stats,
}: CompanyLeadApplicationsPageProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.companyLeadApplications;
  const nav = t.appNav;
  const unreadCount = useUnreadNotificationCount();
  const [activeTab, setActiveTab] = useState<CompanyApplicationPageTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const tabLabels: Record<CompanyApplicationPageTab, string> = {
    all: copy.tabs.all,
    pending: copy.tabs.pending,
    hired: copy.tabs.hired,
    notSelected: copy.tabs.notSelected,
    withdrawn: copy.tabs.withdrawn,
  };

  const tabCounts = useMemo(() => getCompanyApplicationTabCounts(applications), [applications]);

  const filteredApplications = useMemo(() => {
    const byTab = filterCompanyApplicationsByTab(applications, activeTab);
    return searchCompanyApplications(byTab, searchQuery);
  }, [activeTab, applications, searchQuery]);

  const pagination = useMemo(
    () => paginateCompanyApplications(filteredApplications, page, COMPANY_APPLICATIONS_PAGE_SIZE),
    [filteredApplications, page]
  );

  const paginationLabel = formatCompanyApplicationsPagination(
    pagination.rangeStart,
    pagination.rangeEnd,
    pagination.totalItems
  );

  function handleTabChange(tab: CompanyApplicationPageTab) {
    setActiveTab(tab);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  const hasAnyApplications = applications.length > 0;
  const showFilteredEmpty = hasAnyApplications && pagination.totalItems === 0;

  const tabCountByKey: Record<CompanyApplicationPageTab, number> = {
    all: tabCounts.all,
    pending: tabCounts.pending,
    hired: tabCounts.hired,
    notSelected: tabCounts.notSelected,
    withdrawn: tabCounts.withdrawn,
  };

  return (
    <div className="space-y-5 pb-3 lg:pb-0">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-fo-text-muted">{copy.subtitle}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            href="/company/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
            aria-label={nav.aria.notifications}
          >
            <NotificationsIcon className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/company/leads"
            className={buttonClassName({ size: "md", className: "min-h-10 whitespace-nowrap px-4" })}
          >
            {copy.browseLeads}
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-4">
              {TAB_ORDER.map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      "flex items-center gap-2 border-b-2 pb-2.5 text-sm font-semibold transition",
                      isActive
                        ? "border-fo-primary-bright text-fo-primary-bright"
                        : "border-transparent text-fo-text-muted hover:text-fo-text"
                    )}
                  >
                    <span>{tabLabels[tab]}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold",
                        isActive
                          ? "bg-blue-500/20 text-blue-200"
                          : "bg-white/[0.06] text-fo-text-muted"
                      )}
                    >
                      {tabCountByKey[tab]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1 sm:min-w-[220px] lg:min-w-[260px]">
              <span className="sr-only">{copy.searchPlaceholder}</span>
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fo-text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="min-h-10 w-full rounded-xl border border-fo-border bg-fo-bg/80 py-2 pr-3 pl-10 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20"
              />
            </label>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#070f1c]/60 px-4 text-sm font-semibold text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-text"
            >
              <FilterIcon className="h-4 w-4" />
              {copy.filters}
            </button>
          </div>
        </div>

        <Link
          href="/company/leads"
          className={buttonClassName({ size: "md", className: "w-full md:hidden" })}
        >
          {copy.browseLeads}
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={copy.stats.total}
          hint={copy.stats.totalHint}
          value={stats.total}
          tone="blue"
          icon={<ApplicantsIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.pending}
          hint={copy.stats.pendingHint}
          value={stats.pending}
          tone="amber"
          icon={<ClockIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.hired}
          hint={copy.stats.hiredHint}
          value={stats.hired}
          tone="green"
          icon={<CheckIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.notSelected}
          hint={copy.stats.notSelectedHint}
          value={stats.notSelected}
          tone="red"
          icon={<XIcon className="h-5 w-5" />}
        />
      </div>

      <section className="fo-glass-card overflow-hidden rounded-2xl border border-white/10">
        <div className="space-y-3 p-3 md:hidden">
          {showFilteredEmpty || !hasAnyApplications ? (
            <EmptyState filtered={showFilteredEmpty} />
          ) : (
            pagination.items.map((application) => (
              <MobileApplicationCard key={application.id} application={application} />
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wide text-fo-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">{copy.table.leadRequest}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.client}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.appliedOn}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.status}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.offer}</th>
                <th className="px-4 py-3 font-semibold text-right">{copy.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {!hasAnyApplications || showFilteredEmpty ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState filtered={showFilteredEmpty} />
                  </td>
                </tr>
              ) : (
                pagination.items.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            SHIELD_TONE_STYLES[application.displayStatus]
                          )}
                        >
                          <IconShield className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-fo-text">{application.leadTitle}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-fo-text-muted">
                            <LocationIcon className="h-3.5 w-3.5 text-blue-400" />
                            {application.leadLocation}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-fo-text-muted">
                            <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                            {application.leadDateLabel} | {application.leadTimeLabel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          name={application.clientName}
                          src={application.clientPhotoUrl}
                          size="md"
                        />
                        <p className="font-semibold text-fo-text">{application.clientName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-fo-text-muted">
                        <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-fo-text">{application.appliedDateLabel}</p>
                          <p className="mt-0.5 text-xs">{application.appliedTimeLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <ApplicationStatusBadge status={application.displayStatus} />
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-lg font-bold text-fo-text">{application.offerLabel}</p>
                      <p className="mt-1 text-[11px] text-fo-text-muted">{copy.table.offerTotal}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={application.detailHref}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-fo-primary-bright/35 bg-transparent px-3 text-xs font-semibold text-fo-primary-hover transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
                      >
                        {copy.table.viewDetails}
                        <span aria-hidden="true">›</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasAnyApplications ? (
          <div className="border-t border-white/[0.06] px-4 py-3">
            <BrowseListPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              label={paginationLabel}
              onPageChange={setPage}
              className="border-0 bg-transparent px-0 py-0 shadow-none"
            />
          </div>
        ) : null}
      </section>

      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card fo-glass-card-hover border border-white/10 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)]">
              <IconShield className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-fo-text sm:text-lg">{copy.ctaTitle}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-fo-text-muted">
                {copy.ctaDescription}
              </p>
            </div>
          </div>
          <Link
            href="/company/leads"
            className={buttonClassName({ size: "md", className: "shrink-0 self-start sm:self-center" })}
          >
            {copy.browseLeads}
          </Link>
        </div>
      </Card>
    </div>
  );
}
