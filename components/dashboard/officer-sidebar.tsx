"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { FlexOfficersBadge } from "@/components/brand";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { officerSidebarItems } from "@/components/nav/nav-config";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string, match?: (pathname: string) => boolean) {
  if (match) {
    return match(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type OfficerSidebarProps = {
  badgeCounts?: Partial<Record<"notifications", number>>;
};

export function OfficerSidebar({ badgeCounts }: OfficerSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const displayName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Officer";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const imageUrl = user?.imageUrl ?? null;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen min-h-screen w-[250px] flex-col border-r border-slate-800/90 bg-[#040a14]/98 backdrop-blur-xl md:flex">
      <div className="border-b border-white/[0.06] px-3 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <FlexOfficersBadge
            height={72}
            transparent
            priority
            className="!h-[72px] !max-h-[72px] !w-auto shrink-0"
          />
          <span className="text-[1.125rem] font-bold leading-none tracking-tight">
            <span className="text-fo-primary-bright">Flex</span>
            <span className="text-slate-100">Officers</span>
          </span>
        </Link>
      </div>

      <nav
        aria-label="Officer dashboard"
        className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3"
      >
        {officerSidebarItems.map((item) => {
          const active = isActive(pathname, item.href, item.match);
          const Icon = item.icon;
          const badgeKey =
            item.href === "/officer/notifications" ? "notifications" : null;
          const badgeCount = badgeKey ? badgeCounts?.[badgeKey] : undefined;
          const showBadge = typeof badgeCount === "number" && badgeCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-9 items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "fo-nav-pill-active text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {showBadge ? (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] px-2.5 py-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-2.5 py-2.5">
          <ProfileAvatar name={displayName} src={imageUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-slate-200">
              {displayName}
            </p>
            {email ? (
              <p className="truncate text-[11px] text-slate-500">{email}</p>
            ) : null}
          </div>
        </div>

        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="flex min-h-9 w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[13px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200"
          >
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
