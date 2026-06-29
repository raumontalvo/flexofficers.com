"use client";

import { useMemo, useState } from "react";
import { SectionHeading, buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  filterInvitesByTab,
  getInviteTabCounts,
  INVITE_TABS,
  sortOfficerInvites,
  type InviteSortOption,
  type InviteTab,
  type InviteViewMode,
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

type InvitesBrowseListProps = {
  invites: OfficerInviteData[];
  inviteNotifications: OfficerNotificationData[];
};

export function InvitesBrowseList({
  invites,
  inviteNotifications,
}: InvitesBrowseListProps) {
  const [tab, setTab] = useState<InviteTab>("all");
  const [sort, setSort] = useState<InviteSortOption>("newest");
  const [viewMode, setViewMode] = useState<InviteViewMode>("list");
  const tabCounts = useMemo(() => getInviteTabCounts(invites), [invites]);

  const visibleInvites = useMemo(() => {
    const filtered = filterInvitesByTab(invites, tab);
    return sortOfficerInvites(filtered, sort);
  }, [invites, tab, sort]);

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Company Invites"
        subtitle="Companies interested in working with you."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-3">
            {INVITE_TABS.map((item) => (
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
                {invites.length === 0 ? "No invites found." : "No invites in this tab."}
              </h2>
              <p className="mt-2 text-sm text-fo-text-muted">
                {invites.length === 0
                  ? "When a company invites you to a shift, it will appear here."
                  : "Try another tab or adjust your filters."}
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
                  Clear Filters
                </button>
              ) : null}
            </section>
          ) : (
            <>
              <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-fo-text">
                  {visibleInvites.length} invite
                  {visibleInvites.length === 1 ? "" : "s"}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-fo-text-muted">
                    <span>Sort By</span>
                    <select
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as InviteSortOption)
                      }
                      className="min-h-9 rounded-lg border border-fo-border bg-fo-bg/80 px-2 py-1.5 text-sm text-fo-text"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </label>

                  <div className="inline-flex rounded-lg border border-white/10 p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                        viewMode === "list"
                          ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                          : "text-fo-text-muted hover:text-fo-text"
                      )}
                    >
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                        viewMode === "grid"
                          ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                          : "text-fo-text-muted hover:text-fo-text"
                      )}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "flex flex-col gap-6",
                  viewMode === "grid"
                    ? "lg:grid lg:grid-cols-2 lg:gap-3"
                    : "lg:block lg:gap-0 lg:space-y-3"
                )}
              >
                {visibleInvites.map((invite) => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    viewMode={viewMode}
                    onRespond={() => undefined}
                  />
                ))}
              </div>
            </>
          )}

          <InvitesMobileFooter
            invites={invites}
            inviteNotifications={inviteNotifications}
          />
        </div>

        <InvitesHowItWorksPanel inviteNotifications={inviteNotifications} />
      </div>
    </div>
  );
}
