"use client";

import { useMemo, useState } from "react";
import {
  buildClientsCsv,
  formatAdminDate,
  type ClientAccountStatus,
  type SerializedAdminClient,
} from "@/lib/admin-clients";
import { Button, StatCard, StatusBadge } from "@/components/ui";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SearchIcon } from "@/components/nav/icons";
import { cn } from "@/lib/cn";
import { ClientDetailPanel } from "./client-detail-panel";

type ClientsControlCenterProps = {
  clients: SerializedAdminClient[];
};

type StatusFilter = "ALL" | ClientAccountStatus;

function statusBadgeVariant(status: ClientAccountStatus) {
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

function downloadCsv(clients: SerializedAdminClient[]) {
  const csv = buildClientsCsv(clients);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `flexofficers-clients-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ClientsControlCenter({ clients }: ClientsControlCenterProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const stateOptions = useMemo(() => {
    return [
      ...new Set(
        clients
          .map((client) => client.state)
          .filter((state): state is string => Boolean(state))
      ),
    ].sort();
  }, [clients]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !query ||
        client.displayName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        (client.companyName?.toLowerCase().includes(query) ?? false) ||
        (client.phone?.toLowerCase().includes(query) ?? false);

      const matchesStatus =
        statusFilter === "ALL" || client.accountStatus === statusFilter;

      const matchesState = stateFilter === "ALL" || client.state === stateFilter;

      return matchesSearch && matchesStatus && matchesState;
    });
  }, [clients, search, stateFilter, statusFilter]);

  const stats = useMemo(() => {
    return clients.reduce(
      (accumulator, client) => {
        accumulator.total += 1;

        switch (client.accountStatus) {
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
  }, [clients]);

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
            Clients
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fo-text-muted">
            Manage client accounts, security requests, and posting activity.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="md"
          className="shrink-0"
          onClick={() => downloadCsv(filteredClients)}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Clients" value={stats.total} tone="blue" />
        <StatCard label="Active" value={stats.active} tone="green" />
        <StatCard label="Pending" value={stats.pending} tone="amber" />
        <StatCard label="Inactive" value={stats.inactive} tone="purple" />
      </div>

      <div className="fo-glass-card space-y-3 rounded-xl border border-white/10 p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search clients</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fo-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clients by name, email, company, or phone"
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
          </div>
        </div>
      </div>

      <div className="fo-glass-card overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-wide text-fo-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Company
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Location
                </th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Requests
                </th>
                <th className="hidden px-4 py-3 font-semibold xl:table-cell">
                  Applications
                </th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-fo-text-muted"
                  >
                    No clients match your filters.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className={cn(
                      "border-b border-white/[0.04] transition hover:bg-white/[0.03]",
                      selectedClientId === client.id && "bg-white/[0.04]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          name={client.displayName}
                          src={client.profilePhotoUrl}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fo-text">
                            {client.displayName}
                          </p>
                          <p className="truncate text-xs text-fo-text-muted">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={statusBadgeVariant(client.accountStatus)}>
                        {client.accountStatus}
                      </StatusBadge>
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted md:table-cell">
                      {client.companyName ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted lg:table-cell">
                      {client.locationLabel}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted sm:table-cell">
                      {client.leadCount}
                      {client.paidLeadCount > 0 ? (
                        <span className="mt-0.5 block text-[11px] text-emerald-300">
                          {client.paidLeadCount} paid
                        </span>
                      ) : null}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted xl:table-cell">
                      {client.applicationCount}
                    </td>
                    <td className="hidden px-4 py-3 text-fo-text-muted sm:table-cell">
                      {formatAdminDate(client.joinedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        className="min-h-9 px-3 text-xs"
                        onClick={() => setSelectedClientId(client.id)}
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

      <ClientDetailPanel
        client={selectedClient}
        onClose={() => setSelectedClientId(null)}
      />
    </div>
  );
}
