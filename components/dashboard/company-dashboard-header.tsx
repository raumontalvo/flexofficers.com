import Link from "next/link";
import { NotificationsIcon } from "@/components/nav/icons";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

type CompanyDashboardHeaderProps = {
  displayName: string;
  canPostShifts: boolean;
  unreadNotificationCount?: number;
  className?: string;
};

export function CompanyDashboardHeader({
  displayName,
  canPostShifts,
  unreadNotificationCount = 0,
  className,
}: CompanyDashboardHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-fo-text sm:text-2xl">
          Welcome back, {displayName}!{" "}
          <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-sm text-fo-text-muted">
          Here&apos;s what&apos;s happening with your security operations today.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-start">
        <Link
          href="/company/notifications"
          className="relative hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover md:flex"
          aria-label="Notifications"
        >
          <NotificationsIcon className="h-4 w-4" />
          {unreadNotificationCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fo-primary-bright px-1 text-[10px] font-bold text-white">
              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
            </span>
          ) : null}
        </Link>

        <Link
          href={canPostShifts ? "/shifts/create" : "/company/billing"}
          className={buttonClassName({
            size: "md",
            className: "shrink-0",
          })}
        >
          Post a New Shift
        </Link>
      </div>
    </header>
  );
}
