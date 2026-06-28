"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { ShiftRowActions } from "@/components/company/shift-row-actions";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  COMPANY_SHIFTS_PAGE_SIZE,
  filterCompanyShiftsByTab,
  formatShiftDurationLabel,
  formatShiftTableDate,
  getCompanyShiftsTabCounts,
  getFillProgressVariant,
  paginateCompanyShifts,
  searchCompanyShifts,
  type CompanyShiftsPageTab,
  type SerializedCompanyShiftRow,
} from "@/lib/company-shifts-page";
import { formatHourlyRate, formatShiftTime } from "@/lib/format-shift";

const TABS: { id: CompanyShiftsPageTab; label: string }[] = [
  { id: "all", label: "All Shifts" },
  { id: "open", label: "Open" },
  { id: "filled", label: "Filled" },
  { id: "cancelled", label: "Cancelled" },
];

type MyShiftsTableProps = {
  shifts: SerializedCompanyShiftRow[];
  canPostShifts: boolean;
};

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

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7.5" cy="7" r="2.25" />
      <path d="M3.5 16c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
      <circle cx="13.5" cy="8" r="1.75" />
      <path d="M12 16c.3-1.6 1.5-2.5 3-2.5" />
    </svg>
  );
}

function MyShiftStatusBadge({ status }: { status: ShiftStatus }) {
  const styles = {
    [ShiftStatus.OPEN]:
      "border-green-500/25 bg-green-500/10 text-green-200",
    [ShiftStatus.FILLED]:
      "border-blue-500/25 bg-blue-500/10 text-blue-100",
    [ShiftStatus.CANCELLED]:
      "border-red-500/20 bg-white/[0.04] text-fo-text-muted",
    [ShiftStatus.COMPLETED]:
      "border-blue-500/20 bg-white/[0.04] text-fo-text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        styles[status] ?? styles[ShiftStatus.COMPLETED]
      )}
    >
      {status}
    </span>
  );
}

function FillProgressBar({
  filledCount,
  positionsNeeded,
}: {
  filledCount: number;
  positionsNeeded: number;
}) {
  const variant = getFillProgressVariant(filledCount, positionsNeeded);
  const progress =
    positionsNeeded > 0
      ? Math.min(100, (filledCount / positionsNeeded) * 100)
      : 0;

  return (
    <div className="mt-1.5 h-1.5 w-full max-w-[72px] overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          variant === "empty" && "bg-white/10",
          variant === "partial" && "bg-green-500",
          variant === "full" && "bg-blue-500"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function EmptyShiftsState({ canPostShifts }: { canPostShifts: boolean }) {
  return (
    <div className="px-4 py-16 text-center">
      <h3 className="text-lg font-semibold text-fo-text">No shifts posted yet.</h3>
      <p className="mt-2 text-sm text-fo-text-muted">
        Post your first shift to start receiving officer applications.
      </p>
      <Link
        href={canPostShifts ? "/shifts/create" : "/company/billing"}
        className={buttonClassName({
          size: "md",
          className: "mt-6 inline-flex",
        })}
      >
        Post a Shift
      </Link>
    </div>
  );
}

export function MyShiftsTable({ shifts, canPostShifts }: MyShiftsTableProps) {
  const [activeTab, setActiveTab] = useState<CompanyShiftsPageTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const tabCounts = useMemo(() => getCompanyShiftsTabCounts(shifts), [shifts]);

  const filteredShifts = useMemo(() => {
    const byTab = filterCompanyShiftsByTab(shifts, activeTab);
    return searchCompanyShifts(byTab, searchQuery);
  }, [activeTab, searchQuery, shifts]);

  const pagination = useMemo(
    () => paginateCompanyShifts(filteredShifts, page, COMPANY_SHIFTS_PAGE_SIZE),
    [filteredShifts, page]
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  if (shifts.length === 0) {
    return (
      <section className="fo-glass-card mt-6 rounded-xl border border-white/10">
        <EmptyShiftsState canPostShifts={canPostShifts} />
      </section>
    );
  }

  return (
    <section className="fo-glass-card mt-6 overflow-hidden rounded-xl border border-white/10">
      <div className="flex flex-col gap-4 border-b border-white/[0.06] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const count = tabCounts[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
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

        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search shifts</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search shifts..."
            className="min-h-10 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wide text-fo-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Shift / Location</th>
              <th className="px-4 py-3 font-semibold">Date &amp; Time</th>
              <th className="px-4 py-3 font-semibold">Pay</th>
              <th className="px-4 py-3 font-semibold">Filled</th>
              <th className="px-4 py-3 font-semibold">Applicants</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-fo-text-muted"
                >
                  No shifts match this filter.
                </td>
              </tr>
            ) : (
              pagination.items.map((shift) => {
                const startTime = new Date(shift.startTime);
                const endTime = new Date(shift.endTime);
                const duration = formatShiftDurationLabel(startTime, endTime);

                return (
                  <tr
                    key={shift.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4 align-middle">
                      <MyShiftStatusBadge status={shift.status} />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <p className="font-semibold text-fo-text">{shift.title}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-fo-text-muted">
                        <LocationIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle" />
                        <span className="truncate">
                          {shift.locationSubtext
                            ? `${shift.locationLabel} · ${shift.locationSubtext}`
                            : shift.locationLabel}
                        </span>
                      </p>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <p className="text-fo-text">{formatShiftTableDate(startTime)}</p>
                      <p className="mt-0.5 text-xs text-fo-text-muted">
                        {formatShiftTime(startTime)} – {formatShiftTime(endTime)}
                        {duration ? ` ${duration}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-middle font-medium text-fo-text">
                      {formatHourlyRate(shift.hourlyRate)}
                      <span className="text-fo-text-muted">/hr</span>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <p className="font-medium text-fo-text">
                        {shift.filledCount} / {shift.positionsNeeded}
                      </p>
                      <FillProgressBar
                        filledCount={shift.filledCount}
                        positionsNeeded={shift.positionsNeeded}
                      />
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span className="inline-flex items-center gap-1.5 text-fo-text-muted">
                        <PeopleIcon className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-fo-text">
                          {shift.applicantCount}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle text-right">
                      <ShiftRowActions shiftId={shift.id} status={shift.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredShifts.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fo-text-muted">
            Showing {pagination.startIndex} to {pagination.endIndex} of{" "}
            {pagination.totalItems} shifts
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={pagination.page <= 1}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "min-w-8 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
                    pageNumber === pagination.page
                      ? "border-fo-primary-bright/40 bg-fo-primary-bright/15 text-fo-primary-hover"
                      : "border-white/10 text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                  )}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(pagination.totalPages, current + 1))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
