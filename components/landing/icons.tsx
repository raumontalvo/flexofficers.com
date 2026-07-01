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

export function IconSpark(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </IconBase>
  );
}
