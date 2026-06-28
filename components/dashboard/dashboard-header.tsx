"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { NotificationsIcon, SearchIcon } from "@/components/nav/icons";
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
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/shifts");
  }

  const displayName = firstName?.trim() || "Officer";

  return (
    <header className={cn("fo-dashboard-header px-3 py-3 sm:px-4 sm:py-3.5", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
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

        <form
          onSubmit={handleSearch}
          className="w-full lg:max-w-xs lg:flex-1 xl:max-w-sm"
        >
          <label htmlFor="dashboard-search" className="sr-only">
            Search shifts and companies
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fo-text-subtle" />
            <input
              id="dashboard-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shifts, companies..."
              className="h-9 w-full rounded-xl border border-white/10 bg-[#070f1c]/80 py-1.5 pl-9 pr-3 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20"
            />
          </div>
        </form>

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
