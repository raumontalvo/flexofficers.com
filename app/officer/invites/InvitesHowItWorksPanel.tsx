"use client";

import Link from "next/link";
import { formatNotificationTimeAgo } from "@/lib/officer-notification-data";
import type { OfficerNotificationData } from "@/lib/officer-notification-data";
import { buttonClassName } from "@/components/ui";

const STEPS = [
  {
    title: "Company invites you",
    description:
      "A company finds your profile and invites you to a shift.",
  },
  {
    title: "You review the shift",
    description: "Check the details and decide if it's a good fit.",
  },
  {
    title: "Accept invite",
    description:
      "If you accept, the shift is automatically added to your Accepted Shifts.",
  },
  {
    title: "Show up & get paid",
    description: "Work the shift and get paid directly by the company.",
  },
];

type InvitesHowItWorksPanelProps = {
  inviteNotifications: OfficerNotificationData[];
};

export function InvitesHowItWorksPanel({
  inviteNotifications,
}: InvitesHowItWorksPanelProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h2 className="text-base font-semibold text-fo-text">How Invites Work</h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-bold text-blue-100">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-fo-text">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-fo-text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-fo-text">
            Recent Invite Notifications
          </h2>
          <Link
            href="/officer/notifications"
            className="text-xs font-semibold text-blue-200 hover:text-blue-100"
          >
            View All
          </Link>
        </div>

        {inviteNotifications.length === 0 ? (
          <p className="mt-3 text-xs text-fo-text-muted">
            No invite notifications yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {inviteNotifications.slice(0, 4).map((notification) => (
              <li
                key={notification.id}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
              >
                <p className="text-xs font-semibold text-fo-text">
                  {notification.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-fo-text-muted">
                  {notification.message}
                </p>
                <p className="mt-1 text-[10px] text-fo-text-subtle">
                  {formatNotificationTimeAgo(notification.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          disabled
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "mt-4 w-full text-xs opacity-70",
          })}
        >
          Enable Push Notifications
        </button>
        <p className="mt-2 text-[10px] text-fo-text-subtle">
          Push notifications are coming soon.
        </p>
      </section>
    </aside>
  );
}
