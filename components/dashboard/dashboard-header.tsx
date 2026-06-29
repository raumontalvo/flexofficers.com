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
  const avatarName = fullName ?? displayName;

  return (
    <header className={cn("fo-dashboard-header px-3 py-3 sm:px-4 sm:py-3.5", className)}>
      <div className="flex items-center justify-between gap-4 md:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-fo-text-muted">Welcome back,</p>
          <h1 className="truncate text-[1.35rem] font-extrabold tracking-tight text-fo-text">
            {displayName}{" "}
            <span aria-hidden="true" className="inline-block">
              👋
            </span>
          </h1>
        </div>

        <Link
          href="/officer/profile"
          className="shrink-0 rounded-full shadow-[0_10px_28px_-6px_rgba(0,0,0,0.55)] transition"
          aria-label="View profile"
        >
          <ProfileAvatar
            name={avatarName}
            src={imageUrl}
            className="!h-[5.625rem] !w-[5.625rem] !border-0 !text-2xl"
          />
        </Link>
      </div>

      <div className="hidden items-center justify-between gap-3 md:flex">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-fo-text-muted">Welcome back,</p>
          <h1 className="truncate text-[1.35rem] font-bold tracking-tight text-fo-text">
            {displayName}{" "}
            <span aria-hidden="true" className="inline-block">
              👋
            </span>
          </h1>
          <p className="text-xs text-fo-text-muted">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/officer/notifications"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
            aria-label="Notifications"
          >
            <NotificationsIcon className="h-4 w-4" />
          </Link>

          <Link
            href="/officer/profile"
            className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-[#070f1c]/60 py-1 pl-1 pr-3 transition hover:border-fo-primary-bright/35"
          >
            <ProfileAvatar
              name={avatarName}
              src={imageUrl}
              size="sm"
              className="!h-8 !w-8 !text-xs"
            />
            <span className="max-w-[7rem] truncate text-xs font-semibold text-fo-text">
              {avatarName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
