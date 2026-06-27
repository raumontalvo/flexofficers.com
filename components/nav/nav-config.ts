import type { ComponentType, SVGProps } from "react";
import {
  AcceptedIcon,
  ApplicantsIcon,
  BillingIcon,
  BrowseIcon,
  DashboardIcon,
  NotificationsIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "./icons";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  match?: (pathname: string) => boolean;
};

export const officerNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: DashboardIcon,
    match: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/shifts",
    label: "Browse",
    icon: BrowseIcon,
    match: (pathname) =>
      pathname === "/shifts" || pathname.startsWith("/shifts/"),
  },
  {
    href: "/officer/applications",
    label: "Applications",
    icon: ShiftsIcon,
    match: (pathname) => pathname.startsWith("/officer/applications"),
  },
  {
    href: "/officer/profile",
    label: "Profile",
    icon: ProfileIcon,
    match: (pathname) => pathname.startsWith("/officer/profile"),
  },
];

export const officerSidebarItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    match: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/shifts",
    label: "Browse Shifts",
    icon: BrowseIcon,
    match: (pathname) =>
      pathname === "/shifts" || pathname.startsWith("/shifts/"),
  },
  {
    href: "/officer/applications",
    label: "Applications",
    icon: ShiftsIcon,
    match: (pathname) => pathname.startsWith("/officer/applications"),
  },
  {
    href: "/officer/accepted-shifts",
    label: "Accepted Shifts",
    icon: AcceptedIcon,
    match: (pathname) => pathname.startsWith("/officer/accepted-shifts"),
  },
  {
    href: "/officer/upcoming-shifts",
    label: "Upcoming Shifts",
    icon: UpcomingIcon,
    match: (pathname) => pathname.startsWith("/officer/upcoming-shifts"),
  },
  {
    href: "/officer/notifications",
    label: "Notifications",
    icon: NotificationsIcon,
    match: (pathname) => pathname.startsWith("/officer/notifications"),
  },
  {
    href: "/officer/profile",
    label: "My Profile",
    icon: ProfileIcon,
    match: (pathname) => pathname.startsWith("/officer/profile"),
  },
  {
    href: "/officer/settings",
    label: "Settings",
    icon: SettingsIcon,
    match: (pathname) => pathname.startsWith("/officer/settings"),
  },
];

export const companyNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    match: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/company/shifts",
    label: "Shifts",
    icon: ShiftsIcon,
    match: (pathname) => pathname.startsWith("/company/shifts"),
  },
  {
    href: "/company/applications",
    label: "Applicants",
    icon: ApplicantsIcon,
    match: (pathname) => pathname.startsWith("/company/applications"),
  },
  {
    href: "/company/officers",
    label: "Search",
    icon: SearchIcon,
    match: (pathname) => pathname.startsWith("/company/officers"),
  },
  {
    href: "/company/billing",
    label: "Billing",
    icon: BillingIcon,
    match: (pathname) => pathname.startsWith("/company/billing"),
  },
];
