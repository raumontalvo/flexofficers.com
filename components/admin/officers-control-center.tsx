"use client";

import { useMemo, useState } from "react";
import {
  buildOfficersCsv,
  formatAdminDate,
  formatDaysRemaining,
  type OfficerAccountStatus,
  type SerializedAdminOfficer,
} from "@/lib/admin-officers";
import { Button, StatCard, StatusBadge } from "@/components/ui";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SearchIcon } from "@/components/nav/icons";
import { cn } from "@/lib/cn";
import { OfficerDetailPanel } from "./officer-detail-panel";

type OfficersControlCenterProps = {
  officers: SerializedAdminOfficer[];
};

type StatusFilter = "ALL" | OfficerAccountStatus;

function statusBadgeVariant(status: OfficerAccountStatus) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "PENDING":
      return "pending" as const;
    case "INACTIVE":
    default:
      return "rejected" as const;
  }
}

function downloadCsv(officers: SerializedAdminOfficer[]) {
  const csv = buildOfficersCsv(officers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `flexofficers-officers-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function OfficersControlCenter({ officers }: OfficersControlCenterProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [licenseTypeFilter, setLicenseTypeFilter] = useState("ALL");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [expiredOnly, setExpiredOnly] = useState(false);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null);

  const licenseTypeOptions = useMemo(() => {
    return [
      ...new Set(
        officers.flatMap((officer) =>
          officer.licenses.map((license) => license.licenseType)
        )
      ),
    ].sort();
  }, [officers]);

  const stateOptions = useMemo(() => {
    return [
      ...new Set(
        officers
          .map((officer) => officer.state)
          .filter((state): state is string => Boolean(state))
      ),
    ].sort();
  }, [officers]);

  const filteredOfficers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return officers.filter((officer) => {
      const matchesSearch =
        !query ||
        officer.fullName.toLowerCase().includes(query) ||
        officer.email.toLowerCase().includes(query) ||
        officer.licenses.some((license) =>
          license.licenseNumber.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "ALL" || officer.accountStatus === statusFilter;

      const matchesLicenseType =
        licenseTypeFilter === "ALL" ||
        officer.licenses.some(
          (license) => license.licenseType === licenseTypeFilter
        );

      const matchesState =
        stateFilter === "ALL" || officer.state === stateFilter;

      const matchesExpired =
        !expiredOnly || officer.nearestExpirationExpired;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLicenseType &&
        matchesState &&
        matchesExpired
      );
    });
  }, [
    expiredOnly,
    licenseTypeFilter,
    officers,
    search,
    stateFilter,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    return officers.reduce(
      (accumulator, officer) => {
        accumulator.total += 1;

        switch (officer.accountStatus) {
          case "ACTIVE":
            accumulator.active += 1;
            break;
          case "PENDING":
            accumulator.pending += 1;
            break;
          case "INACTIVE":
            accumulator.inactive += 1;
            break;
          default:
            break;
        }

        return accumulator;
      },
      { total: 0, active: 0, pending: 0, inactive: 0 }
    );
  }, [officers]);

  const selectedOfficer =
    officers.find((officer) => officer.id === selectedOfficerId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
            Officers
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fo-text-muted">
            Manage officer accounts, licenses, and approval status.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="md"
          className="shrink-0"
          onClick={() => downloadCsv(filteredOfficers)}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Officers" value={stats.total} tone="blue" />
        <StatCard label="Active" value={stats.active} tone="green" />
        <StatCard label="Pending" value={stats.pending} tone="amber" />
        <StatCard label="Inactive" value={stats.inactive} tone="purple" />
      </div>

      <div className="fo-glass-card space-y-3 rounded-xl border border-white/10 p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search officers</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fo-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search officers by name, email, or license number"
              className="w-full rounded-lg border border-fo-border bg-fo-bg/80 py-2.5 pr-3 pl-10 text-sm text-fo-text outline-none transition focus:border-fo-primary-bright/50"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="min-h-10 rounded-lg border border-fo-border bg-fo-bg/80 px-3 text-sm text-fo-text"
              aria-label="Status filter"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select
              value={licenseTypeFilter}
              onChange={(event) => setLicenseTypeFilter(event.target.value)}
              className="min-h-10 rounded-lg border border-fo-border bg-fo-bg/80 px-3 text-sm text-fo-text"
              aria-label="License type filter"
            >
              <option value="ALL">All License Types</option>
              {licenseTypeOptions.map((licenseType) => (
                <option key={licenseType} value={licenseType}>
                  {licenseType}
                </option>
              ))}
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
          <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-3">
            <select
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value)}
              className="min-h-10 rounded-lg border border-fo-border bg-fo-bg/80 px-3 text-sm text-fo-text"
              aria-label="State filter"
            >
              <option value="ALL">All states</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-sm text-fo-text-muted">
              <input
                type="checkbox"
                checked={expiredOnly}
                onChange={(event) => setExpiredOnly(event.target.checked)}
                className="rounded border-fo-border"
              />
              Expired licenses only
            </label>
          </div>
        ) : null}
      </div>

      <div className="fo-glass-card overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-wide text-fo-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Officer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  License(s)
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  License Expires
                </th>
                <th className="hidden px-4 py-3 font-semibold xl:table-cell">
                  Company
                </th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-fo-text-muted"
                  >
                    No officers match your filters.
                  </td>
                </tr>
              ) : (
                filteredOfficers.map((officer) => (
                  <tr
                    key={officer.id}
                    className={cn(
                      "border-b border-white/[0.04] transition hover:bg-white/[0.03]",
                      selectedOfficerId === officer.id && "bg-white/[0.04]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          name={officer.fullName}
                          src={officer.profilePhotoUrl}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fo-text">
                            {officer.fullName}
                          </p>
                          <p className="truncate text-xs text-fo-text-muted">
                            {officer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={statusBadgeVariant(officer.accountStatus)}>
                        {officer.accountStatus}
                      </StatusBadge>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {officer.licenseLabels.length > 0 ? (
                          officer.licenseLabels.map((label) => (
                            <span
                              key={label}
                              className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-200"
                            >
                              {label}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-fo-text-muted">—</span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-fo-text-muted">
                        {officer.licenseCount}{" "}
                        {officer.licenseCount === 1 ? "license" : "licenses"}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <p className="text-fo-text">
                        {formatAdminDate(officer.nearestExpirationDate)}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-xs",
                          officer.nearestExpirationExpired
                            ? "font-semibold text-red-300"
                            : "text-fo-text-muted"
                        )}
                      >
                        {formatDaysRemaining(
                          officer.nearestExpirationDaysRemaining,
                          officer.nearestExpirationExpired
                        )}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted xl:table-cell">
                      {officer.lastAcceptedCompany ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted sm:table-cell">
                      {formatAdminDate(officer.joinedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        className="min-h-9 px-3 text-xs"
                        onClick={() => setSelectedOfficerId(officer.id)}
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

      <OfficerDetailPanel
        officer={selectedOfficer}
        onClose={() => setSelectedOfficerId(null)}
      />
    </div>
  );
}
