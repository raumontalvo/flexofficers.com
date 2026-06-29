import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function BrowseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function ShiftsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </IconBase>
  );
}

export function InvitesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7.5h16M4 12h10M4 16.5h7" />
      <path d="M17.5 11.5 20 14l-4 4" />
    </IconBase>
  );
}

export function AcceptedIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 12.5 11 14.5 15 10.5" />
      <circle cx="12" cy="12" r="9" />
    </IconBase>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" />
    </IconBase>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

export function ApplicantsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M4 19c0-2.5 2.2-4 5-4s5 1.5 5 4M14 19c0-1.8 1.4-3 3.5-3" />
    </IconBase>
  );
}

export function StaffIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M4.5 18.5c.8-2.2 2.4-3.5 4.5-3.5s3.7 1.3 4.5 3.5" />
      <path d="M14.5 17.5c.5-1.4 1.5-2.2 2.8-2.2" />
    </IconBase>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function BillingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </IconBase>
  );
}

export function UpcomingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16M8 14h2M12 14h4" />
    </IconBase>
  );
}

export function MessagesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
    </IconBase>
  );
}

export function NotificationsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4a4 4 0 0 1 4 4v2.5c0 .8.3 1.6.8 2.2L18 15H6l1.2-2.3c.5-.6.8-1.4.8-2.2V8a4 4 0 0 1 4-4z" />
      <path d="M10 17a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </IconBase>
  );
}

export function CompaniesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" />
    </IconBase>
  );
}

export function ReportsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 19V9M10 19V5M15 19v-7M20 19V3" />
    </IconBase>
  );
}

export function AuditIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </IconBase>
  );
}
