export type LandingPhoneScreenshot = {
  /** Screen name shown below the phone frame */
  label: string;
  /** Path under /public, e.g. /landing/screenshots/officer/browse-shifts.png */
  src: string;
  alt: string;
};

/**
 * Landing hero phone screenshots.
 *
 * Replace images in public/landing/screenshots/{officer,company}/ to update the showcase.
 * Re-capture with: npm run capture:landing-screenshots
 */
export const OFFICER_LANDING_SCREENSHOTS: LandingPhoneScreenshot[] = [
  {
    label: "Browse Shifts",
    src: "/landing/screenshots/officer/browse-shifts.png",
    alt: "FlexOfficers officer browse shifts screen",
  },
  {
    label: "Company Invites",
    src: "/landing/screenshots/officer/company-invites.png",
    alt: "FlexOfficers officer company invites screen",
  },
  {
    label: "Accepted Shifts",
    src: "/landing/screenshots/officer/accepted-shifts.png",
    alt: "FlexOfficers officer accepted shifts screen",
  },
  {
    label: "Profile",
    src: "/landing/screenshots/officer/profile.png",
    alt: "FlexOfficers officer profile screen",
  },
];

export const COMPANY_LANDING_SCREENSHOTS: LandingPhoneScreenshot[] = [
  {
    label: "Dashboard",
    src: "/landing/screenshots/company/dashboard.png",
    alt: "FlexOfficers company dashboard screen",
  },
  {
    label: "My Shifts",
    src: "/landing/screenshots/company/my-shifts.png",
    alt: "FlexOfficers company my shifts screen",
  },
  {
    label: "Applicants",
    src: "/landing/screenshots/company/applicants.png",
    alt: "FlexOfficers company applicants screen",
  },
  {
    label: "Staff",
    src: "/landing/screenshots/company/staff.png",
    alt: "FlexOfficers company staff screen",
  },
];

/** Milliseconds between automatic screenshot transitions */
export const LANDING_PHONE_CYCLE_MS = 4000;
