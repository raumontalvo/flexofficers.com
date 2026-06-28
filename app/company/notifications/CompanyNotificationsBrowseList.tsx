"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  countUnreadCompanyNotifications,
  filterCompanyNotifications,
  formatNotificationsPaginationRange,
  getCompanyNotificationTabs,
  type CompanyNotificationData,
  type CompanyNotificationTab,
} from "@/lib/company-notification-data";
import { markAllCompanyNotificationsRead } from "./actions";
import { CompanyNotificationCard } from "./CompanyNotificationCard";
import { getHiddenCompanyNotificationIds } from "./hidden-notifications";

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

type CompanyNotificationsBrowseListProps = {
  notifications: CompanyNotificationData[];
};

export function CompanyNotificationsBrowseList({
  notifications: initialNotifications,
}: CompanyNotificationsBrowseListProps) {
  const router = useRouter();
  const listTopRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<CompanyNotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [hiddenVersion, setHiddenVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const tabs = getCompanyNotificationTabs();

  const visibleNotifications = useMemo(() => {
    const hidden = new Set(getHiddenCompanyNotificationIds());
    return notifications.filter((notification) => !hidden.has(notification.id));
  }, [notifications, hiddenVersion]);

  const filteredNotifications = useMemo(
    () => filterCompanyNotifications(visibleNotifications, activeTab),
    [visibleNotifications, activeTab]
  );

  const unreadCount = useMemo(
    () => countUnreadCompanyNotifications(visibleNotifications),
    [visibleNotifications]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / PAGE_SIZE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageNotifications = filteredNotifications.slice(
    pageStart,
    pageStart + PAGE_SIZE
  );
  const rangeStart =
    filteredNotifications.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filteredNotifications.length);
  const pageNumbers = buildPageNumbers(safePage, totalPages);
  const paginationLabel = formatNotificationsPaginationRange(
    rangeStart,
    rangeEnd,
    filteredNotifications.length
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  function handleMarkAllRead() {
    if (unreadCount === 0) {
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );

    startTransition(async () => {
      await markAllCompanyNotificationsRead();
      router.refresh();
    });
  }

  function handleDeleted() {
    setHiddenVersion((version) => version + 1);
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getTabCount(tab: CompanyNotificationTab) {
    if (tab === "unread") {
      return unreadCount;
    }

    if (tab === "all") {
      return visibleNotifications.length;
    }

    return filterCompanyNotifications(visibleNotifications, tab).length;
  }

  return (
    <div ref={listTopRef} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
            Notifications
          </h1>
          <p className="max-w-2xl text-base text-fo-text-muted sm:text-lg">
            Applicant updates, invite responses, and shift alerts will appear
            here.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || isPending}
          className={cn(
            "inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
            unreadCount > 0
              ? "border-fo-primary-bright/40 text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10"
              : "cursor-not-allowed border-white/10 text-fo-text-subtle"
          )}
        >
          <span aria-hidden>✓</span>
          {isPending ? "Marking…" : "Mark all as read"}
        </button>
      </div>

      <div className="border-b border-white/10">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.value;
            const count = getTabCount(tab.value);

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative shrink-0 px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "text-white"
                    : "text-fo-text-muted hover:text-fo-text"
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {tab.label}
                  {count > 0 ? (
                    <span className="text-xs text-fo-text-subtle">({count})</span>
                  ) : null}
                </span>
                {active ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-fo-primary-bright" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {visibleNotifications.length === 0 ? (
        <Card variant="muted" className="fo-glass-card py-10 text-center">
          <p className="text-lg font-semibold text-fo-text">No notifications yet.</p>
          <p className="mt-2 text-sm text-fo-text-muted">
            Notifications will appear here when officers respond to invites,
            apply to shifts, or when FlexOfficers sends announcements.
          </p>
        </Card>
      ) : null}

      {visibleNotifications.length > 0 && filteredNotifications.length === 0 ? (
        <Card variant="muted" className="fo-glass-card py-8 text-center">
          <p className="text-base font-medium text-fo-text">
            No notifications in this tab.
          </p>
        </Card>
      ) : null}

      {pageNotifications.length > 0 ? (
        <div className="space-y-2">
          {pageNotifications.map((notification) => (
            <CompanyNotificationCard
              key={notification.id}
              notification={notification}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      ) : null}

      {filteredNotifications.length > PAGE_SIZE ? (
        <div className="fo-glass-card flex flex-col gap-3 rounded-lg border border-white/10 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fo-text-muted">{paginationLabel}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-fo-text-muted transition hover:text-fo-text disabled:opacity-40"
            >
              Previous
            </button>
            {pageNumbers.map((page, index) => {
              const previous = pageNumbers[index - 1];
              const showEllipsis = previous != null && page - previous > 1;

              return (
                <span key={page} className="inline-flex items-center gap-1.5">
                  {showEllipsis ? (
                    <span className="px-1 text-xs text-fo-text-subtle">…</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => goToPage(page)}
                    className={cn(
                      "min-w-8 rounded-lg border px-2 py-1 text-xs font-medium transition",
                      page === safePage
                        ? "border-fo-primary-bright/50 bg-fo-primary/10 text-fo-primary-bright"
                        : "border-white/10 text-fo-text-muted hover:text-fo-text"
                    )}
                  >
                    {page}
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-fo-text-muted transition hover:text-fo-text disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <p className="text-xs text-fo-text-muted">{paginationLabel}</p>
      ) : null}
    </div>
  );
}
