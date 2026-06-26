import type { ComponentType, SVGProps } from "react";
import {
  AcceptedIcon,
  ApplicantsIcon,
  BillingIcon,
  BrowseIcon,
  DashboardIcon,
  ProfileIcon,
  SearchIcon,
  ShiftsIcon,
} from "./icons";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  match?: (pathname: string) => boolean;
};

export const officerNavItems: NavItem[] = [
  {
    href: "/shifts",
    label: "Browse",
    icon: BrowseIcon,
    match: (pathname) =>
      pathname === "/shifts" || pathname.startsWith("/shifts/"),
  },
  {
    href: "/officer/applications",
    label: "My Shifts",
    icon: ShiftsIcon,
    match: (pathname) => pathname.startsWith("/officer/applications"),
  },
  {
    href: "/officer/accepted-shifts",
    label: "Accepted",
    icon: AcceptedIcon,
    match: (pathname) => pathname.startsWith("/officer/accepted-shifts"),
  },
  {
    href: "/officer/profile",
    label: "Profile",
    icon: ProfileIcon,
    match: (pathname) => pathname.startsWith("/officer/profile"),
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
