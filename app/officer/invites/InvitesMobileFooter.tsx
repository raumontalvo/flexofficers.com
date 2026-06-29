"use client";

import Link from "next/link";
import { formatNotificationTimeAgo } from "@/lib/officer-notification-data";
import type { OfficerNotificationData } from "@/lib/officer-notification-data";
import {
  filterDuplicateInviteNotifications,
  INVITE_HOW_IT_WORKS_STEPS,
  type OfficerInviteData,
} from "@/lib/officer-invite-data";

type InvitesMobileFooterProps = {
  invites: OfficerInviteData[];
  inviteNotifications: OfficerNotificationData[];
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InvitesMobileFooter({
  invites,
  inviteNotifications,
}: InvitesMobileFooterProps) {
  const extraNotifications = filterDuplicateInviteNotifications(
    inviteNotifications,
    invites
  ).slice(0, 2);

  return (
    <div className="space-y-3 pb-4 lg:hidden">
      <details className="fo-glass-card group rounded-xl border border-white/10">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-fo-text [&::-webkit-details-marker]:hidden">
          How invites work
          <ChevronIcon className="h-4 w-4 shrink-0 text-fo-text-muted transition group-open:rotate-180" />
        </summary>
        <ol className="space-y-3 border-t border-white/[0.06] px-4 py-3">
          {INVITE_HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-100">
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-semibold text-fo-text">{step.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-fo-text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </details>

      {extraNotifications.length > 0 ? (
        <section className="fo-glass-card rounded-xl border border-white/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
              Other Updates
            </h2>
            <Link
              href="/officer/notifications"
              className="text-[11px] font-semibold text-blue-200 hover:text-blue-100"
            >
              View All
            </Link>
          </div>
          <ul className="mt-2 space-y-2">
            {extraNotifications.map((notification) => (
              <li
                key={notification.id}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <p className="text-xs font-semibold text-fo-text">
                  {notification.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-fo-text-muted">
                  {notification.message}
                </p>
                <p className="mt-1 text-[10px] text-fo-text-subtle">
                  {formatNotificationTimeAgo(notification.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
