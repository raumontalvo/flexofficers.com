"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { BrowseListPagination } from "@/components/i18n/browse-list-pagination";
import { TranslatedPageHeader } from "@/components/i18n/translated-page-header";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  formatNotificationsPagination,
  getCompanyNotificationTabs,
} from "@/lib/i18n/ui-labels";
import {
  countUnreadCompanyNotifications,
  filterCompanyNotifications,
  type CompanyNotificationData,
  type CompanyNotificationTab,
} from "@/lib/company-notification-data";
import { markAllCompanyNotificationsRead } from "./actions";
import { CompanyNotificationCard } from "./CompanyNotificationCard";
import { getHiddenCompanyNotificationIds } from "./hidden-notifications";
import { notifyNotificationsChanged } from "@/lib/notifications-changed";

const PAGE_SIZE = 10;

type CompanyNotificationsBrowseListProps = {
  notifications: CompanyNotificationData[];
};

export function CompanyNotificationsBrowseList({
  notifications: initialNotifications,
}: CompanyNotificationsBrowseListProps) {
  const router = useRouter();
  const { t } = useLandingLanguage();
  const listTopRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<CompanyNotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [hiddenVersion, setHiddenVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const tabs = getCompanyNotificationTabs(t);
  const officerCopy = t.browse.notifications;
  const copy = t.browse.companyNotifications;

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
  const paginationLabel = formatNotificationsPagination(
    t,
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
      notifyNotificationsChanged();
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
        <TranslatedPageHeader
          page="companyNotifications"
          titleClassName="text-3xl sm:text-4xl"
          subtitleClassName="text-base sm:text-lg"
        />

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
          {isPending ? officerCopy.marking : officerCopy.markAllRead}
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
          <p className="text-lg font-semibold text-fo-text">{copy.empty.none}</p>
          <p className="mt-2 text-sm text-fo-text-muted">
            {copy.empty.noneDescription}
          </p>
        </Card>
      ) : null}

      {visibleNotifications.length > 0 && filteredNotifications.length === 0 ? (
        <Card variant="muted" className="fo-glass-card py-8 text-center">
          <p className="text-base font-medium text-fo-text">
            {copy.empty.noMatch}
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
        <BrowseListPagination
          currentPage={safePage}
          totalPages={totalPages}
          label={paginationLabel}
          onPageChange={goToPage}
        />
      ) : filteredNotifications.length > 0 ? (
        <p className="text-xs text-fo-text-muted">{paginationLabel}</p>
      ) : null}
    </div>
  );
}
