import type { ReactNode } from "react";
import {
  ApplicationStatusBadge,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { cn } from "@/lib/cn";

function PreviewScreen({
  title,
  children,
  activeNav,
}: {
  title: string;
  children: ReactNode;
  activeNav?: "browse" | "shifts" | "dashboard" | "profile";
}) {
  const navItems = [
    { id: "browse" as const, label: "Browse" },
    { id: "shifts" as const, label: "Shifts" },
    { id: "dashboard" as const, label: "Home" },
    { id: "profile" as const, label: "Profile" },
  ];

  return (
    <div className="flex min-h-[300px] flex-col bg-fo-bg">
      <div className="border-b border-white/[0.05] px-3.5 py-2.5">
        <p className="text-[11px] font-bold tracking-tight text-fo-text">{title}</p>
      </div>
      <div className="flex-1 space-y-2.5 p-3">{children}</div>
      {activeNav ? (
        <div className="grid grid-cols-4 border-t border-white/[0.05] px-1 py-2">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "text-center text-[7px] font-medium",
                activeNav === item.id
                  ? "text-fo-primary-bright"
                  : "text-fo-text-subtle"
              )}
            >
              <div
                className={cn(
                  "mx-auto mb-0.5 h-1 w-4 rounded-full",
                  activeNav === item.id ? "bg-fo-primary-bright" : "bg-white/10"
                )}
              />
              {item.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PreviewCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-2 rounded-xl border border-white/[0.05] bg-fo-bg-elevated/80 p-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function PreviewButton({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "success" | "ghost";
}) {
  return (
    <div
      className={cn(
        "rounded-lg py-1.5 text-center text-[9px] font-semibold",
        variant === "primary" && "bg-fo-primary-bright text-white",
        variant === "success" && "bg-fo-success text-white",
        variant === "ghost" &&
          "border border-white/[0.06] bg-white/[0.03] text-fo-rejected"
      )}
    >
      {children}
    </div>
  );
}

export function BrowsePreview() {
  return (
    <PreviewScreen title="Available Shifts" activeNav="browse">
      <PreviewCard>
        <div className="flex flex-wrap items-center gap-1">
          <ShiftStatusBadge status="OPEN" className="scale-[0.72] origin-left" />
          <StatusBadge variant="info" className="scale-[0.68] origin-left">
            2 of 3 open
          </StatusBadge>
        </div>
        <p className="text-[11px] font-bold tracking-tight text-fo-text">
          Retail Security
        </p>
        <p className="text-sm font-bold text-fo-primary-bright">
          $28<span className="text-[9px] font-medium text-fo-text-muted">/hr</span>
        </p>
        <p className="text-[9px] text-fo-text-muted">Austin, TX · Sat 8:00 PM</p>
        <PreviewButton>View Shift</PreviewButton>
      </PreviewCard>
      <PreviewCard className="opacity-60">
        <ShiftStatusBadge status="OPEN" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Overnight Patrol</p>
        <p className="text-[9px] text-fo-text-muted">$32/hr · Dallas, TX</p>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function DashboardPreview() {
  return (
    <PreviewScreen title="Company Dashboard" activeNav="dashboard">
      <p className="text-[9px] text-fo-text-muted">Welcome back, Alex</p>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ["3", "Open"],
          ["5", "Pending"],
          ["2", "Accepted"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-lg border border-white/[0.05] bg-fo-bg-elevated/60 p-1.5 text-center"
          >
            <p className="text-sm font-bold text-fo-text">{value}</p>
            <p className="text-[7px] text-fo-text-muted">{label}</p>
          </div>
        ))}
      </div>
      <PreviewCard>
        <ShiftStatusBadge status="OPEN" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Retail Security</p>
        <p className="text-[9px] text-fo-text-muted">3 applicants · $28/hr</p>
      </PreviewCard>
      <PreviewButton>Post a Shift</PreviewButton>
    </PreviewScreen>
  );
}

export function ApplicantsPreview() {
  return (
    <PreviewScreen title="Applicants">
      <PreviewCard>
        <ApplicationStatusBadge status="PENDING" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Jordan Lee</p>
        <p className="text-[9px] text-fo-text-muted">Applied for: Retail Security</p>
        <p className="text-[8px] text-fo-text-subtle">5 yrs exp · Armed · Austin</p>
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <PreviewButton variant="success">Accept</PreviewButton>
          <PreviewButton variant="ghost">Reject</PreviewButton>
        </div>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function AcceptedPreview() {
  return (
    <PreviewScreen title="Accepted Shifts" activeNav="shifts">
      <PreviewCard className="border-green-500/15 bg-fo-success-bg/30">
        <ApplicationStatusBadge status="ACCEPTED" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Retail Security</p>
        <p className="text-sm font-bold text-fo-primary-bright">
          $28<span className="text-[9px] font-medium text-fo-text-muted">/hr</span>
        </p>
        <p className="text-[9px] text-fo-text-muted">Sat 8:00 PM – 4:00 AM</p>
        <div className="rounded-lg border border-green-500/15 bg-fo-success-bg/50 p-1.5">
          <p className="text-[8px] font-medium text-fo-success">
            Company contact unlocked
          </p>
          <p className="text-[8px] text-fo-text-muted">hello@secureco.com</p>
        </div>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function ShiftDetailPreview() {
  return (
    <PreviewScreen title="Shift Details">
      <PreviewCard>
        <div className="flex flex-wrap items-center gap-1">
          <ShiftStatusBadge status="OPEN" className="scale-[0.72] origin-left" />
          <StatusBadge variant="info" className="scale-[0.68] origin-left">
            2 of 3 open
          </StatusBadge>
        </div>
        <p className="text-[11px] font-bold tracking-tight text-fo-text">
          Retail Security
        </p>
        <p className="text-sm font-bold text-fo-primary-bright">
          $28<span className="text-[9px] font-medium text-fo-text-muted">/hr</span>
        </p>
        <p className="text-[9px] text-fo-text-muted">Austin, TX</p>
        <p className="text-[9px] text-fo-text-muted">Sat 8:00 PM – 4:00 AM</p>
        <p className="text-[8px] leading-relaxed text-fo-text-subtle">
          Must have TX guard card. Retail experience preferred.
        </p>
        <PreviewButton>Apply to Shift</PreviewButton>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function MyShiftsPreview() {
  return (
    <PreviewScreen title="My Shifts" activeNav="shifts">
      <PreviewCard>
        <StatusBadge variant="pending" className="scale-[0.72] origin-left">
          PENDING
        </StatusBadge>
        <p className="text-[10px] font-bold text-fo-text">Retail Security</p>
        <p className="text-[9px] text-fo-text-muted">Applied · $28/hr</p>
        <p className="text-[8px] text-fo-text-subtle">Awaiting company review</p>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function ManageShiftsPreview() {
  return (
    <PreviewScreen title="Manage Shifts">
      <PreviewCard>
        <ShiftStatusBadge status="OPEN" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Overnight Patrol</p>
        <p className="text-sm font-bold text-fo-primary-bright">
          $32<span className="text-[9px] font-medium text-fo-text-muted">/hr</span>
        </p>
        <p className="text-[9px] text-fo-text-muted">3 applicants · Dallas, TX</p>
      </PreviewCard>
      <PreviewCard className="opacity-70">
        <ShiftStatusBadge status="FILLED" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Event Security</p>
        <p className="text-[9px] text-fo-text-muted">Filled · $26/hr</p>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function OfficerSearchPreview() {
  return (
    <PreviewScreen title="Search Officers">
      <div className="rounded-lg border border-white/[0.05] bg-fo-bg-elevated/50 px-2 py-1.5 text-[8px] text-fo-text-subtle">
        Filter: Austin · Armed · 3+ yrs
      </div>
      <PreviewCard>
        <p className="text-[10px] font-bold text-fo-text">Maria Santos</p>
        <div className="flex flex-wrap gap-1">
          <StatusBadge variant="info" className="scale-[0.65] origin-left">
            Austin
          </StatusBadge>
          <StatusBadge variant="neutral" className="scale-[0.65] origin-left">
            Armed
          </StatusBadge>
        </div>
        <p className="text-[8px] text-fo-text-muted">5 yrs · Event Security</p>
        <PreviewButton>View Profile</PreviewButton>
      </PreviewCard>
    </PreviewScreen>
  );
}

export function HirePreview() {
  return (
    <PreviewScreen title="Applicants">
      <PreviewCard className="border-green-500/15">
        <ApplicationStatusBadge status="ACCEPTED" className="scale-[0.72] origin-left" />
        <p className="text-[10px] font-bold text-fo-text">Maria Santos</p>
        <p className="text-[9px] text-fo-text-muted">Retail Security · $28/hr</p>
        <p className="text-[8px] font-medium text-fo-success">
          Officer hired for shift
        </p>
      </PreviewCard>
    </PreviewScreen>
  );
}
