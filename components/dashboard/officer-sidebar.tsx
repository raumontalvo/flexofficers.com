"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { FlexOfficersBadge } from "@/components/brand";
import { officerSidebarItems } from "@/components/nav/nav-config";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string, match?: (pathname: string) => boolean) {
  if (match) {
    return match(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function OfficerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/[0.06] bg-fo-bg-elevated/40 backdrop-blur-xl md:flex md:flex-col">
      <div className="border-b border-white/[0.06] px-6 py-6">
        <Link href="/dashboard" className="inline-flex items-center">
          <FlexOfficersBadge height={48} transparent priority />
        </Link>
      </div>

      <nav aria-label="Officer dashboard" className="flex-1 space-y-1 px-4 py-5">
        {officerSidebarItems.map((item) => {
          const active = isActive(pathname, item.href, item.match);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-fo-primary/15 text-fo-primary-hover shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
                  : "text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] px-4 py-5">
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
          >
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
