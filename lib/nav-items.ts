import type { ComponentType, SVGProps } from "react";
import {
  AcceptedIcon,
  ApplicantsIcon,
  BillingIcon,
  BrowseIcon,
  DashboardIcon,
  InvitesIcon,
  NotificationsIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  ShiftsIcon,
  StaffIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import type { LandingTranslations } from "@/lib/landing-i18n";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  match?: (pathname: string) => boolean;
};

export function getOfficerNavItems(labels: LandingTranslations["appNav"]["officerMobile"]): NavItem[] {
  return [
    {
      href: "/dashboard",
      label: labels.home,
      icon: DashboardIcon,
      match: (pathname) => pathname === "/dashboard",
    },
    {
      href: "/shifts",
      label: labels.browse,
      icon: BrowseIcon,
      match: (pathname) =>
        pathname === "/shifts" || pathname.startsWith("/shifts/"),
    },
    {
      href: "/officer/invites",
      label: labels.invites,
      icon: InvitesIcon,
      match: (pathname) => pathname.startsWith("/officer/invites"),
    },
    {
      href: "/officer/applications",
      label: labels.applications,
      icon: ShiftsIcon,
      match: (pathname) => pathname.startsWith("/officer/applications"),
    },
    {
      href: "/officer/profile",
      label: labels.profile,
      icon: ProfileIcon,
      match: (pathname) => pathname.startsWith("/officer/profile"),
    },
    {
      href: "/officer/settings",
      label: labels.settings,
      icon: SettingsIcon,
      match: (pathname) => pathname.startsWith("/officer/settings"),
    },
  ];
}

export function getOfficerSidebarItems(
  labels: LandingTranslations["appNav"]["officerSidebar"]
): NavItem[] {
  return [
    {
      href: "/dashboard",
      label: labels.dashboard,
      icon: DashboardIcon,
      match: (pathname) => pathname === "/dashboard",
    },
    {
      href: "/shifts",
      label: labels.browseShifts,
      icon: BrowseIcon,
      match: (pathname) =>
        pathname === "/shifts" || pathname.startsWith("/shifts/"),
    },
    {
      href: "/officer/invites",
      label: labels.companyInvites,
      icon: InvitesIcon,
      match: (pathname) => pathname.startsWith("/officer/invites"),
    },
    {
      href: "/officer/applications",
      label: labels.applications,
      icon: ShiftsIcon,
      match: (pathname) => pathname.startsWith("/officer/applications"),
    },
    {
      href: "/officer/accepted-shifts",
      label: labels.acceptedShifts,
      icon: AcceptedIcon,
      match: (pathname) => pathname.startsWith("/officer/accepted-shifts"),
    },
    {
      href: "/officer/upcoming-shifts",
      label: labels.upcomingShifts,
      icon: UpcomingIcon,
      match: (pathname) => pathname.startsWith("/officer/upcoming-shifts"),
    },
    {
      href: "/officer/notifications",
      label: labels.notifications,
      icon: NotificationsIcon,
      match: (pathname) => pathname.startsWith("/officer/notifications"),
    },
    {
      href: "/officer/profile",
      label: labels.myProfile,
      icon: ProfileIcon,
      match: (pathname) => pathname.startsWith("/officer/profile"),
    },
    {
      href: "/officer/settings",
      label: labels.settings,
      icon: SettingsIcon,
      match: (pathname) => pathname.startsWith("/officer/settings"),
    },
  ];
}

export function getCompanySidebarItems(
  labels: LandingTranslations["appNav"]["companySidebar"]
): NavItem[] {
  return [
    {
      href: "/dashboard",
      label: labels.home,
      icon: DashboardIcon,
      match: (pathname) => pathname === "/dashboard",
    },
    {
      href: "/shifts/create",
      label: labels.postShift,
      icon: ShiftsIcon,
      match: (pathname) => pathname === "/shifts/create",
    },
    {
      href: "/company/shifts",
      label: labels.myShifts,
      icon: UpcomingIcon,
      match: (pathname) => pathname.startsWith("/company/shifts"),
    },
    {
      href: "/company/applications",
      label: labels.applicants,
      icon: ApplicantsIcon,
      match: (pathname) => pathname.startsWith("/company/applications"),
    },
    {
      href: "/company/notifications",
      label: labels.notifications,
      icon: NotificationsIcon,
      match: (pathname) => pathname.startsWith("/company/notifications"),
    },
    {
      href: "/company/officers",
      label: labels.searchOfficers,
      icon: SearchIcon,
      match: (pathname) => pathname.startsWith("/company/officers"),
    },
    {
      href: "/company/staff",
      label: labels.staff,
      icon: StaffIcon,
      match: (pathname) => pathname.startsWith("/company/staff"),
    },
    {
      href: "/company/profile",
      label: labels.companyProfile,
      icon: ProfileIcon,
      match: (pathname) => pathname.startsWith("/company/profile"),
    },
    {
      href: "/company/billing",
      label: labels.billing,
      icon: BillingIcon,
      match: (pathname) => pathname.startsWith("/company/billing"),
    },
    {
      href: "/company/settings",
      label: labels.settings,
      icon: SettingsIcon,
      match: (pathname) => pathname.startsWith("/company/settings"),
    },
  ];
}

export function getCompanyNavItems(labels: LandingTranslations["appNav"]["companyMobile"]): NavItem[] {
  return [
    {
      href: "/dashboard",
      label: labels.home,
      icon: DashboardIcon,
      match: (pathname) => pathname === "/dashboard",
    },
    {
      href: "/company/shifts",
      label: labels.shifts,
      icon: ShiftsIcon,
      match: (pathname) => pathname.startsWith("/company/shifts"),
    },
    {
      href: "/company/applications",
      label: labels.applicants,
      icon: ApplicantsIcon,
      match: (pathname) => pathname.startsWith("/company/applications"),
    },
    {
      href: "/company/officers",
      label: labels.officers,
      icon: SearchIcon,
      match: (pathname) => pathname.startsWith("/company/officers"),
    },
    {
      href: "/company/staff",
      label: labels.staff,
      icon: StaffIcon,
      match: (pathname) => pathname.startsWith("/company/staff"),
    },
    {
      href: "/company/profile",
      label: labels.profile,
      icon: ProfileIcon,
      match: (pathname) => pathname.startsWith("/company/profile"),
    },
    {
      href: "/company/settings",
      label: labels.settings,
      icon: SettingsIcon,
      match: (pathname) =>
        pathname.startsWith("/company/settings") ||
        pathname.startsWith("/company/billing"),
    },
  ];
}
