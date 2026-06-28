"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/components/nav/nav-config";
import { companyNavItems, officerNavItems } from "@/components/nav/nav-config";
import { cn } from "@/lib/cn";

export type MobileBottomNavRole = "officer" | "company";

type MobileBottomNavProps = {
  role: MobileBottomNavRole;
  items?: NavItem[];
  className?: string;
};

function isActive(pathname: string, item: NavItem) {
  if (item.match) {
    return item.match(pathname);
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function MobileBottomNav({
  role,
  items,
  className,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const navItems =
    items ?? (role === "officer" ? officerNavItems : companyNavItems);

  return (
    <nav
      aria-label={role === "officer" ? "Officer navigation" : "Company navigation"}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-fo-border bg-fo-bg-elevated/95 backdrop-blur-md md:hidden",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-lg gap-1 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2",
          navItems.length === 4 && "grid-cols-4",
          navItems.length === 5 && "grid-cols-5",
          navItems.length === 6 && "grid-cols-6",
          navItems.length === 7 && "grid-cols-7"
        )}
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition",
                active
                  ? "bg-fo-primary/10 text-fo-primary-hover"
                  : "text-fo-text-subtle hover:bg-fo-surface hover:text-fo-text-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
