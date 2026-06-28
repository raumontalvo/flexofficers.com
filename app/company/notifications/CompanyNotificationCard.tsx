"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTransition } from "react";
import { cn } from "@/lib/cn";
import {
  formatNotificationTimeAgo,
  notificationToneClasses,
  type CompanyNotificationData,
  type NotificationIconVariant,
} from "@/lib/company-notification-data";
import { deleteCompanyNotification } from "./actions";
import { hideCompanyNotificationFromList } from "./hidden-notifications";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="m6 10 2.5 2.5L14 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 3v3M13 3v3M3.5 8.5h13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M10 4a3.5 3.5 0 0 0-3.5 3.5v2.1l-1.3 2.6a.8.8 0 0 0 .7 1.2h8.2a.8.8 0 0 0 .7-1.2l-1.3-2.6V7.5A3.5 3.5 0 0 0 10 4Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M8.5 14.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M7 3.5h4.2L15.5 7.3V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M11 3.5V8h4.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="m7 7 6 6M13 7l-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4.5 8.5h2.3l4.7-2.8v9.6L6.8 12.5H4.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M12.5 7.5v5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14.5 9.5c.8.8.8 2.2 0 3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function NotificationIcon({
  variant,
  tone,
}: {
  variant: NotificationIconVariant;
  tone: CompanyNotificationData["tone"];
}) {
  const iconClassName = cn(
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1",
    notificationToneClasses[tone].icon
  );

  const icons: Record<NotificationIconVariant, ReactNode> = {
    check: <CheckIcon />,
    calendar: <CalendarIcon />,
    bell: <BellIcon />,
    document: <DocumentIcon />,
    x: <XIcon />,
    megaphone: <MegaphoneIcon />,
  };

  return <div className={iconClassName}>{icons[variant]}</div>;
}

type CompanyNotificationCardProps = {
  notification: CompanyNotificationData;
  onDeleted: () => void;
};

export function CompanyNotificationCard({
  notification,
  onDeleted,
}: CompanyNotificationCardProps) {
  const toneClasses = notificationToneClasses[notification.tone];
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    hideCompanyNotificationFromList(notification.id);
    onDeleted();

    startTransition(async () => {
      try {
        await deleteCompanyNotification(notification.id);
      } catch {
        // Local hide remains if server delete fails.
      }
    });
  }

  return (
    <article
      className={cn(
        "fo-glass-card rounded-lg border border-white/10 transition",
        "min-h-[112px] md:h-[116px] md:overflow-hidden",
        !notification.read && "border-fo-primary-bright/20 bg-fo-primary/5"
      )}
    >
      <div className="flex h-full flex-col gap-3 p-3 md:grid md:grid-cols-[52px_minmax(0,1fr)_minmax(108px,0.55fr)_auto] md:items-center md:gap-3 md:py-0">
        <NotificationIcon
          variant={notification.iconVariant}
          tone={notification.tone}
        />

        <div className="min-w-0 space-y-1">
          <span
            className={cn(
              "inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em]",
              toneClasses.badge
            )}
          >
            {notification.typeLabel}
          </span>
          <h2 className="truncate text-sm font-bold text-fo-text">
            {notification.title}
          </h2>
          <p className="line-clamp-2 text-xs leading-snug text-fo-text-muted">
            {notification.message}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 md:flex-col md:items-end md:justify-center">
          <p className="text-[11px] text-fo-text-subtle">
            {formatNotificationTimeAgo(notification.createdAt)}
          </p>
          {!notification.read ? (
            <span
              className="h-2 w-2 rounded-full bg-fo-primary-bright"
              aria-label="Unread"
            />
          ) : (
            <span className="hidden h-2 w-2 md:block" aria-hidden />
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row md:flex-col">
          <Link
            href={notification.primaryAction.href}
            className="inline-flex min-h-8 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10"
          >
            {notification.primaryAction.label}
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex min-h-8 items-center justify-center rounded-lg border border-red-500/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/10 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
