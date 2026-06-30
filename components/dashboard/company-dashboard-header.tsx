import Link from "next/link";
import { NotificationsIcon } from "@/components/nav/icons";
import { MobilePrimaryButton, buttonClassName } from "@/components/ui";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { cn } from "@/lib/cn";
import { getTimeOfDayGreeting } from "@/lib/time-of-day-greeting";

type CompanyDashboardHeaderProps = {
  displayName: string;
  logoUrl?: string | null;
  canPostShifts: boolean;
  unreadNotificationCount?: number;
  className?: string;
};

export function CompanyDashboardHeader({
  displayName,
  logoUrl,
  canPostShifts,
  unreadNotificationCount = 0,
  className,
}: CompanyDashboardHeaderProps) {
  const postShiftHref = canPostShifts ? "/shifts/create" : "/company/billing";
  const greeting = getTimeOfDayGreeting();

  return (
    <>
      <header
        className={cn(
          "overflow-hidden rounded-2xl border border-white/10 bg-[#070f1c]/80 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] lg:hidden",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-fo-text-muted">{greeting}</p>
            <h1 className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-fo-text">
              {displayName}
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-fo-text-muted">
              Here&apos;s what&apos;s happening with your security operations today.
            </p>
          </div>

          <div
            className="shrink-0 rounded-full shadow-[0_10px_28px_-6px_rgba(0,0,0,0.55)]"
            aria-hidden
          >
            <ProfileAvatar
              name={displayName}
              src={logoUrl}
              className="!h-[5.625rem] !w-[5.625rem] !border-0 !text-2xl"
            />
          </div>
        </div>

        <MobilePrimaryButton href={postShiftHref} className="mt-4">
          + Post a New Shift
        </MobilePrimaryButton>
      </header>

      <header
        className={cn(
          "hidden flex-col gap-4 lg:flex lg:flex-row lg:items-start lg:justify-between",
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

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/company/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
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
            href={postShiftHref}
            className={buttonClassName({
              size: "md",
              className: "min-h-10 whitespace-nowrap px-4",
            })}
          >
            Post a New Shift
          </Link>
        </div>
      </header>
    </>
  );
}
