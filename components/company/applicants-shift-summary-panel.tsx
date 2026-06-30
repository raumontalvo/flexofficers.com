"use client";

import Link from "next/link";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { buttonClassName } from "@/components/ui";
import {
  formatApplicantShiftSchedule,
  getShiftApplicantOverview,
  type SerializedCompanyApplicant,
} from "@/lib/company-applications-page";
import { formatHourlyRate } from "@/lib/format-shift";
import { cn } from "@/lib/cn";

type ApplicantsShiftSummaryPanelProps = {
  applications: SerializedCompanyApplicant[];
  selectedApplication: SerializedCompanyApplicant | null;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-2 gap-y-0.5 text-[11px] leading-snug">
      <dt className="text-fo-text-muted">{label}</dt>
      <dd className="break-words font-medium text-fo-text">{value}</dd>
    </div>
  );
}

function OverviewStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "default" | "amber" | "green" | "red";
}) {
  const toneClasses = {
    default: "border-white/10 bg-white/[0.03] text-fo-text",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-100",
    green: "border-green-500/20 bg-green-500/10 text-green-100",
    red: "border-red-500/20 bg-red-500/10 text-red-100",
  } as const;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border px-2 py-1.5",
        toneClasses[tone]
      )}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

function ShiftStatusBadge({ status }: { status: ShiftStatus }) {
  const styles = {
    [ShiftStatus.OPEN]: "border-green-500/25 bg-green-500/10 text-green-200",
    [ShiftStatus.INVITED]: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    [ShiftStatus.PARTIALLY_FILLED]:
      "border-blue-500/25 bg-blue-500/10 text-blue-100",
    [ShiftStatus.FILLED]: "border-blue-500/25 bg-blue-500/10 text-blue-100",
    [ShiftStatus.CANCELLED]: "border-red-500/20 bg-white/[0.04] text-fo-text-muted",
    [ShiftStatus.COMPLETED]: "border-blue-500/20 bg-white/[0.04] text-fo-text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        styles[status] ?? styles[ShiftStatus.COMPLETED]
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function ApplicantsShiftSummaryPanel({
  applications,
  selectedApplication,
}: ApplicantsShiftSummaryPanelProps) {
  if (!selectedApplication) {
    return (
      <div className="lg:sticky lg:top-6">
        <section className="fo-glass-card rounded-lg border border-white/10 p-2.5">
          <p className="text-[11px] leading-snug text-fo-text-muted">
            Select an applicant to view shift details.
          </p>
        </section>
      </div>
    );
  }

  const schedule = formatApplicantShiftSchedule(
    selectedApplication.shiftStartTime,
    selectedApplication.shiftEndTime
  );
  const overview = getShiftApplicantOverview(
    applications,
    selectedApplication.shiftId
  );
  const locationLabel = selectedApplication.shiftLocationSubtext
    ? `${selectedApplication.shiftLocationLabel} · ${selectedApplication.shiftLocationSubtext}`
    : selectedApplication.shiftLocationLabel;

  return (
    <div className="space-y-2.5 lg:sticky lg:top-6">
      <section className="fo-glass-card rounded-lg border border-white/10 p-2.5">
        <h2 className="text-xs font-semibold text-fo-text">Shift Details</h2>

        <dl className="mt-2 space-y-1.5">
          <SummaryRow label="Shift" value={selectedApplication.shiftTitle} />
          <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-2 text-[11px]">
            <dt className="text-fo-text-muted">Status</dt>
            <dd>
              <ShiftStatusBadge status={selectedApplication.shiftStatus} />
            </dd>
          </div>
          <SummaryRow label="Date" value={schedule.dateLabel} />
          <SummaryRow label="Time" value={schedule.timeLabel} />
          <SummaryRow label="Location" value={locationLabel} />
          <SummaryRow
            label="Pay"
            value={`${formatHourlyRate(selectedApplication.shiftHourlyRate)}/hr`}
          />
          <SummaryRow
            label="Open"
            value={String(selectedApplication.shiftPositionsNeeded)}
          />
        </dl>
      </section>

      <section className="fo-glass-card rounded-lg border border-white/10 p-2.5">
        <h3 className="text-xs font-semibold text-fo-text">Applicants Overview</h3>

        <div className="mt-2 space-y-1.5">
          <OverviewStat label="Total" value={overview.total} tone="default" />
          <OverviewStat label="Pending" value={overview.pending} tone="amber" />
          <OverviewStat label="Accepted" value={overview.accepted} tone="green" />
          <OverviewStat label="Rejected" value={overview.rejected} tone="red" />
        </div>

        <Link
          href="/company/shifts"
          className={buttonClassName({
            variant: "secondary",
            fullWidth: true,
            size: "md",
            className: "mt-2.5 min-h-8 w-full text-[11px]",
          })}
        >
          Back to My Shifts
        </Link>
      </section>
    </div>
  );
}
