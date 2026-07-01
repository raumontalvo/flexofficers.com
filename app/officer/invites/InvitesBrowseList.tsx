"use client";

import { useMemo, useState } from "react";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName } from "@/components/ui";
import { interpolate } from "@/lib/app-i18n";
import { cn } from "@/lib/cn";
import { getInviteTabs } from "@/lib/i18n/ui-labels";
import {
  filterInvitesByTab,
  getInviteTabCounts,
  sortOfficerInvites,
  type InviteSortOption,
  type InviteTab,
  type OfficerInviteData,
} from "@/lib/officer-invite-data";
import type { OfficerNotificationData } from "@/lib/officer-notification-data";
import { InviteCard } from "./InviteCard";
import { InvitesHowItWorksPanel } from "./InvitesHowItWorksPanel";
import { InvitesMobileFooter } from "./InvitesMobileFooter";

const tabColorClasses: Record<InviteTab, string> = {
  all: "text-fo-text-muted hover:text-fo-text",
  pending: "text-fo-pending hover:text-amber-300",
  accepted: "text-fo-success hover:text-green-300",
  declined: "text-fo-rejected hover:text-red-300",
};

const MOBILE_INVITE_TAB_STYLES: Record<
  InviteTab,
  { selected: string; unselected: string }
> = {
  all: {
    selected: "border-blue-500/45 bg-blue-500/20 text-blue-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
  pending: {
    selected: "border-amber-500/45 bg-amber-500/20 text-amber-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
  accepted: {
    selected: "border-green-500/45 bg-green-500/20 text-green-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
  declined: {
    selected: "border-red-500/45 bg-red-500/20 text-red-100",
    unselected: "border-white/10 bg-white/[0.03] text-fo-text-muted",
  },
};

type InvitesBrowseListProps = {
  invites: OfficerInviteData[];
  inviteNotifications: OfficerNotificationData[];
};

export function InvitesBrowseList({
  invites,
  inviteNotifications,
}: InvitesBrowseListProps) {
  const { t } = useLandingLanguage();
  const inviteCopy = t.browse.invites;
  const inviteTabs = getInviteTabs(t);
  const [tab, setTab] = useState<InviteTab>("all");
  const [sort, setSort] = useState<InviteSortOption>("newest");
  const [removedInviteIds, setRemovedInviteIds] = useState<string[]>([]);

  const activeInvites = useMemo(
    () => invites.filter((invite) => !removedInviteIds.includes(invite.id)),
    [invites, removedInviteIds]
  );

  const tabCounts = useMemo(() => getInviteTabCounts(activeInvites), [activeInvites]);

  const visibleInvites = useMemo(() => {
    const filtered = filterInvitesByTab(activeInvites, tab);
    return sortOfficerInvites(filtered, sort);
  }, [activeInvites, tab, sort]);

  function handleInviteDeleted(inviteId: string) {
    setRemovedInviteIds((current) =>
      current.includes(inviteId) ? current : [...current, inviteId]
    );
  }

  return (
    <div className="space-y-4">
      <TranslatedSectionHeading page="officerInvites" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 border-b border-white/[0.06] pb-3 sm:grid-cols-4 lg:hidden">
            {inviteTabs.map((item) => {
              const isActive = tab === item.value;
              const styles = MOBILE_INVITE_TAB_STYLES[item.value];

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTab(item.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "min-w-0 rounded-full border px-2 py-2 text-center text-[11px] font-semibold leading-tight transition sm:px-2.5 sm:text-xs",
                    isActive ? styles.selected : styles.unselected
                  )}
                >
                  <span className="block whitespace-normal">{item.label}</span>
                  <span className="mt-0.5 block text-[10px] opacity-80">
                    ({tabCounts[item.value]})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden flex-wrap gap-2 border-b border-white/[0.06] pb-3 lg:flex">
            {inviteTabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                  tab === item.value
                    ? "bg-fo-primary-bright/15 text-fo-primary-hover"
                    : tabColorClasses[item.value]
                )}
              >
                {item.label}
                <span className="ml-1.5 text-xs opacity-80">
                  ({tabCounts[item.value]})
                </span>
              </button>
            ))}
          </div>

          {visibleInvites.length === 0 ? (
            <section className="fo-glass-card rounded-xl border border-white/10 px-4 py-12 text-center">
              <h2 className="text-lg font-semibold text-fo-text">
                {activeInvites.length === 0 ? inviteCopy.empty.none : inviteCopy.empty.noTab}
              </h2>
              <p className="mt-2 text-sm text-fo-text-muted">
                {activeInvites.length === 0
                  ? inviteCopy.empty.noneDescription
                  : inviteCopy.empty.noTabDescription}
              </p>
              {tab !== "all" ? (
                <button
                  type="button"
                  onClick={() => setTab("all")}
                  className={buttonClassName({
                    size: "md",
                    className: "mt-5 inline-flex",
                  })}
                >
                  {t.browse.shifts.actions.clearFilters}
                </button>
              ) : null}
            </section>
          ) : (
            <>
              <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-fo-text">
                  {interpolate(inviteCopy.count, { count: visibleInvites.length })}
                </p>

                <label className="flex items-center gap-2 text-xs text-fo-text-muted">
                  <span>{inviteCopy.sort.label}</span>
                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as InviteSortOption)
                    }
                    className="min-h-9 rounded-lg border border-fo-border bg-fo-bg/80 px-2 py-1.5 text-sm text-fo-text"
                  >
                    <option value="newest">{inviteCopy.sort.newest}</option>
                    <option value="oldest">{inviteCopy.sort.oldest}</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-6 lg:space-y-4 lg:gap-0">
                {visibleInvites.map((invite) => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    onRespond={() => undefined}
                    onDeleted={handleInviteDeleted}
                  />
                ))}
              </div>
            </>
          )}

          <InvitesMobileFooter
            invites={activeInvites}
            inviteNotifications={inviteNotifications}
          />
        </div>

        <InvitesHowItWorksPanel />
      </div>
    </div>
  );
}
