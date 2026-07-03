"use client";

import Link from "next/link";
import { NotificationsIcon } from "@/components/nav/icons";
import { buttonClassName } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { useUnreadNotificationCount } from "@/components/dashboard/use-unread-notification-count";
import { cn } from "@/lib/cn";

type ClientDashboardHeaderProps = {
  className?: string;
};

export function ClientDashboardHeader({ className }: ClientDashboardHeaderProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.client;
  const nav = t.appNav;
  const unreadCount = useUnreadNotificationCount();

  return (
    <>
      <header
        className={cn(
          "overflow-hidden rounded-2xl border border-white/10 bg-[#070f1c]/80 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] md:hidden",
          className
        )}
      >
        <div className="min-w-0">
          <h1 className="break-words text-xl font-extrabold tracking-tight text-fo-text">
            {copy.title}
          </h1>
          <p className="mt-1.5 break-words text-xs leading-relaxed text-fo-text-muted">
            {copy.subtitle}
          </p>
        </div>

        <Link
          href="/client/leads/new"
          className={buttonClassName({
            size: "md",
            className: "mt-4 min-h-10 w-full whitespace-nowrap",
          })}
        >
          {copy.createLead}
        </Link>
      </header>

      <header
        className={cn(
          "hidden flex-col gap-4 md:flex md:flex-row md:items-start md:justify-between",
          className
        )}
      >
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-1.5 text-sm text-fo-text-muted">{copy.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/client/applicants"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
            aria-label={nav.aria.notifications}
          >
            <NotificationsIcon className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/client/leads/new"
            className={buttonClassName({
              size: "md",
              className: "min-h-10 whitespace-nowrap px-4",
            })}
          >
            {copy.createLead}
          </Link>
        </div>
      </header>
    </>
  );
}
