import type { ReactNode } from "react";
import {
  FlexOfficersLogoLink,
} from "@/components/brand";
import { OfficerSidebar } from "@/components/dashboard/officer-sidebar";
import { CompanySidebar } from "@/components/dashboard/company-sidebar";
import { MobileDashboardHeader } from "@/components/dashboard/mobile-dashboard-header";
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
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "6xl" | "full";
};

const maxWidthClasses = {
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
  "6xl": "max-w-6xl",
  full: "max-w-none",
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
  const showSidebar = sidebar && (nav === "officer" || nav === "company");

  if (showSidebar) {
    const Sidebar = nav === "officer" ? OfficerSidebar : CompanySidebar;

    return (
      <div className={cn("fo-dashboard-shell min-h-screen overflow-x-hidden text-fo-text", className)}>
        <Sidebar />

        <div className="relative flex min-h-screen min-w-0 flex-col md:pl-[250px]">
          <div className="fo-dashboard-glow pointer-events-none fixed inset-y-0 right-0 left-0 md:left-[250px]" aria-hidden="true" />

          <MobileDashboardHeader role={nav} />

          <main
            className={cn(
              "relative min-w-0 flex-1 overflow-x-hidden px-4 py-3 sm:px-5 sm:py-5 lg:px-7 lg:py-6 md:pb-8",
              showNav && "fo-mobile-nav-scroll-padding",
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
    );
  }

  return (
    <div className={cn("min-h-screen bg-fo-bg text-fo-text", className)}>
      {showBrand ? (
        <header className="border-b border-white/[0.04] px-4 py-4 sm:px-6">
          <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}>
            <FlexOfficersLogoLink
              href="/"
              height={40}
              className="hidden md:inline-flex"
            />
            <FlexOfficersLogoLink
              href="/"
              height={56}
              className="inline-flex md:hidden"
            />
          </div>
        </header>
      ) : null}
      <main
        className={cn(
          "mx-auto w-full overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 md:pb-8",
          showNav && "fo-mobile-nav-scroll-padding",
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
