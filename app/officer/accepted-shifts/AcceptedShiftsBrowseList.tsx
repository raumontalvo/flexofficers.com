"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Button, Card, buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ACCEPTED_SHIFT_TABS,
  formatAcceptedShiftsPaginationRange,
  getAcceptedShiftTab,
  type AcceptedShiftTab,
  type OfficerAcceptedShiftData,
} from "@/lib/officer-accepted-shift-data";
import { AcceptedShiftCard } from "./AcceptedShiftCard";
import { getHiddenAcceptedShiftIds } from "./RemoveFromAcceptedListButton";

const PAGE_SIZE = 10;

function buildPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return [...pages].sort((a, b) => a - b);
}

function countByTab(
  applications: OfficerAcceptedShiftData[],
  tab: AcceptedShiftTab
) {
  return applications.filter(
    (application) =>
      getAcceptedShiftTab(application.shift.status, application.shift.endTime) ===
      tab
  ).length;
}

const emptyStateCopy: Record<
  AcceptedShiftTab,
  { title: string; description?: string; showBrowse?: boolean }
> = {
  upcoming: {
    title: "You do not have any accepted shifts yet.",
    showBrowse: true,
  },
  completed: {
    title: "You have not completed any shifts yet.",
  },
  cancelled: {
    title: "You have no cancelled assignments.",
  },
};

type AcceptedShiftsBrowseListProps = {
  applications: OfficerAcceptedShiftData[];
};

export function AcceptedShiftsBrowseList({
  applications,
}: AcceptedShiftsBrowseListProps) {
  const listTopRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<AcceptedShiftTab>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [hiddenVersion, setHiddenVersion] = useState(0);

  const visibleApplications = useMemo(() => {
    const hiddenIds = new Set(getHiddenAcceptedShiftIds());
    return applications.filter((application) => !hiddenIds.has(application.id));
  }, [applications, hiddenVersion]);

  const filteredApplications = useMemo(
    () =>
      visibleApplications.filter(
        (application) =>
          getAcceptedShiftTab(
            application.shift.status,
            application.shift.endTime
          ) === activeTab
      ),
    [visibleApplications, activeTab]
  );

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
  const paginationLabel = formatAcceptedShiftsPaginationRange(
    rangeStart,
    rangeEnd,
    filteredApplications.length
  );
  const emptyState = emptyStateCopy[activeTab];

  function scrollToListTop() {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateTab(next: AcceptedShiftTab) {
    setActiveTab(next);
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
            Accepted Shifts
          </h1>
          <p className="max-w-2xl text-base text-fo-text-muted sm:text-lg">
            Company contact details unlock after acceptance.
          </p>
        </div>

        <Link
          href="/officer/applications"
          className={buttonClassName({ variant: "secondary", size: "md" })}
        >
          My Shifts
        </Link>
      </div>

      <div className="border-b border-white/[0.06]">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {ACCEPTED_SHIFT_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            const count = countByTab(visibleApplications, tab.value);

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => updateTab(tab.value)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "border-fo-primary-bright text-fo-text"
                    : "border-transparent text-fo-text-muted hover:text-fo-text"
                )}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div ref={listTopRef} className="scroll-mt-4 space-y-2">
        {filteredApplications.length === 0 ? (
          <Card variant="muted" className="py-10 text-center">
            <p className="text-lg font-semibold text-fo-text">{emptyState.title}</p>
            {emptyState.description ? (
              <p className="mx-auto mt-2 max-w-md text-sm text-fo-text-muted">
                {emptyState.description}
              </p>
            ) : null}
            {emptyState.showBrowse ? (
              <Link href="/shifts" className="mt-6 inline-block">
                <Button type="button" size="md">
                  Browse Open Shifts
                </Button>
              </Link>
            ) : null}
          </Card>
        ) : (
          <div className="space-y-2 lg:space-y-4">
            {pageApplications.map((application) => (
              <AcceptedShiftCard
                key={application.id}
                application={application}
                tab={activeTab}
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
