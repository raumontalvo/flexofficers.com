import type { ReactNode } from "react";
import Link from "next/link";
import { FlexOfficersBadge } from "@/components/brand";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { adminSidebarItems } from "@/components/nav/admin-nav-config";
import { cn } from "@/lib/cn";

type AdminShellProps = {
  children: ReactNode;
  className?: string;
};

export function AdminShell({ children, className }: AdminShellProps) {
  return (
    <div className={cn("fo-dashboard-shell min-h-screen overflow-x-hidden text-fo-text", className)}>
      <AdminSidebar />

      <div className="relative flex min-h-screen min-w-0 flex-col lg:pl-[250px]">
        <div
          className="fo-dashboard-glow pointer-events-none fixed inset-y-0 right-0 left-0 lg:left-[250px]"
          aria-hidden="true"
        />

        <header className="relative border-b border-white/[0.06] lg:hidden">
          <div className="px-4 py-4">
            <Link href="/admin" className="inline-flex items-center gap-3">
              <FlexOfficersBadge height={56} transparent priority />
              <span className="text-lg font-bold">
                <span className="text-fo-primary-bright">Flex</span>
                <span className="text-slate-100">Officers Admin</span>
              </span>
            </Link>
          </div>
          <nav
            aria-label="Admin mobile navigation"
            className="flex gap-2 overflow-x-auto border-t border-white/[0.06] px-4 py-2.5"
          >
            {adminSidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="relative min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
