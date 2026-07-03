"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { IconClipboard, IconShield } from "@/components/landing/icons";
import { BrowseListPagination } from "@/components/i18n/browse-list-pagination";
import { NotificationsIcon, SearchIcon, UpcomingIcon } from "@/components/nav/icons";
import { buttonClassName, Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { useUnreadNotificationCount } from "@/components/dashboard/use-unread-notification-count";
import {
  getClientLeadDisplayStatusLabel,
  type ClientLeadDisplayStatus,
} from "@/lib/client-dashboard-data";
import {
  CLIENT_LEADS_PAGE_SIZE,
  filterClientSecurityRequestsByTab,
  formatClientLeadsPagination,
  paginateClientLeads,
  searchClientLeads,
  type ClientLeadsPageStats,
  type ClientLeadsPageTab,
  type SerializedClientSecurityRequest,
} from "@/lib/client-leads-page";
import { cn } from "@/lib/cn";

type ClientSecurityRequestsPageProps = {
  requests: SerializedClientSecurityRequest[];
  stats: ClientLeadsPageStats;
  initialTab?: ClientLeadsPageTab;
};

const TAB_ORDER: ClientLeadsPageTab[] = [
  "all",
  "active",
  "pending",
  "completed",
  "cancelled",
];

const STATUS_BADGE_STYLES: Record<ClientLeadDisplayStatus, string> = {
  ACTIVE: "border-green-500/25 bg-green-500/10 text-green-200",
  PENDING: "border-amber-500/25 bg-amber-500/10 text-amber-200",
  COMPLETED: "border-white/15 bg-white/[0.05] text-fo-text-muted",
  CANCELLED: "border-red-500/25 bg-red-500/10 text-red-200",
};

const SHIELD_TONE_STYLES: Record<ClientLeadDisplayStatus, string> = {
  ACTIVE: "bg-blue-500/20 text-blue-300",
  PENDING: "bg-amber-500/20 text-amber-300",
  COMPLETED: "bg-slate-500/20 text-slate-300",
  CANCELLED: "bg-red-500/20 text-red-300",
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

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="7.5" cy="7" r="2.25" />
      <path d="M3.5 16c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
      <circle cx="13.5" cy="8" r="1.75" />
      <path d="M12 16c.3-1.6 1.5-2.5 3-2.5" />
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

function RequestStatusBadge({ status }: { status: ClientLeadDisplayStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        STATUS_BADGE_STYLES[status]
      )}
    >
      {getClientLeadDisplayStatusLabel(status)}
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
  value: number | string;
  tone: "blue" | "green" | "amber" | "purple" | "red";
  icon: ReactNode;
}) {
  const toneClasses = {
    blue: "bg-blue-500/20 text-blue-300",
    green: "bg-emerald-500/20 text-emerald-300",
    amber: "bg-amber-500/20 text-amber-300",
    purple: "bg-violet-500/20 text-violet-300",
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
  const copy = t.dashboard.clientSecurityRequests;

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
        <Link href="/client/leads/new" className={buttonClassName({ size: "md", className: "mt-6 inline-flex" })}>
          {copy.createLead}
        </Link>
      ) : null}
    </div>
  );
}

function MobileRequestCard({ request }: { request: SerializedClientSecurityRequest }) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.clientSecurityRequests.table;

  return (
    <Link
      href={request.href}
      className="fo-glass-card fo-glass-card-hover block rounded-2xl border border-white/10 p-4 transition"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            SHIELD_TONE_STYLES[request.displayStatus]
          )}
        >
          <IconShield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <p className="min-w-0 break-words font-semibold text-fo-text">{request.title}</p>
            <RequestStatusBadge status={request.displayStatus} />
          </div>
          <p className="mt-0.5 text-xs text-fo-text-muted">{request.subtitle}</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-fo-primary-hover">
            {request.requestId}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs text-fo-text-muted">
        <div className="flex items-center gap-1.5">
          <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400/90" />
          <span>
            {request.city}, {request.state} · {request.zipLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>
            {request.dateLabel} · {request.timeLabel}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3 sm:gap-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 break-words">
            <PeopleIcon className="h-3.5 w-3.5 shrink-0" />
            {request.officersNeeded} {copy.officersLabel}
          </span>
          <span className="min-w-0 break-words font-semibold text-fo-text">
            {request.budgetOffer}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 break-words">
            <PeopleIcon className="h-3.5 w-3.5 shrink-0" />
            {request.applicantCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ClientSecurityRequestsPage({
  requests,
  stats,
  initialTab = "all",
}: ClientSecurityRequestsPageProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.clientSecurityRequests;
  const nav = t.appNav;
  const unreadCount = useUnreadNotificationCount();
  const [activeTab, setActiveTab] = useState<ClientLeadsPageTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const tabLabels: Record<ClientLeadsPageTab, string> = {
    all: copy.tabs.all,
    active: copy.tabs.active,
    pending: copy.tabs.pending,
    completed: copy.tabs.completed,
    cancelled: copy.tabs.cancelled,
  };

  const filteredRequests = useMemo(() => {
    const byTab = filterClientSecurityRequestsByTab(requests, activeTab);
    return searchClientLeads(byTab, searchQuery);
  }, [activeTab, requests, searchQuery]);

  const pagination = useMemo(
    () => paginateClientLeads(filteredRequests, page, CLIENT_LEADS_PAGE_SIZE),
    [filteredRequests, page]
  );

  const paginationLabel = formatClientLeadsPagination(
    pagination.rangeStart,
    pagination.rangeEnd,
    pagination.totalItems
  );

  function handleTabChange(tab: ClientLeadsPageTab) {
    setActiveTab(tab);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  const hasAnyRequests = requests.length > 0;
  const showFilteredEmpty = hasAnyRequests && pagination.totalItems === 0;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-fo-text-muted">{copy.subtitle}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            href="/client/applicants"
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
            href="/client/leads/new"
            className={buttonClassName({ size: "md", className: "min-h-10 whitespace-nowrap px-4" })}
          >
            {copy.createLead}
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="fo-scrollbar-hide overflow-x-auto">
            <div className="flex min-w-max gap-3 sm:gap-5">
              {TAB_ORDER.map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      "border-b-2 pb-2.5 text-sm font-semibold transition",
                      isActive
                        ? "border-fo-primary-bright text-fo-text"
                        : "border-transparent text-fo-text-muted hover:text-fo-text"
                    )}
                  >
                    {tabLabels[tab]}
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
              {copy.filter}
            </button>
          </div>
        </div>

        <Link
          href="/client/leads/new"
          className={buttonClassName({ size: "md", className: "w-full md:hidden" })}
        >
          {copy.createLead}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label={copy.stats.total}
          hint={copy.stats.totalHint}
          value={stats.total}
          tone="blue"
          icon={<IconClipboard className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.active}
          hint={copy.stats.activeHint}
          value={stats.active}
          tone="green"
          icon={<UpcomingIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.pending}
          hint={copy.stats.pendingHint}
          value={stats.pending}
          tone="amber"
          icon={<IconClipboard className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.completed}
          hint={copy.stats.completedHint}
          value={stats.completed}
          tone="purple"
          icon={<IconShield className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.cancelled}
          hint={copy.stats.cancelledHint}
          value={stats.cancelled}
          tone="red"
          icon={<IconShield className="h-5 w-5" />}
        />
      </div>

      <section className="fo-glass-card overflow-hidden rounded-2xl border border-white/10">
        <div className="space-y-3 p-3 md:hidden">
          {showFilteredEmpty || !hasAnyRequests ? (
            <EmptyState filtered={showFilteredEmpty} />
          ) : (
            pagination.items.map((request) => (
              <MobileRequestCard key={request.id} request={request} />
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wide text-fo-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">{copy.table.request}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.location}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.dateTime}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.officers}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.budget}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.status}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.applicants}</th>
                <th className="px-4 py-3 font-semibold text-right">{copy.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {!hasAnyRequests || showFilteredEmpty ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState filtered={showFilteredEmpty} />
                  </td>
                </tr>
              ) : (
                pagination.items.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            SHIELD_TONE_STYLES[request.displayStatus]
                          )}
                        >
                          <IconShield className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-fo-text">{request.title}</p>
                          <p className="mt-0.5 text-xs text-fo-text-muted">{request.subtitle}</p>
                          <p className="mt-1 inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fo-primary-hover">
                            {request.requestId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-fo-text-muted">
                        <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400/90" />
                        <div>
                          <p className="text-fo-text">
                            {request.city}, {request.state}
                          </p>
                          <p className="mt-0.5 text-xs">{request.zipLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-fo-text-muted">
                        <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-fo-text">{request.dateLabel}</p>
                          <p className="mt-0.5 text-xs">{request.timeLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <PeopleIcon className="h-4 w-4 text-fo-text-muted" />
                        <div>
                          <p className="text-lg font-bold leading-none text-fo-text">
                            {request.officersNeeded}
                          </p>
                          <p className="mt-1 text-[11px] text-fo-text-muted">
                            {copy.table.officersLabel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-lg font-bold text-fo-text">{request.budgetOffer}</p>
                      <p className="mt-1 text-[11px] text-fo-text-muted">{copy.table.budgetTotal}</p>
                    </td>
                    <td className="px-4 py-4">
                      <RequestStatusBadge status={request.displayStatus} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-1.5 text-fo-text-muted">
                        <PeopleIcon className="h-4 w-4" />
                        <span className="font-semibold text-fo-text">{request.applicantCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={request.href}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-fo-primary-bright/35 bg-transparent px-3 text-xs font-semibold text-fo-primary-hover transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
                      >
                        {copy.table.view}
                        <span aria-hidden="true">›</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasAnyRequests ? (
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
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)]">
              <IconShield className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-base font-bold text-fo-text sm:text-lg">
                {copy.ctaTitle}
              </h2>
              <p className="mt-1.5 break-words text-sm leading-relaxed text-fo-text-muted">
                {copy.ctaDescription}
              </p>
            </div>
          </div>
          <Link
            href="/client/leads/new"
            className={buttonClassName({
              size: "md",
              className: "w-full sm:w-auto sm:self-start",
            })}
          >
            {copy.createLead}
          </Link>
        </div>
      </Card>
    </div>
  );
}
