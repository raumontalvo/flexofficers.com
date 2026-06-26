import type { ReactNode } from "react";
import {
  FlexOfficersBadgeLink,
  FlexOfficersLogoLink,
} from "@/components/brand";
import { OfficerSidebar } from "@/components/dashboard/officer-sidebar";
import { cn } from "@/lib/cn";
import {
  MobileBottomNav,
  type MobileBottomNavRole,
} from "./mobile-bottom-nav";

type PageShellProps = {
  children: ReactNode;
  nav?: MobileBottomNavRole | "none";
  brand?: boolean;
  sidebar?: boolean;
  className?: string;
  contentClassName?: string;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "6xl";
};

const maxWidthClasses = {
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
  "6xl": "max-w-6xl",
};

export function PageShell({
  children,
  nav = "none",
  brand,
  sidebar = false,
  className,
  contentClassName,
  maxWidth = "6xl",
}: PageShellProps) {
  const showNav = nav !== "none";
  const showBrand = brand ?? (nav !== "none" && !sidebar);
  const showSidebar = sidebar && nav === "officer";

  if (showSidebar) {
    return (
      <div className={cn("min-h-screen bg-fo-bg text-fo-text", className)}>
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
          <OfficerSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-white/[0.04] px-4 py-4 md:hidden">
              <FlexOfficersBadgeLink href="/dashboard" height={40} transparent />
            </header>

            <main
              className={cn(
                "flex-1 px-4 py-6 sm:px-6 sm:py-8",
                showNav &&
                  "pb-[calc(var(--fo-nav-height)+env(safe-area-inset-bottom))] md:pb-8",
                contentClassName
              )}
            >
              <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}>
                {children}
              </div>
            </main>

            {showNav ? <MobileBottomNav role={nav} /> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-fo-bg text-fo-text", className)}>
      {showBrand ? (
        <header className="border-b border-white/[0.04] px-4 py-4 sm:px-6">
          <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}>
            <FlexOfficersBadgeLink href="/" height={40} className="md:hidden" />
            <FlexOfficersLogoLink
              href="/"
              height={40}
              className="hidden md:inline-flex"
            />
          </div>
        </header>
      ) : null}
      <main
        className={cn(
          "mx-auto w-full px-4 py-6 sm:px-6 sm:py-8",
          showNav && "pb-[calc(var(--fo-nav-height)+env(safe-area-inset-bottom))] md:pb-8",
          contentClassName
        )}
      >
        <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}>
          {children}
        </div>
      </main>

      {showNav ? <MobileBottomNav role={nav} /> : null}
    </div>
  );
}
