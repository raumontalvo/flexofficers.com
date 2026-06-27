"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, StatCard } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { OfficerAcceptedShiftData } from "@/lib/officer-accepted-shift-data";
import {
  buildUpcomingShiftSummary,
  filterUpcomingShifts,
  formatExpectedEarnings,
  formatScheduledHours,
  isUpcomingFutureShift,
  sortUpcomingShifts,
  type UpcomingShiftFilter,
  type UpcomingShiftSort,
} from "@/lib/officer-upcoming-shift-data";
import { UpcomingShiftCard } from "./UpcomingShiftCard";

const fieldClassName =
  "min-h-9 w-full rounded-lg border border-fo-border bg-fo-bg-elevated px-2.5 py-1.5 text-sm text-fo-text focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

const filterOptions: { value: UpcomingShiftFilter; label: string }[] = [
  { value: "", label: "All Upcoming" },
  { value: "next7", label: "Next 7 Days" },
  { value: "thisMonth", label: "This Month" },
];

const sortOptions: { value: UpcomingShiftSort; label: string }[] = [
  { value: "soonest", label: "Soonest" },
  { value: "latest", label: "Latest" },
];

type UpcomingShiftsBrowseListProps = {
  applications: OfficerAcceptedShiftData[];
};

export function UpcomingShiftsBrowseList({
  applications,
}: UpcomingShiftsBrowseListProps) {
  const [shiftFilter, setShiftFilter] = useState<UpcomingShiftFilter>("");
  const [sort, setSort] = useState<UpcomingShiftSort>("soonest");

  const upcomingApplications = useMemo(
    () => applications.filter((application) => isUpcomingFutureShift(application)),
    [applications]
  );

  const summary = useMemo(
    () => buildUpcomingShiftSummary(applications),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const filtered = filterUpcomingShifts(upcomingApplications, shiftFilter);
    return sortUpcomingShifts(filtered, sort);
  }, [upcomingApplications, shiftFilter, sort]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
          Upcoming Shifts
        </h1>
        <p className="max-w-2xl text-base text-fo-text-muted sm:text-lg">
          Accepted assignments with future start dates.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming Shifts" value={summary.count} tone="blue" />
        <StatCard
          label="Expected Earnings"
          value={formatExpectedEarnings(summary.expectedEarnings)}
          tone="green"
        />
        <StatCard
          label="Scheduled Hours"
          value={formatScheduledHours(summary.scheduledHours)}
          tone="purple"
        />
        <StatCard
          label="Next Shift"
          value={summary.nextShiftDate ?? "—"}
          hint={summary.nextShiftStartsIn ?? undefined}
          tone="amber"
        />
      </div>

      <div className="fo-glass-card grid gap-3 rounded-lg border border-white/10 p-3 md:grid-cols-[minmax(0,1fr)_180px]">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const active = shiftFilter === option.value;

            return (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => setShiftFilter(option.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-fo-primary-bright/50 bg-fo-primary/10 text-fo-primary-bright"
                    : "border-white/10 bg-white/[0.03] text-fo-text-muted hover:text-fo-text"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <label htmlFor="upcoming-shift-sort" className="text-xs text-fo-text-muted">
            Sort
          </label>
          <select
            id="upcoming-shift-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as UpcomingShiftSort)
            }
            className={fieldClassName}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {upcomingApplications.length === 0 ? (
        <Card variant="muted" className="fo-glass-card py-10 text-center">
          <p className="text-lg font-semibold text-fo-text">
            No upcoming shifts yet.
          </p>
          <p className="mt-2 text-sm text-fo-text-muted">
            New confirmed shifts will appear here when companies accept your
            applications.
          </p>
          <Link href="/shifts" className="mt-6 inline-block">
            <Button type="button" size="md">
              Browse Open Shifts
            </Button>
          </Link>
        </Card>
      ) : null}

      {upcomingApplications.length > 0 && filteredApplications.length === 0 ? (
        <Card variant="muted" className="fo-glass-card py-8 text-center">
          <p className="text-base font-medium text-fo-text">
            No shifts match your filters.
          </p>
        </Card>
      ) : null}

      {filteredApplications.length > 0 ? (
        <div className="space-y-2">
          {filteredApplications.map((application) => (
            <UpcomingShiftCard key={application.id} application={application} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
