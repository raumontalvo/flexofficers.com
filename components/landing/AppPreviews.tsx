import type { ReactNode } from "react";
import type { NavItem } from "@/components/nav/nav-config";
import { companyNavItems, officerNavItems } from "@/components/nav/nav-config";
import {
  ApplicantsIcon,
  BrowseIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { ShiftStatusBadge, StatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";

const PREVIEW_HEIGHT = "h-[400px]";

function isPreviewNavActive(activeHref: string, item: NavItem) {
  if (item.match) {
    return item.match(activeHref);
  }

  return activeHref === item.href || activeHref.startsWith(`${item.href}/`);
}

function PreviewBottomNav({
  role,
  activeHref,
}: {
  role: "officer" | "company";
  activeHref: string;
}) {
  const items = role === "officer" ? officerNavItems : companyNavItems;

  return (
    <nav
      aria-hidden
      className="shrink-0 border-t border-fo-border bg-fo-bg-elevated/95 px-1 pb-1.5 pt-1.5 backdrop-blur-md"
    >
      <div
        className={cn(
          "grid gap-1",
          items.length === 6 && "grid-cols-6",
          items.length === 7 && "grid-cols-7"
        )}
      >
        {items.map((item) => {
          const active = isPreviewNavActive(activeHref, item);
          const Icon = item.icon;

          return (
            <div
              key={item.href}
              className={cn(
                "flex min-h-[38px] flex-col items-center justify-center gap-0.5 rounded-2xl px-0.5 py-1 text-center",
                active
                  ? "bg-fo-primary/10 text-fo-primary-hover"
                  : "text-fo-text-subtle"
              )}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span className="max-w-full truncate text-[6px] font-medium leading-none sm:text-[7px]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function PreviewScreen({
  role,
  activeHref,
  children,
  header,
}: {
  role: "officer" | "company";
  activeHref: string;
  children: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col bg-fo-bg", PREVIEW_HEIGHT)}>
      {header}
      <div className="flex-1 space-y-2.5 overflow-hidden px-2.5 py-2.5">{children}</div>
      <PreviewBottomNav role={role} activeHref={activeHref} />
    </div>
  );
}

function PreviewGlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "fo-glass-card overflow-hidden rounded-2xl border border-white/10",
        className
      )}
    >
      {children}
    </article>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M8 14s4-3.5 4-6.5a4 4 0 1 0-8 0C4 10.5 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="7.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 2.5v2M11 2.5v2M2.5 6.5h11" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3.2l2 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PreviewAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-fo-primary/20 text-[8px] font-bold text-fo-primary-bright",
        className
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function PreviewTabPills({
  tabs,
  activeId,
}: {
  tabs: { id: string; label: string; selectedClass: string; unselectedClass: string }[];
  activeId: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {tabs.map((tab) => {
        const selected = tab.id === activeId;

        return (
          <div
            key={tab.id}
            className={cn(
              "rounded-full border px-1.5 py-0.5 text-center text-[6px] font-semibold leading-tight sm:text-[7px]",
              selected ? tab.selectedClass : tab.unselectedClass
            )}
          >
            {tab.label}
          </div>
        );
      })}
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "purple" | "green" | "blue" | "amber";
  icon: ReactNode;
}) {
  const toneClasses = {
    purple: "bg-violet-500/20 text-violet-300",
    green: "bg-emerald-500/20 text-emerald-300",
    blue: "bg-blue-500/20 text-blue-300",
    amber: "bg-amber-500/20 text-amber-300",
  } as const;

  return (
    <div className="fo-glass-card flex items-start gap-1.5 rounded-xl border border-white/10 p-2">
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
          toneClasses[tone]
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[6px] font-medium text-fo-text-muted">{label}</p>
        <p className="text-sm font-bold leading-none text-fo-text">{value}</p>
      </div>
    </div>
  );
}

function CompanyDashboardHeader() {
  return (
    <div className="mx-2 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#070f1c]/80 p-2.5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)]">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[7px] font-medium text-fo-text-muted">Good morning</p>
          <p className="mt-0.5 truncate text-[10px] font-extrabold text-fo-text">
            SecureCo LLC
          </p>
          <p className="mt-1 text-[6px] leading-snug text-fo-text-muted">
            Here&apos;s what&apos;s happening with your security operations today.
          </p>
        </div>
        <PreviewAvatar name="SecureCo LLC" className="h-8 w-8" />
      </div>
      <div className="mt-2 flex min-h-[26px] items-center justify-center rounded-xl bg-fo-primary-bright px-2 text-[7px] font-semibold text-white">
        Post a New Shift
      </div>
    </div>
  );
}

export function BrowsePreview() {
  return (
    <PreviewScreen role="officer" activeHref="/shifts">
      <PreviewGlassCard>
        <div className="space-y-2 p-2.5">
          <ShiftStatusBadge
            status="OPEN"
            className="!min-h-4 !w-fit !px-1.5 !py-0 !text-[7px]"
          />
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold leading-snug text-fo-text">
              Retail Security
            </p>
            <p className="text-[8px] font-semibold text-fo-primary-bright">
              SecureCo LLC
            </p>
          </div>
          <p className="flex items-center gap-1 text-[7px] text-fo-text-muted">
            <LocationIcon className="h-2.5 w-2.5 shrink-0 text-red-400" />
            <span className="truncate">Austin, TX</span>
          </p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-sm font-bold leading-none text-fo-primary-bright">
                $28
                <span className="text-[7px] font-semibold text-fo-text-muted">/hr</span>
              </p>
              <p className="mt-0.5 text-[6px] text-fo-text-muted">Est. $224</p>
            </div>
            <div className="rounded-lg border border-fo-primary-bright/40 bg-fo-primary/10 px-2 py-1 text-[6px] font-semibold text-fo-primary-bright">
              View Shift
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-white/[0.06] pt-2 text-[6px] text-fo-text-muted">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-2.5 w-2.5 text-fo-text-subtle" />
              Sat Mar 15
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-2.5 w-2.5 text-fo-text-subtle" />
              8:00 PM – 4:00 AM
            </span>
          </div>
        </div>
      </PreviewGlassCard>
      <PreviewGlassCard className="opacity-60">
        <div className="space-y-1 p-2.5">
          <ShiftStatusBadge
            status="OPEN"
            className="!min-h-4 !w-fit !px-1.5 !py-0 !text-[7px]"
          />
          <p className="text-[8px] font-bold text-fo-text">Overnight Patrol</p>
          <p className="text-[6px] text-fo-text-muted">$32/hr · Dallas, TX</p>
        </div>
      </PreviewGlassCard>
    </PreviewScreen>
  );
}

export function InvitesPreview() {
  return (
    <PreviewScreen role="officer" activeHref="/officer/invites">
      <PreviewTabPills
        activeId="pending"
        tabs={[
          {
            id: "all",
            label: "All",
            selectedClass: "border-blue-500/45 bg-blue-500/20 text-blue-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "pending",
            label: "Pending",
            selectedClass: "border-amber-500/45 bg-amber-500/20 text-amber-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "accepted",
            label: "Accepted",
            selectedClass: "border-green-500/45 bg-green-500/20 text-green-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "declined",
            label: "Declined",
            selectedClass: "border-red-500/45 bg-red-500/20 text-red-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
        ]}
      />
      <PreviewGlassCard>
        <div className="space-y-2 p-2.5">
          <div className="flex items-start gap-2">
            <PreviewAvatar name="SecureCo LLC" className="h-7 w-7" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <p className="truncate text-[8px] font-semibold text-fo-primary-bright">
                  SecureCo LLC
                </p>
                <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 text-[6px] font-semibold text-amber-200">
                  Pending
                </span>
              </div>
              <p className="mt-0.5 text-[9px] font-bold leading-snug text-fo-text">
                Retail Security
              </p>
              <p className="mt-0.5 text-[6px] text-fo-text-subtle">Invited 2h ago</p>
            </div>
          </div>
          <p className="flex items-center gap-1 text-[7px] text-fo-text-muted">
            <LocationIcon className="h-2.5 w-2.5 shrink-0 text-red-400" />
            <span className="truncate">Austin, TX</span>
          </p>
          <p className="text-sm font-bold leading-none text-fo-primary-bright">
            $28
            <span className="text-[7px] font-semibold text-fo-text-muted">/hr</span>
          </p>
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <div className="rounded-lg bg-fo-primary-bright py-1 text-center text-[6px] font-semibold text-white">
              Accept Invite
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] py-1 text-center text-[6px] font-semibold text-fo-text-muted">
              Decline Invite
            </div>
          </div>
        </div>
      </PreviewGlassCard>
    </PreviewScreen>
  );
}

export function DashboardPreview() {
  return (
    <PreviewScreen
      role="company"
      activeHref="/dashboard"
      header={<CompanyDashboardHeader />}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <MiniStatCard
          label="Total Shifts"
          value="12"
          tone="blue"
          icon={<ShiftsIcon className="h-3 w-3" />}
        />
        <MiniStatCard
          label="Applicants"
          value="8"
          tone="purple"
          icon={<ApplicantsIcon className="h-3 w-3" />}
         />
        <MiniStatCard
          label="Filled Shifts"
          value="5"
          tone="green"
          icon={<BrowseIcon className="h-3 w-3" />}
        />
        <MiniStatCard
          label="Upcoming"
          value="3"
          tone="amber"
          icon={<UpcomingIcon className="h-3 w-3" />}
        />
      </div>
    </PreviewScreen>
  );
}

export function ApplicantsPreview() {
  return (
    <PreviewScreen role="company" activeHref="/company/applications">
      <PreviewTabPills
        activeId="pending"
        tabs={[
          {
            id: "all",
            label: "Applicants",
            selectedClass: "border-blue-500/45 bg-blue-500/20 text-blue-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "pending",
            label: "Pending",
            selectedClass: "border-amber-500/45 bg-amber-500/20 text-amber-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "accepted",
            label: "Accepted",
            selectedClass: "border-green-500/45 bg-green-500/20 text-green-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "rejected",
            label: "Rejected",
            selectedClass: "border-red-500/45 bg-red-500/20 text-red-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
        ]}
      />
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]">
        <div className="flex items-start gap-2">
          <PreviewAvatar name="Jordan Lee" className="h-7 w-7" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-semibold text-fo-text">Jordan Lee</p>
            <span className="mt-0.5 inline-flex rounded-full border border-amber-500/25 bg-amber-500/10 px-1 py-0.5 text-[6px] font-semibold uppercase tracking-wide text-amber-100">
              Pending
            </span>
          </div>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-[8px] text-red-300">
            ×
          </div>
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="truncate text-[8px] font-medium text-fo-text">Retail Security</p>
          <p className="truncate text-[6px] text-fo-text-muted">Austin, TX · Downtown</p>
          <p className="text-[6px] text-fo-text-muted">Sat Mar 15 · 8:00 PM – 4:00 AM</p>
          <p className="text-[6px] text-fo-text-subtle">Applied Mar 14</p>
        </div>
        <div className="mt-2 flex min-h-[22px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[7px] font-semibold text-fo-text">
          View Applicant
        </div>
      </article>
    </PreviewScreen>
  );
}

export function AcceptedPreview() {
  return (
    <PreviewScreen role="officer" activeHref="/officer/accepted-shifts">
      <PreviewGlassCard>
        <div className="space-y-2 p-2.5">
          <div className="flex items-start justify-between gap-2">
            <StatusBadge
              variant="success"
              className="!min-h-4 !px-1.5 !py-0 !text-[6px]"
            >
              CONFIRMED
            </StatusBadge>
            <div className="text-right">
              <p className="text-sm font-bold leading-none text-fo-primary-bright">
                $28
                <span className="text-[7px] font-semibold text-fo-text-muted">/hr</span>
              </p>
              <p className="mt-0.5 text-[6px] text-fo-text-muted">Est. $224</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold leading-snug text-fo-text">
              Retail Security
            </p>
            <p className="truncate text-[7px] font-semibold text-fo-primary-bright">
              SecureCo LLC
            </p>
          </div>
          <p className="flex items-center gap-1 text-[7px] text-fo-text-muted">
            <LocationIcon className="h-2.5 w-2.5 shrink-0 text-red-400" />
            <span className="truncate">Austin, TX</span>
          </p>
          <p className="truncate text-[6px] text-fo-text-muted">
            Sat Mar 15 · 8:00 PM – 4:00 AM · Overnight
          </p>
          <div className="grid grid-cols-2 gap-1">
            <div className="rounded-lg border border-fo-primary-bright/40 bg-fo-primary/10 py-1 text-center text-[6px] font-semibold text-fo-primary-bright">
              View Shift
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] py-1 text-center text-[6px] font-semibold text-fo-text-muted">
              Contact
            </div>
          </div>
        </div>
      </PreviewGlassCard>
    </PreviewScreen>
  );
}

export function ShiftDetailPreview() {
  return (
    <PreviewScreen role="officer" activeHref="/shifts">
      <PreviewGlassCard>
        <div className="space-y-2 p-2.5">
          <div className="flex flex-wrap items-center gap-1">
            <ShiftStatusBadge
              status="OPEN"
              className="!min-h-4 !w-fit !px-1.5 !py-0 !text-[7px]"
            />
            <StatusBadge variant="info" className="!min-h-4 !px-1.5 !py-0 !text-[6px]">
              2 of 3 open
            </StatusBadge>
          </div>
          <p className="text-[9px] font-bold tracking-tight text-fo-text">
            Retail Security
          </p>
          <p className="text-sm font-bold text-fo-primary-bright">
            $28
            <span className="text-[7px] font-medium text-fo-text-muted">/hr</span>
          </p>
          <p className="text-[7px] text-fo-text-muted">Austin, TX</p>
          <p className="text-[7px] text-fo-text-muted">Sat 8:00 PM – 4:00 AM</p>
          <p className="text-[6px] leading-relaxed text-fo-text-subtle">
            Must have TX guard card. Retail experience preferred.
          </p>
          <div className="rounded-xl bg-fo-primary-bright py-1.5 text-center text-[7px] font-semibold text-white">
            Apply to Shift
          </div>
        </div>
      </PreviewGlassCard>
    </PreviewScreen>
  );
}

export function MyShiftsPreview() {
  return (
    <PreviewScreen role="officer" activeHref="/officer/applications">
      <PreviewTabPills
        activeId="pending"
        tabs={[
          {
            id: "all",
            label: "All",
            selectedClass: "border-blue-500/45 bg-blue-500/20 text-blue-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "pending",
            label: "Pending",
            selectedClass: "border-amber-500/45 bg-amber-500/20 text-amber-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "accepted",
            label: "Accepted",
            selectedClass: "border-green-500/45 bg-green-500/20 text-green-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
          {
            id: "rejected",
            label: "Rejected",
            selectedClass: "border-red-500/45 bg-red-500/20 text-red-100",
            unselectedClass: "border-white/10 bg-white/[0.03] text-fo-text-muted",
          },
        ]}
      />
      <PreviewGlassCard>
        <div className="space-y-1.5 p-2.5">
          <span className="inline-flex rounded-full border border-amber-500/25 bg-amber-500/10 px-1 py-0.5 text-[6px] font-semibold uppercase text-amber-100">
            Pending
          </span>
          <p className="text-[8px] font-bold text-fo-text">Retail Security</p>
          <p className="text-[7px] font-semibold text-fo-primary-bright">SecureCo LLC</p>
          <p className="text-[6px] text-fo-text-muted">Applied · Awaiting review</p>
        </div>
      </PreviewGlassCard>
    </PreviewScreen>
  );
}

export function ManageShiftsPreview() {
  return (
    <PreviewScreen role="company" activeHref="/company/shifts">
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]">
        <div className="flex items-start gap-2">
          <div className="flex w-9 shrink-0 flex-col items-center rounded-xl border border-fo-primary-bright/20 bg-fo-primary-bright/10 px-1.5 py-1.5 text-center">
            <span className="text-[6px] font-bold text-fo-primary-hover">SAT</span>
            <span className="text-[6px] font-bold leading-none text-fo-primary-hover">MAR</span>
            <span className="mt-0.5 text-[10px] font-bold leading-none text-fo-primary-hover">15</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-semibold text-fo-text">
              Overnight Patrol
            </p>
            <p className="mt-0.5 truncate text-[6px] text-fo-text-muted">
              Dallas, TX · Uptown
            </p>
            <p className="mt-1 text-[6px] text-fo-text-muted">10:00 PM – 6:00 AM (8h)</p>
            <p className="mt-0.5 text-[6px] text-fo-text-muted">2 open positions remaining</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-full border border-green-500/25 bg-green-500/10 px-1 py-0.5 text-[5.5px] font-semibold uppercase text-green-200">
              Open
            </span>
            <p className="text-[8px] font-bold text-fo-primary-bright">
              $32
              <span className="text-[6px] text-fo-text-muted">/hr</span>
            </p>
          </div>
        </div>
      </article>
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 opacity-70">
        <div className="flex items-start gap-2">
          <div className="flex w-9 shrink-0 flex-col items-center rounded-xl border border-fo-primary-bright/20 bg-fo-primary-bright/10 px-1.5 py-1.5 text-center">
            <span className="text-[6px] font-bold text-fo-primary-hover">FRI</span>
            <span className="text-[6px] font-bold leading-none text-fo-primary-hover">MAR</span>
            <span className="mt-0.5 text-[10px] font-bold leading-none text-fo-primary-hover">14</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-semibold text-fo-text">Event Security</p>
            <p className="mt-0.5 text-[6px] text-fo-text-muted">Filled · $26/hr</p>
          </div>
        </div>
      </article>
    </PreviewScreen>
  );
}

export function OfficerSearchPreview() {
  return (
    <PreviewScreen role="company" activeHref="/company/officers">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[6px] text-fo-text-subtle">
        Search: Austin · Armed · 3+ yrs
      </div>
      <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
        <div className="flex items-start gap-2">
          <PreviewAvatar name="Maria Santos" className="h-7 w-7" />
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold text-fo-text">Maria Santos</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-1 py-0.5 text-[5.5px] text-blue-100">
                Austin
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-1 py-0.5 text-[5.5px] text-fo-text-muted">
                Armed
              </span>
            </div>
            <p className="mt-1 text-[6px] text-fo-text-muted">5 yrs · Event Security</p>
          </div>
        </div>
        <div className="mt-2 flex min-h-[22px] items-center justify-center rounded-xl border border-fo-primary-bright/40 bg-fo-primary/10 text-[7px] font-semibold text-fo-primary-bright">
          View Profile
        </div>
      </article>
    </PreviewScreen>
  );
}

export function HirePreview() {
  return (
    <PreviewScreen role="company" activeHref="/company/applications">
      <article className="rounded-2xl border border-green-500/20 bg-white/[0.03] p-2.5">
        <div className="flex items-start gap-2">
          <PreviewAvatar name="Maria Santos" className="h-7 w-7" />
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold text-fo-text">Maria Santos</p>
            <span className="mt-0.5 inline-flex rounded-full border border-green-500/25 bg-green-500/10 px-1 py-0.5 text-[6px] font-semibold uppercase text-green-100">
              Accepted
            </span>
          </div>
        </div>
        <p className="mt-2 text-[7px] text-fo-text-muted">Retail Security · $28/hr</p>
        <p className="mt-1 text-[6px] font-medium text-emerald-300">
          Officer hired for shift
        </p>
      </article>
    </PreviewScreen>
  );
}
