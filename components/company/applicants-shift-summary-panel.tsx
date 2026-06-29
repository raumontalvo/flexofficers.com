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
    <div className="flex items-start justify-between gap-3 text-sm">
      <dt className="text-fo-text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-fo-text">{value}</dd>
    </div>
  );
}

function OverviewCard({
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
        "rounded-lg border px-3 py-2.5",
        toneClasses[tone]
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
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
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
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
        <section className="fo-glass-card rounded-xl border border-white/10 p-4">
          <p className="text-sm text-fo-text-muted">
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
    <div className="space-y-4 lg:sticky lg:top-6">
      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h2 className="text-base font-bold text-fo-text">Shift Details</h2>

        <dl className="mt-4 space-y-3">
          <SummaryRow label="Shift Title" value={selectedApplication.shiftTitle} />
          <div className="flex items-start justify-between gap-3 text-sm">
            <dt className="text-fo-text-muted">Status</dt>
            <dd>
              <ShiftStatusBadge status={selectedApplication.shiftStatus} />
            </dd>
          </div>
          <SummaryRow label="Date" value={schedule.dateLabel} />
          <SummaryRow label="Time" value={schedule.timeLabel} />
          <SummaryRow label="Location" value={locationLabel} />
          <SummaryRow
            label="Hourly Pay"
            value={`${formatHourlyRate(selectedApplication.shiftHourlyRate)}/hr`}
          />
          <SummaryRow
            label="Open Positions"
            value={String(selectedApplication.shiftPositionsNeeded)}
          />
        </dl>
      </section>

      <section className="fo-glass-card rounded-xl border border-white/10 p-4">
        <h3 className="text-base font-bold text-fo-text">Applicants Overview</h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <OverviewCard label="Total Applicants" value={overview.total} tone="default" />
          <OverviewCard label="Pending" value={overview.pending} tone="amber" />
          <OverviewCard label="Accepted" value={overview.accepted} tone="green" />
          <OverviewCard label="Rejected" value={overview.rejected} tone="red" />
        </div>

        <Link
          href="/company/shifts"
          className={buttonClassName({
            variant: "secondary",
            fullWidth: true,
            className: "mt-4 w-full",
          })}
        >
          Back to My Shifts
        </Link>
      </section>
    </div>
  );
}
