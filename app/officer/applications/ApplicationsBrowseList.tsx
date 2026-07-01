"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { BrowseListPagination } from "@/components/i18n/browse-list-pagination";
import { TranslatedPageHeader } from "@/components/i18n/translated-page-header";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatApplicationsPagination,
  getApplicationStatusTabs,
} from "@/lib/i18n/ui-labels";
import {
  type ApplicationStatusFilter,
  type OfficerApplicationData,
} from "@/lib/officer-application-data";
import { getHiddenApplicationIds } from "./RemoveFromListButton";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationStatusSummaryCard } from "./ApplicationStatusSummaryCard";

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
  const router = useRouter();
  const { t } = useLandingLanguage();
  const listTopRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatusFilter>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hiddenVersion, setHiddenVersion] = useState(0);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const statusTabs = getApplicationStatusTabs(t);
  const copy = t.browse.applications;

  const visibleApplications = useMemo(() => {
    const hiddenIds = new Set(getHiddenApplicationIds());
    return applications.filter(
      (application) =>
        !hiddenIds.has(application.id) && !deletedIds.has(application.id)
    );
  }, [applications, hiddenVersion, deletedIds]);

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
  const paginationLabel = formatApplicationsPagination(
    t,
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

  function handleApplicationDeleted(applicationId: string) {
    setDeletedIds((current) => new Set(current).add(applicationId));
    setCurrentPage(1);
    setSuccessMessage(copy.toast.removed);
    router.refresh();
    window.setTimeout(() => setSuccessMessage(null), 4000);
  }

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatusFilter, number> = {
      "": countByStatus(visibleApplications, ""),
      PENDING: countByStatus(visibleApplications, "PENDING"),
      ACCEPTED: countByStatus(visibleApplications, "ACCEPTED"),
      REJECTED: countByStatus(visibleApplications, "REJECTED"),
      WITHDRAWN: countByStatus(visibleApplications, "WITHDRAWN"),
    };
    return counts;
  }, [visibleApplications]);

  return (
    <div className="space-y-2 md:space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <TranslatedPageHeader page="officerApplications" />

        {!hasNoApplications ? (
          <div className="hidden w-full space-y-1 lg:block lg:w-auto lg:min-w-[200px]">
            <label htmlFor="application-status-filter" className="text-xs text-fo-text-muted">
              {copy.filterByStatus}
            </label>
            <select
              id="application-status-filter"
              value={statusFilter}
              onChange={(e) =>
                updateStatusFilter(e.target.value as ApplicationStatusFilter)
              }
              className={cn(fieldClassName, "lg:min-w-[200px]")}
            >
              {statusTabs.map((tab) => (
                <option key={tab.value || "all"} value={tab.value}>
                  {tab.value === "" ? copy.allStatuses : tab.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {successMessage ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
        >
          {successMessage}
        </div>
      ) : null}

      {!hasNoApplications ? (
        <>
          <ApplicationStatusSummaryCard
            activeFilter={statusFilter}
            counts={statusCounts}
            onSelect={updateStatusFilter}
          />

          <div className="hidden border-b border-white/[0.06] md:block">
            <div className="flex gap-1 pb-px">
              {statusTabs.map((tab) => {
                const isActive = statusFilter === tab.value;
                const count = statusCounts[tab.value];

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
        </>
      ) : null}

      <div ref={listTopRef} className="scroll-mt-4 space-y-2">
        {hasNoApplications ? (
          <Card variant="muted" className="py-10 text-center">
            <p className="text-lg font-semibold text-fo-text">{copy.empty.none}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-fo-text-muted">
              {copy.empty.noneDescription}
            </p>
            <Link href="/shifts" className="mt-6 inline-block">
              <Button type="button" size="md">
                {copy.actions.browseShifts}
              </Button>
            </Link>
          </Card>
        ) : hasNoVisibleApplications ? (
          <Card variant="muted" className="py-8 text-center">
            <p className="text-base font-medium text-fo-text">
              {copy.empty.none}
            </p>
            <p className="mt-1 text-sm text-fo-text-muted">
              {copy.empty.hidden}
            </p>
          </Card>
        ) : hasNoMatchingApplications ? (
          <Card variant="muted" className="py-8 text-center">
            <p className="text-base font-medium text-fo-text">
              {copy.empty.noMatch}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="mt-4"
              onClick={() => updateStatusFilter("")}
            >
              {copy.actions.showAll}
            </Button>
          </Card>
        ) : (
          <div className="space-y-2 md:space-y-4">
            {pageApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onListChange={handleListChange}
                onDeleted={handleApplicationDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {filteredApplications.length > PAGE_SIZE ? (
        <BrowseListPagination
          currentPage={safePage}
          totalPages={totalPages}
          label={paginationLabel}
          onPageChange={goToPage}
        />
      ) : filteredApplications.length > 0 ? (
        <p className="px-0.5 text-xs text-fo-text-muted">{paginationLabel}</p>
      ) : null}
    </div>
  );
}
