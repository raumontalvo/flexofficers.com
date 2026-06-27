"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  APPLICATION_STATUS_TABS,
  formatApplicationsPaginationRange,
  type ApplicationStatusFilter,
  type OfficerApplicationData,
} from "@/lib/officer-application-data";
import { getHiddenApplicationIds } from "./RemoveFromListButton";
import { ApplicationCard } from "./ApplicationCard";

const PAGE_SIZE = 6;

const fieldClassName =
  "min-h-9 w-full rounded-lg border border-fo-border bg-fo-bg-elevated px-2.5 py-1.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

const tabColorClasses: Record<ApplicationStatusFilter, string> = {
  "": "text-fo-text-muted hover:text-fo-text",
  PENDING: "text-fo-pending hover:text-amber-300",
  ACCEPTED: "text-fo-success hover:text-green-300",
  REJECTED: "text-fo-rejected hover:text-red-300",
  WITHDRAWN: "text-fo-text-muted hover:text-slate-300",
};

function buildPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return [...pages].sort((a, b) => a - b);
}

function countByStatus(
  applications: OfficerApplicationData[],
  status: ApplicationStatusFilter
) {
  if (!status) {
    return applications.length;
  }

  return applications.filter((application) => application.status === status).length;
}

type ApplicationsBrowseListProps = {
  applications: OfficerApplicationData[];
};

export function ApplicationsBrowseList({
  applications,
}: ApplicationsBrowseListProps) {
  const listTopRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatusFilter>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hiddenVersion, setHiddenVersion] = useState(0);

  const visibleApplications = useMemo(() => {
    const hiddenIds = new Set(getHiddenApplicationIds());
    return applications.filter((application) => !hiddenIds.has(application.id));
  }, [applications, hiddenVersion]);

  const filteredApplications = useMemo(() => {
    if (!statusFilter) {
      return visibleApplications;
    }

    return visibleApplications.filter(
      (application) => application.status === statusFilter
    );
  }, [visibleApplications, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageApplications = filteredApplications.slice(
    pageStart,
    pageStart + PAGE_SIZE
  );
  const rangeStart =
    filteredApplications.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filteredApplications.length);
  const pageNumbers = buildPageNumbers(safePage, totalPages);
  const paginationLabel = formatApplicationsPaginationRange(
    rangeStart,
    rangeEnd,
    filteredApplications.length
  );
  const hasNoApplications = applications.length === 0;
  const hasNoVisibleApplications = !hasNoApplications && visibleApplications.length === 0;
  const hasNoMatchingApplications =
    !hasNoApplications &&
    visibleApplications.length > 0 &&
    filteredApplications.length === 0;

  function scrollToListTop() {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateStatusFilter(next: ApplicationStatusFilter) {
    setStatusFilter(next);
    setCurrentPage(1);
    scrollToListTop();
  }

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    scrollToListTop();
  }

  function handleListChange() {
    setHiddenVersion((version) => version + 1);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
            My Applications
          </h1>
          <p className="max-w-2xl text-base text-fo-text-muted sm:text-lg">
            Shifts you&apos;ve applied to.
          </p>
        </div>

        {!hasNoApplications ? (
          <div className="w-full space-y-1 lg:w-auto lg:min-w-[200px]">
            <label htmlFor="application-status-filter" className="text-xs text-fo-text-muted">
              Filter by status
            </label>
            <select
              id="application-status-filter"
              value={statusFilter}
              onChange={(e) =>
                updateStatusFilter(e.target.value as ApplicationStatusFilter)
              }
              className={cn(fieldClassName, "lg:min-w-[200px]")}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        ) : null}
      </div>

      {!hasNoApplications ? (
        <div className="border-b border-white/[0.06]">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {APPLICATION_STATUS_TABS.map((tab) => {
              const isActive = statusFilter === tab.value;
              const count = countByStatus(visibleApplications, tab.value);

              return (
                <button
                  key={tab.value || "all"}
                  type="button"
                  onClick={() => updateStatusFilter(tab.value)}
                  className={cn(
                    "shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition",
                    isActive
                      ? "border-fo-primary-bright text-fo-text"
                      : cn("border-transparent", tabColorClasses[tab.value])
                  )}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div ref={listTopRef} className="scroll-mt-4 space-y-2">
        {hasNoApplications ? (
          <Card variant="muted" className="py-10 text-center">
            <p className="text-lg font-semibold text-fo-text">
              You have not applied to any shifts yet.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-fo-text-muted">
              Browse open shifts and apply to start building your schedule.
            </p>
            <Link href="/shifts" className="mt-6 inline-block">
              <Button type="button" size="md">
                Browse Shifts
              </Button>
            </Link>
          </Card>
        ) : hasNoVisibleApplications ? (
          <Card variant="muted" className="py-8 text-center">
            <p className="text-base font-medium text-fo-text">
              No applications in your list.
            </p>
            <p className="mt-1 text-sm text-fo-text-muted">
              Removed applications stay hidden on this device.
            </p>
          </Card>
        ) : hasNoMatchingApplications ? (
          <Card variant="muted" className="py-8 text-center">
            <p className="text-base font-medium text-fo-text">
              No applications match this filter.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="mt-4"
              onClick={() => updateStatusFilter("")}
            >
              Show All Applications
            </Button>
          </Card>
        ) : (
          <div className="space-y-1.5">
            {pageApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onListChange={handleListChange}
              />
            ))}
          </div>
        )}
      </div>

      {filteredApplications.length > PAGE_SIZE ? (
        <div className="fo-glass-card flex flex-col gap-3 rounded-lg border border-white/10 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fo-text-muted">{paginationLabel}</p>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              className={cn(
                "rounded-md border border-fo-border px-2.5 py-1 text-xs font-medium text-fo-text-muted transition",
                safePage > 1 && "hover:border-fo-border-strong hover:text-fo-text",
                safePage <= 1 && "cursor-not-allowed opacity-40"
              )}
            >
              Previous
            </button>

            {pageNumbers.map((page, index) => {
              const prev = pageNumbers[index - 1];
              const showEllipsis = prev !== undefined && page - prev > 1;

              return (
                <span key={page} className="flex items-center gap-1.5">
                  {showEllipsis ? (
                    <span className="px-1 text-xs text-fo-text-subtle">…</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => goToPage(page)}
                    className={cn(
                      "min-w-8 rounded-md border px-2 py-1 text-xs font-medium transition",
                      page === safePage
                        ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-bright"
                        : "border-fo-border text-fo-text-muted hover:border-fo-border-strong hover:text-fo-text"
                    )}
                  >
                    {page}
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className={cn(
                "rounded-md border border-fo-border px-2.5 py-1 text-xs font-medium text-fo-text-muted transition",
                safePage < totalPages &&
                  "hover:border-fo-border-strong hover:text-fo-text",
                safePage >= totalPages && "cursor-not-allowed opacity-40"
              )}
            >
              Next
            </button>
          </div>
        </div>
      ) : filteredApplications.length > 0 ? (
        <p className="px-0.5 text-xs text-fo-text-muted">{paginationLabel}</p>
      ) : null}
    </div>
  );
}
