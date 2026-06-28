"use client";

import { useMemo, useState } from "react";
import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import {
  buildCompaniesCsv,
  formatAdminDate,
  formatDaysRemaining,
  type SerializedAdminCompany,
} from "@/lib/admin-companies";
import { Button, StatCard, StatusBadge } from "@/components/ui";
import { SearchIcon } from "@/components/nav/icons";
import { cn } from "@/lib/cn";
import { CompanyDetailPanel } from "./company-detail-panel";

type CompaniesControlCenterProps = {
  companies: SerializedAdminCompany[];
};

type AccessFilter = "ALL" | CompanyAccessStatus;

function accessBadgeVariant(status: CompanyAccessStatus) {
  switch (status) {
    case CompanyAccessStatus.ACTIVE:
      return "success" as const;
    case CompanyAccessStatus.TRIAL:
      return "info" as const;
    case CompanyAccessStatus.EXPIRED:
    default:
      return "rejected" as const;
  }
}

function downloadCsv(companies: SerializedAdminCompany[]) {
  const csv = buildCompaniesCsv(companies);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `flexofficers-companies-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function CompaniesControlCenter({ companies }: CompaniesControlCenterProps) {
  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("ALL");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [planFilter, setPlanFilter] = useState("ALL");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        !query ||
        company.companyName.toLowerCase().includes(query) ||
        company.contactEmail.toLowerCase().includes(query) ||
        (company.contactName?.toLowerCase().includes(query) ?? false);

      const matchesAccess =
        accessFilter === "ALL" || company.effectiveStatus === accessFilter;

      const matchesPlan =
        planFilter === "ALL" || company.planLabel === planFilter;

      return matchesSearch && matchesAccess && matchesPlan;
    });
  }, [accessFilter, companies, planFilter, search]);

  const stats = useMemo(() => {
    return companies.reduce(
      (accumulator, company) => {
        accumulator.total += 1;

        switch (company.effectiveStatus) {
          case CompanyAccessStatus.ACTIVE:
            accumulator.active += 1;
            break;
          case CompanyAccessStatus.TRIAL:
            accumulator.onTrial += 1;
            break;
          case CompanyAccessStatus.EXPIRED:
            accumulator.expired += 1;
            break;
          default:
            break;
        }

        return accumulator;
      },
      { total: 0, active: 0, onTrial: 0, expired: 0 }
    );
  }, [companies]);

  const planOptions = useMemo(() => {
    return [...new Set(companies.map((company) => company.planLabel))].sort();
  }, [companies]);

  const selectedCompany =
    companies.find((company) => company.id === selectedCompanyId) ?? null;

  function handleCompanyUpdated() {
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
            Companies
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fo-text-muted">
            Manage company accounts, access status, and trial periods.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="md"
          className="shrink-0"
          onClick={() => downloadCsv(filteredCompanies)}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Companies" value={stats.total} tone="blue" />
        <StatCard label="Active" value={stats.active} tone="green" />
        <StatCard label="On Trial" value={stats.onTrial} tone="purple" />
        <StatCard label="Expired" value={stats.expired} tone="amber" />
      </div>

      <div className="fo-glass-card space-y-3 rounded-xl border border-white/10 p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search companies</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fo-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search companies"
              className="w-full rounded-lg border border-fo-border bg-fo-bg/80 py-2.5 pr-3 pl-10 text-sm text-fo-text outline-none transition focus:border-fo-primary-bright/50"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <select
              value={accessFilter}
              onChange={(event) =>
                setAccessFilter(event.target.value as AccessFilter)
              }
              className="min-h-10 rounded-lg border border-fo-border bg-fo-bg/80 px-3 text-sm text-fo-text"
              aria-label="Access status filter"
            >
              <option value="ALL">Access Status</option>
              <option value={CompanyAccessStatus.TRIAL}>Trial</option>
              <option value={CompanyAccessStatus.ACTIVE}>Active</option>
              <option value={CompanyAccessStatus.EXPIRED}>Expired</option>
            </select>

            <Button
              type="button"
              variant="secondary"
              size="md"
              className="min-h-10"
              onClick={() => setShowMoreFilters((current) => !current)}
            >
              More Filters
            </Button>
          </div>
        </div>

        {showMoreFilters ? (
          <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
            <select
              value={planFilter}
              onChange={(event) => setPlanFilter(event.target.value)}
              className="min-h-10 rounded-lg border border-fo-border bg-fo-bg/80 px-3 text-sm text-fo-text"
              aria-label="Plan filter"
            >
              <option value="ALL">All plans</option>
              {planOptions.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="fo-glass-card overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-wide text-fo-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Access Status</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Trial Ends
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Days Remaining
                </th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Plan
                </th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-fo-text-muted"
                  >
                    No companies match your filters.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className={cn(
                      "border-b border-white/[0.04] transition hover:bg-white/[0.03]",
                      selectedCompanyId === company.id && "bg-white/[0.04]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-bold text-fo-text-muted">
                          {company.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={company.logoUrl}
                              alt=""
                              className="h-full w-full rounded-lg object-cover"
                            />
                          ) : (
                            company.companyName.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fo-text">
                            {company.companyName}
                          </p>
                          <p className="truncate text-xs text-fo-text-muted">
                            {company.contactEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={accessBadgeVariant(company.effectiveStatus)}>
                        {company.effectiveStatus}
                      </StatusBadge>
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted md:table-cell">
                      {formatAdminDate(company.trialEndsAt)}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted lg:table-cell">
                      {formatDaysRemaining(company.daysRemaining)}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted sm:table-cell">
                      {company.planLabel}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        className="min-h-9 px-3 text-xs"
                        onClick={() => setSelectedCompanyId(company.id)}
                      >
                        Actions
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CompanyDetailPanel
        company={selectedCompany}
        onClose={() => setSelectedCompanyId(null)}
        onUpdated={handleCompanyUpdated}
      />
    </div>
  );
}
