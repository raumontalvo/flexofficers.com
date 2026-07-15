import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </IconBase>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c0-2.5 2.2-4 5-4s5 1.5 5 4M17 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM14 19c0-1.8 1.5-3 3.5-3" />
    </IconBase>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function IconZap(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2 5 14h7l-1 8 8-12h-7l1-8Z" />
    </IconBase>
  );
}

export function IconShield(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

export function IconCard(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </IconBase>
  );
}

export function IconGift(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M12 10V20M4 10h16M12 10c-2-2-4-2-4-3s2-1 4 0 4 0 4-1 4 0-2 1-4 3M12 10c2-2 4-2 4-3s-2-1-4 0-4 0-4-1-4 0 2 1 4 3" />
    </IconBase>
  );
}

export function IconLayout(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

export function IconClock(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </IconBase>
  );
}

export function IconBell(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4a4 4 0 0 0-4 4v3.5L6 14h12l-2-2.5V8a4 4 0 0 0-4-4Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 12.5 11 14.5 15 10.5" />
      <circle cx="12" cy="12" r="9" />
    </IconBase>
  );
}

export function IconMessageCircle(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </IconBase>
  );
}

export function IconMail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </IconBase>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 4h2l1 4-2.2 1.2a12.5 12.5 0 0 0 5.3 5.3L14 12.5l4 1v2a2 2 0 0 1-2.2 2A15 15 0 0 1 4 6.2 2 2 0 0 1 6 4Z" />
    </IconBase>
  );
}

export function IconSpark(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </IconBase>
  );
}

export function IconUser(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </IconBase>
  );
}

export function IconIdCard(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9.5" cy="11" r="2" />
      <path d="M14 10h4M14 14h4M6.5 16c.8-1.2 2-2 3.5-2s2.7.8 3.5 2" />
    </IconBase>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

export function IconCircleSlash(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m5 5 14 14" />
    </IconBase>
  );
}

export function IconClipboard(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M8 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1" />
      <path d="M10 11h4M10 15h4" />
    </IconBase>
  );
}

export function IconDollar(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v18M9.5 7.5A3.5 3.5 0 0 1 14.5 9c0 2-2 2.5-2.5 3S9 15.5 9 17.5A3.5 3.5 0 0 0 14 19" />
    </IconBase>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 12a8 8 0 0 1 13.7-5.7" />
      <path d="M18 4v5h-5" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7" />
      <path d="M6 20v-5H1" />
    </IconBase>
  );
}

export function IconShieldAlert(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </IconBase>
  );
}

export function IconFilePen(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M10 13h4M10 17h2" />
    </IconBase>
  );
}

export function IconLock(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </IconBase>
  );
}

export function IconDatabase(props: IconProps) {
  return (
    <IconBase {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 14v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" />
    </IconBase>
  );
}

export function IconShieldLock(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <rect x="9.5" y="10" width="5" height="4" rx="1" />
      <path d="M11 10V9a1 1 0 0 1 2 0v1" />
    </IconBase>
  );
}

export function IconShare(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 3.9M15.4 6.6 8.6 10.5" />
    </IconBase>
  );
}

export function IconCookie(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v2M8.5 6.5l1.4 1.4M6 12h2M8.5 17.5l1.4-1.4M12 19v-2M15.5 17.5l-1.4-1.4M18 12h-2M15.5 6.5l-1.4 1.4" />
    </IconBase>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </IconBase>
  );
}
