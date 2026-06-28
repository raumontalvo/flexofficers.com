import type { NavItem } from "./nav-config";
import {
  ApplicantsIcon,
  AuditIcon,
  CompaniesIcon,
  DashboardIcon,
  ProfileIcon,
  ReportsIcon,
  SettingsIcon,
  ShiftsIcon,
} from "./icons";

export const adminSidebarItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: DashboardIcon,
    match: (pathname) => pathname === "/admin",
  },
  {
    href: "/admin/companies",
    label: "Companies",
    icon: CompaniesIcon,
    match: (pathname) => pathname.startsWith("/admin/companies"),
  },
  {
    href: "/admin/officers",
    label: "Officers",
    icon: ProfileIcon,
    match: (pathname) => pathname.startsWith("/admin/officers"),
  },
  {
    href: "/admin/shifts",
    label: "Shifts",
    icon: ShiftsIcon,
    match: (pathname) => pathname.startsWith("/admin/shifts"),
  },
  {
    href: "/admin/applications",
    label: "Applications",
    icon: ApplicantsIcon,
    match: (pathname) => pathname.startsWith("/admin/applications"),
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: ReportsIcon,
    match: (pathname) => pathname.startsWith("/admin/reports"),
  },
  {
    href: "/admin/audit-logs",
    label: "Audit Logs",
    icon: AuditIcon,
    match: (pathname) => pathname.startsWith("/admin/audit-logs"),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: SettingsIcon,
    match: (pathname) => pathname.startsWith("/admin/settings"),
  },
];
