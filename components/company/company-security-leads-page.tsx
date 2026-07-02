"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { IconShield } from "@/components/landing/icons";
import { BrowseListPagination } from "@/components/i18n/browse-list-pagination";
import { NotificationsIcon, SearchIcon } from "@/components/nav/icons";
import { buttonClassName, Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { useUnreadNotificationCount } from "@/components/dashboard/use-unread-notification-count";
import {
  COMPANY_LEADS_PAGE_SIZE,
  filterCompanySecurityLeadsByTab,
  formatCompanyLeadsPagination,
  getCompanyLeadDisplayStatusLabel,
  paginateCompanyLeads,
  searchCompanyLeads,
  type CompanyLeadDisplayStatus,
  type CompanyLeadsPageStats,
  type CompanyLeadsPageTab,
  type SerializedCompanySecurityLead,
} from "@/lib/company-leads-page";
import { cn } from "@/lib/cn";

type CompanySecurityLeadsPageProps = {
  leads: SerializedCompanySecurityLead[];
  stats: CompanyLeadsPageStats;
  initialTab?: CompanyLeadsPageTab;
};

const TAB_ORDER: CompanyLeadsPageTab[] = [
  "all",
  "active",
  "filled",
  "closed",
  "cancelled",
];

const STATUS_BADGE_STYLES: Record<CompanyLeadDisplayStatus, string> = {
  ACTIVE: "border-green-500/25 bg-green-500/10 text-green-200",
  FILLED: "border-orange-500/25 bg-orange-500/10 text-orange-200",
  CLOSED: "border-violet-500/25 bg-violet-500/10 text-violet-200",
  CANCELLED: "border-red-500/25 bg-red-500/10 text-red-200",
};

const SHIELD_TONE_STYLES: Record<CompanyLeadDisplayStatus, string> = {
  ACTIVE: "bg-blue-500/20 text-blue-300",
  FILLED: "bg-orange-500/20 text-orange-300",
  CLOSED: "bg-violet-500/20 text-violet-300",
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M6.5 3.5h4.2L15.5 8.3V16.5a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M10.5 3.5V8.5H15.5" />
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

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M4 6.5h4.5l1.5 1.5H16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z" />
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

function LeadStatusBadge({ status }: { status: CompanyLeadDisplayStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        STATUS_BADGE_STYLES[status]
      )}
    >
      {getCompanyLeadDisplayStatusLabel(status)}
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
  tone: "blue" | "green" | "orange" | "purple" | "red";
  icon: ReactNode;
}) {
  const toneClasses = {
    blue: "bg-blue-500/20 text-blue-300",
    green: "bg-emerald-500/20 text-emerald-300",
    orange: "bg-orange-500/20 text-orange-300",
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
  const copy = t.dashboard.companySecurityLeads;

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
        <Link
          href="/company/lead-applications"
          className={buttonClassName({ size: "md", className: "mt-6 inline-flex" })}
        >
          {copy.viewMyApplications}
        </Link>
      ) : null}
    </div>
  );
}

function MobileLeadCard({ lead }: { lead: SerializedCompanySecurityLead }) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.companySecurityLeads.table;

  return (
    <Link
      href={lead.href}
      className="fo-glass-card fo-glass-card-hover block rounded-2xl border border-white/10 p-4 transition"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            SHIELD_TONE_STYLES[lead.displayStatus]
          )}
        >
          <IconShield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-fo-text">{lead.title}</p>
            <LeadStatusBadge status={lead.displayStatus} />
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs text-fo-text-muted">
        <div className="flex items-center gap-1.5">
          <LocationIcon className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          <span>
            {lead.city}, {lead.state} · {lead.zipLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>
            {lead.dateLabel} · {lead.timeLabel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5">
            <PeopleIcon className="h-3.5 w-3.5" />
            {lead.officersNeeded} {copy.officersLabel}
          </span>
          <span>
            <span className="font-semibold text-fo-text">{lead.budgetOffer}</span>
            <span className="ml-1 text-[11px]">{copy.budgetTotal}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-xs font-semibold text-fo-primary-hover">{copy.viewDetails}</span>
        <span className="text-fo-primary-hover" aria-hidden="true">
          ›
        </span>
      </div>
    </Link>
  );
}

export function CompanySecurityLeadsPage({
  leads,
  stats,
  initialTab = "all",
}: CompanySecurityLeadsPageProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.companySecurityLeads;
  const nav = t.appNav;
  const unreadCount = useUnreadNotificationCount();
  const [activeTab, setActiveTab] = useState<CompanyLeadsPageTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const tabLabels: Record<CompanyLeadsPageTab, string> = {
    all: copy.tabs.all,
    active: copy.tabs.active,
    filled: copy.tabs.filled,
    closed: copy.tabs.closed,
    cancelled: copy.tabs.cancelled,
  };

  const tabCountByKey: Record<CompanyLeadsPageTab, number> = {
    all: stats.total,
    active: stats.active,
    filled: stats.filled,
    closed: stats.closed,
    cancelled: stats.cancelled,
  };

  const filteredLeads = useMemo(() => {
    const byTab = filterCompanySecurityLeadsByTab(leads, activeTab);
    return searchCompanyLeads(byTab, searchQuery);
  }, [activeTab, leads, searchQuery]);

  const pagination = useMemo(
    () => paginateCompanyLeads(filteredLeads, page, COMPANY_LEADS_PAGE_SIZE),
    [filteredLeads, page]
  );

  const paginationLabel = formatCompanyLeadsPagination(
    pagination.rangeStart,
    pagination.rangeEnd,
    pagination.totalItems
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  const hasAnyLeads = leads.length > 0;
  const showFilteredEmpty = hasAnyLeads && pagination.totalItems === 0;

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
            href="/company/lead-applications"
            className={buttonClassName({ size: "md", className: "min-h-10 whitespace-nowrap px-4" })}
          >
            {copy.myApplications}
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-1 lg:flex-row lg:items-end lg:justify-between">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-5">
              {TAB_ORDER.map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "border-b-2 pb-2.5 text-sm font-semibold transition",
                      isActive
                        ? "border-fo-primary-bright text-fo-primary-bright"
                        : "border-transparent text-fo-text-muted hover:text-fo-text"
                    )}
                  >
                    {tabLabels[tab]}{" "}
                    <span className={cn(isActive ? "text-fo-primary-bright/80" : "text-fo-text-muted")}>
                      ({tabCountByKey[tab]})
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
                onChange={(event) => setSearchQuery(event.target.value)}
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
          href="/company/lead-applications"
          className={buttonClassName({ size: "md", className: "w-full md:hidden" })}
        >
          {copy.myApplications}
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label={copy.stats.total}
          hint={copy.stats.totalHint}
          value={stats.total}
          tone="blue"
          icon={<DocumentIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.active}
          hint={copy.stats.activeHint}
          value={stats.active}
          tone="green"
          icon={<CheckIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.filled}
          hint={copy.stats.filledHint}
          value={stats.filled}
          tone="orange"
          icon={<PeopleIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.closed}
          hint={copy.stats.closedHint}
          value={stats.closed}
          tone="purple"
          icon={<FolderIcon className="h-5 w-5" />}
        />
        <StatCard
          label={copy.stats.cancelled}
          hint={copy.stats.cancelledHint}
          value={stats.cancelled}
          tone="red"
          icon={<XIcon className="h-5 w-5" />}
        />
      </div>

      <section className="fo-glass-card overflow-hidden rounded-2xl border border-white/10">
        <div className="space-y-3 p-3 md:hidden">
          {showFilteredEmpty || !hasAnyLeads ? (
            <EmptyState filtered={showFilteredEmpty} />
          ) : (
            pagination.items.map((lead) => <MobileLeadCard key={lead.id} lead={lead} />)
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wide text-fo-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">{copy.table.leadTitle}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.location}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.dateTime}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.officers}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.budget}</th>
                <th className="px-4 py-3 font-semibold">{copy.table.status}</th>
                <th className="px-4 py-3 font-semibold text-right">{copy.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {!hasAnyLeads || showFilteredEmpty ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState filtered={showFilteredEmpty} />
                  </td>
                </tr>
              ) : (
                pagination.items.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            SHIELD_TONE_STYLES[lead.displayStatus]
                          )}
                        >
                          <IconShield className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-fo-text">{lead.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-fo-text-muted">
                        <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                        <div>
                          <p className="text-fo-text">
                            {lead.city}, {lead.state}
                          </p>
                          <p className="mt-0.5 text-xs">{lead.zipLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-fo-text-muted">
                        <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <p className="text-fo-text">{lead.dateLabel}</p>
                          <p className="mt-0.5 text-xs">{lead.timeLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <PeopleIcon className="h-4 w-4 text-fo-text-muted" />
                        <div>
                          <p className="text-lg font-bold leading-none text-fo-text">
                            {lead.officersNeeded}
                          </p>
                          <p className="mt-1 text-[11px] text-fo-text-muted">
                            {copy.table.officersLabel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-lg font-bold text-fo-text">{lead.budgetOffer}</p>
                      <p className="mt-1 text-[11px] text-fo-text-muted">{copy.table.budgetTotal}</p>
                    </td>
                    <td className="px-4 py-4">
                      <LeadStatusBadge status={lead.displayStatus} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={lead.href}
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

        {hasAnyLeads ? (
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
            href="/company/lead-applications"
            className={buttonClassName({ size: "md", className: "shrink-0 self-start sm:self-center" })}
          >
            {copy.viewMyApplications}
          </Link>
        </div>
      </Card>
    </div>
  );
}
