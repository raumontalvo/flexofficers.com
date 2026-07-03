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

export type NavSection = {
  title?: string;
  items: NavItem[];
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
      href: "/company/leads",
      label: labels.securityLeads,
      icon: BrowseIcon,
      match: (pathname) =>
        pathname === "/company/leads" ||
        pathname.startsWith("/company/leads/"),
    },
    {
      href: "/company/lead-applications",
      label: labels.leadApplications,
      icon: AcceptedIcon,
      match: (pathname) => pathname.startsWith("/company/lead-applications"),
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

export function getClientNavItems(
  labels: LandingTranslations["appNav"]["clientMobile"]
): NavItem[] {
  return [
    {
      href: "/client",
      label: labels.home,
      icon: DashboardIcon,
      match: (pathname) => pathname === "/client",
    },
    {
      href: "/client/leads",
      label: labels.leads,
      icon: ShiftsIcon,
      match: (pathname) =>
        pathname === "/client/leads" ||
        pathname.startsWith("/client/leads/"),
    },
    {
      href: "/client/applicants",
      label: labels.applicants,
      icon: ApplicantsIcon,
      match: (pathname) => pathname.startsWith("/client/applicants"),
    },
    {
      href: "/client/profile",
      label: labels.profile,
      icon: ProfileIcon,
      match: (pathname) => pathname.startsWith("/client/profile"),
    },
    {
      href: "/client/settings",
      label: labels.settings,
      icon: SettingsIcon,
      match: (pathname) => pathname.startsWith("/client/settings"),
    },
  ];
}

export function getClientSidebarSections(
  sidebar: LandingTranslations["client"]["sidebar"],
  nav: LandingTranslations["appNav"]["clientSidebar"]
): NavSection[] {
  return [
    {
      title: sidebar.portal,
      items: [
        {
          href: "/client",
          label: nav.dashboard,
          icon: DashboardIcon,
          match: (pathname) => pathname === "/client",
        },
        {
          href: "/client/leads",
          label: sidebar.mySecurityRequests,
          icon: ShiftsIcon,
          match: (pathname) =>
            pathname === "/client/leads" ||
            (pathname.startsWith("/client/leads/") &&
              !pathname.startsWith("/client/leads/new")),
        },
        {
          href: "/client/applicants",
          label: sidebar.myLeadApplications,
          icon: ApplicantsIcon,
          match: (pathname) => pathname.startsWith("/client/applicants"),
        },
      ],
    },
    {
      title: sidebar.account,
      items: [
        {
          href: "/client/profile",
          label: nav.profile,
          icon: ProfileIcon,
          match: (pathname) => pathname.startsWith("/client/profile"),
        },
        {
          href: "/client/billing",
          label: sidebar.paymentMethods,
          icon: BillingIcon,
          match: (pathname) => pathname.startsWith("/client/billing"),
        },
        {
          href: "/client/billing#history",
          label: sidebar.billingHistory,
          icon: AcceptedIcon,
          match: (pathname) => pathname.startsWith("/client/billing"),
        },
        {
          href: "/client/settings",
          label: nav.settings,
          icon: SettingsIcon,
          match: (pathname) => pathname.startsWith("/client/settings"),
        },
      ],
    },
    {
      title: sidebar.help,
      items: [
        {
          href: "/contact",
          label: sidebar.helpCenter,
          icon: BrowseIcon,
          match: (pathname) => pathname === "/contact",
        },
        {
          href: "/contact",
          label: sidebar.contactSupport,
          icon: InvitesIcon,
          match: (pathname) => pathname === "/contact",
        },
      ],
    },
  ];
}

export function getClientSidebarItems(
  labels: LandingTranslations["appNav"]["clientSidebar"]
): NavItem[] {
  return [
    {
      href: "/client",
      label: labels.dashboard,
      icon: DashboardIcon,
      match: (pathname) => pathname === "/client",
    },
    {
      href: "/client/leads",
      label: labels.myLeads,
      icon: ShiftsIcon,
      match: (pathname) =>
        pathname === "/client/leads" ||
        (pathname.startsWith("/client/leads/") &&
          !pathname.startsWith("/client/leads/new")),
    },
    {
      href: "/client/leads/new",
      label: labels.createLead,
      icon: BrowseIcon,
      match: (pathname) => pathname.startsWith("/client/leads/new"),
    },
    {
      href: "/client/applicants",
      label: labels.applicants,
      icon: ApplicantsIcon,
      match: (pathname) => pathname.startsWith("/client/applicants"),
    },
    {
      href: "/client/profile",
      label: labels.profile,
      icon: ProfileIcon,
      match: (pathname) => pathname.startsWith("/client/profile"),
    },
    {
      href: "/client/settings",
      label: labels.settings,
      icon: SettingsIcon,
      match: (pathname) => pathname.startsWith("/client/settings"),
    },
  ];
}
