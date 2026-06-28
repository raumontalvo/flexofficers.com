import Link from "next/link";
import { FlexOfficersBadge } from "@/components/brand";
import { NotificationsIcon } from "@/components/nav/icons";
import type { MobileBottomNavRole } from "@/components/ui/mobile-bottom-nav";

const notificationsHref: Record<MobileBottomNavRole, string> = {
  officer: "/officer/notifications",
  company: "/company/notifications",
};

type MobileDashboardHeaderProps = {
  role: MobileBottomNavRole;
};

export function MobileDashboardHeader({ role }: MobileDashboardHeaderProps) {
  return (
    <header className="relative flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 md:hidden">
      <Link href="/dashboard" className="inline-flex min-w-0 items-center gap-3">
        <FlexOfficersBadge height={56} transparent priority />
        <span className="truncate text-lg font-bold tracking-tight">
          <span className="text-fo-primary-bright">Flex</span>
          <span className="text-slate-100">Officers</span>
        </span>
      </Link>

      <Link
        href={notificationsHref[role]}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#070f1c]/60 text-fo-text-muted transition hover:border-fo-primary-bright/35 hover:text-fo-primary-hover"
        aria-label="Notifications"
      >
        <NotificationsIcon className="h-5 w-5" />
      </Link>
    </header>
  );
}
