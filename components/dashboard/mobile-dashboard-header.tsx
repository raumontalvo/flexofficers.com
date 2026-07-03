"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FlexOfficersBadge } from "@/components/brand";
import { NotificationsIcon } from "@/components/nav/icons";
import type { MobileBottomNavRole } from "@/components/ui/mobile-bottom-nav";
import { cn } from "@/lib/cn";
import { useUnreadNotificationCount } from "./use-unread-notification-count";

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 5.5v3.5H13" />
      <path d="M3.5 14.5v-3.5H7" />
      <path d="M15.6 9a5.75 5.75 0 0 0-10.2-2.3L3.5 9" />
      <path d="M4.4 11a5.75 5.75 0 0 0 10.2 2.3l1.9-2.3" />
    </svg>
  );
}

const notificationsHref: Record<MobileBottomNavRole, string> = {
  officer: "/officer/notifications",
  company: "/company/notifications",
  client: "/client/applicants",
};

const homeHref: Record<MobileBottomNavRole, string> = {
  officer: "/dashboard",
  company: "/dashboard",
  client: "/client",
};

type MobileDashboardHeaderProps = {
  role: MobileBottomNavRole;
};

export function MobileDashboardHeader({ role }: MobileDashboardHeaderProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const unreadCount = useUnreadNotificationCount();
  const hasUnread = unreadCount > 0;

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <header className="relative flex h-[var(--fo-mobile-header-height)] max-h-20 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2 md:hidden">
      <Link href={homeHref[role]} className="inline-flex min-w-0 items-center gap-2.5">
        <FlexOfficersBadge height={44} transparent priority />
        <span className="truncate text-base font-bold tracking-tight">
          <span className="text-fo-primary-bright">Flex</span>
          <span className="text-slate-100">Officers</span>
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover disabled:opacity-60"
          aria-label="Refresh page"
        >
          <RefreshIcon className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
        </button>

        <Link
          href={notificationsHref[role]}
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
            hasUnread
              ? "border-red-500/45 bg-red-500/10 text-red-400 hover:border-red-400/60 hover:bg-red-500/15"
              : "border-white/10 bg-[#070f1c]/60 text-fo-text-muted hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
          )}
          aria-label={
            hasUnread ? `Notifications, ${unreadCount} unread` : "Notifications"
          }
        >
          <NotificationsIcon className={cn("h-5 w-5", hasUnread && "text-red-400")} />
          {hasUnread ? (
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#070f1c]"
              aria-hidden
            />
          ) : null}
        </Link>
      </div>
    </header>
  );
}
