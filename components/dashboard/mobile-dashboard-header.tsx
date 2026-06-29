"use client";

import Link from "next/link";
import { FlexOfficersBadge } from "@/components/brand";
import { NotificationsIcon } from "@/components/nav/icons";
import type { MobileBottomNavRole } from "@/components/ui/mobile-bottom-nav";
import { cn } from "@/lib/cn";
import { useUnreadNotificationCount } from "./use-unread-notification-count";

const notificationsHref: Record<MobileBottomNavRole, string> = {
  officer: "/officer/notifications",
  company: "/company/notifications",
};

type MobileDashboardHeaderProps = {
  role: MobileBottomNavRole;
};

export function MobileDashboardHeader({ role }: MobileDashboardHeaderProps) {
  const unreadCount = useUnreadNotificationCount();
  const hasUnread = unreadCount > 0;

  return (
    <header className="relative flex h-[var(--fo-mobile-header-height)] max-h-20 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2 md:hidden">
      <Link href="/dashboard" className="inline-flex min-w-0 items-center gap-2.5">
        <FlexOfficersBadge height={44} transparent priority />
        <span className="truncate text-base font-bold tracking-tight">
          <span className="text-fo-primary-bright">Flex</span>
          <span className="text-slate-100">Officers</span>
        </span>
      </Link>

      <Link
        href={notificationsHref[role]}
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
          hasUnread
            ? "border-red-500/45 bg-red-500/10 text-red-400 hover:border-red-400/60 hover:bg-red-500/15"
            : "border-white/10 bg-[#070f1c]/60 text-fo-text-muted hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
        )}
        aria-label={
          hasUnread
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
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
    </header>
  );
}
