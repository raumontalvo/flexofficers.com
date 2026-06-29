import Link from "next/link";
import { NotificationsIcon } from "@/components/nav/icons";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { cn } from "@/lib/cn";

type DashboardHeaderProps = {
  firstName?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  className?: string;
};

export function DashboardHeader({
  firstName,
  fullName,
  imageUrl,
  className,
}: DashboardHeaderProps) {
  const displayName = firstName?.trim() || "Officer";

  return (
    <header className={cn("fo-dashboard-header px-3 py-3 sm:px-4 sm:py-3.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-fo-text-muted">Welcome back,</p>
          <h1 className="truncate text-xl font-bold tracking-tight text-fo-text sm:text-[1.35rem]">
            {displayName}{" "}
            <span aria-hidden="true" className="inline-block">
              👋
            </span>
          </h1>
          <p className="hidden text-xs text-fo-text-muted sm:block">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/officer/notifications"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover md:flex"
            aria-label="Notifications"
          >
            <NotificationsIcon className="h-4 w-4" />
          </Link>

          <Link
            href="/officer/profile"
            className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-[#070f1c]/60 py-1 pl-1 pr-2.5 transition hover:border-fo-primary-bright/35 sm:pr-3"
          >
            <ProfileAvatar
              name={fullName ?? displayName}
              src={imageUrl}
              size="sm"
              className="!h-8 !w-8 !text-xs"
            />
            <span className="hidden max-w-[7rem] truncate text-xs font-semibold text-fo-text sm:inline">
              {fullName ?? displayName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
