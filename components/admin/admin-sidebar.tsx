"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { FlexOfficersBadge } from "@/components/brand";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import {
  ApplicantsIcon,
  AuditIcon,
  CompaniesIcon,
  DashboardIcon,
  ProfileIcon,
  ReportsIcon,
  SettingsIcon,
  ShiftsIcon,
} from "@/components/nav/icons";
import { cn } from "@/lib/cn";
import { getAdminSidebarItems } from "@/lib/i18n/ui-labels";

const ADMIN_ICONS = {
  "/admin": DashboardIcon,
  "/admin/companies": CompaniesIcon,
  "/admin/officers": ProfileIcon,
  "/admin/shifts": ShiftsIcon,
  "/admin/applications": ApplicantsIcon,
  "/admin/reports": ReportsIcon,
  "/admin/audit-logs": AuditIcon,
  "/admin/settings": SettingsIcon,
} as const;

function isActive(pathname: string, href: string, match?: (pathname: string) => boolean) {
  if (match) {
    return match(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { t } = useLandingLanguage();
  const adminCopy = t.admin;
  const navItems = getAdminSidebarItems(t);

  const displayName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    adminCopy.fallbackName;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const imageUrl = user?.imageUrl ?? null;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen min-h-screen w-[250px] flex-col border-r border-slate-800/90 bg-[#040a14]/98 backdrop-blur-xl lg:flex">
      <div className="border-b border-white/[0.06] px-3 py-3">
        <Link href="/admin" className="flex items-center gap-2.5">
          <FlexOfficersBadge
            height={72}
            transparent
            priority
            className="!h-[72px] !max-h-[72px] !w-auto shrink-0"
          />
          <div className="min-w-0">
            <span className="block text-[1.125rem] font-bold leading-none tracking-tight">
              <span className="text-fo-primary-bright">Flex</span>
              <span className="text-slate-100">Officers</span>
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {adminCopy.badge}
            </span>
          </div>
        </Link>
      </div>

      <nav
        aria-label={adminCopy.navAria}
        className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3"
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.match);
          const Icon = ADMIN_ICONS[item.href as keyof typeof ADMIN_ICONS];

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
        <SignOutButton>
          <button
            type="button"
            className="w-full rounded-xl border border-white/[0.08] px-3 py-2 text-[12px] font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
          >
            {adminCopy.signOut}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
