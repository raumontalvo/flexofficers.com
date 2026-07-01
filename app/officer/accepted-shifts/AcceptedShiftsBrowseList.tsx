"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BrowseListPagination } from "@/components/i18n/browse-list-pagination";
import { TranslatedPageHeader } from "@/components/i18n/translated-page-header";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, Card, buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatAcceptedShiftsPagination,
  getAcceptedShiftTabs,
} from "@/lib/i18n/ui-labels";
import {
  getAcceptedShiftTab,
  type AcceptedShiftTab,
  type OfficerAcceptedShiftData,
} from "@/lib/officer-accepted-shift-data";
import { AcceptedShiftCard } from "./AcceptedShiftCard";
import { getHiddenAcceptedShiftIds } from "./RemoveFromAcceptedListButton";

const PAGE_SIZE = 10;

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

type AcceptedShiftsBrowseListProps = {
  applications: OfficerAcceptedShiftData[];
};

export function AcceptedShiftsBrowseList({
  applications,
}: AcceptedShiftsBrowseListProps) {
  const { t } = useLandingLanguage();
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
  const paginationLabel = formatAcceptedShiftsPagination(
    t,
    rangeStart,
    rangeEnd,
    filteredApplications.length
  );
  const acceptedTabs = getAcceptedShiftTabs(t);
  const copy = t.browse.acceptedShifts;
  const emptyTitles: Record<AcceptedShiftTab, string> = {
    upcoming: copy.empty.upcoming,
    completed: copy.empty.completed,
    cancelled: copy.empty.cancelled,
  };

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
        <TranslatedPageHeader
          page="officerAcceptedShifts"
          titleClassName="text-3xl sm:text-4xl"
          subtitleClassName="text-base sm:text-lg"
        />

        <Link
          href="/officer/applications"
          className={buttonClassName({ variant: "secondary", size: "md" })}
        >
          {t.browse.applications.actions.myShifts}
        </Link>
      </div>

      <div className="border-b border-white/[0.06]">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {acceptedTabs.map((tab) => {
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
            <p className="text-lg font-semibold text-fo-text">{emptyTitles[activeTab]}</p>
            {activeTab === "upcoming" ? (
              <Link href="/shifts" className="mt-6 inline-block">
                <Button type="button" size="md">
                  {copy.actions.browseOpenShifts}
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
