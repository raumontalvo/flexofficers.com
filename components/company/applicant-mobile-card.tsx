"use client";

import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { ProfileAvatar } from "@/components/ui";
import { MobileSecondaryButton } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  formatApplicantShiftSchedule,
  type SerializedCompanyApplicant,
} from "@/lib/company-applications-page";

function ApplicantStatusBadge({ status }: { status: ApplicationStatus }) {
  const styles = {
    [ApplicationStatus.PENDING]: "border-amber-500/25 bg-amber-500/10 text-amber-100",
    [ApplicationStatus.ACCEPTED]: "border-green-500/25 bg-green-500/10 text-green-100",
    [ApplicationStatus.REJECTED]: "border-red-500/25 bg-red-500/10 text-red-100",
    [ApplicationStatus.WITHDRAWN]: "border-white/10 bg-white/[0.04] text-fo-text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

function OfficerAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  if (photoUrl?.trim()) {
    return (
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return <ProfileAvatar name={name} size="md" className="!h-10 !w-10 !text-sm" />;
}

type ApplicantMobileCardProps = {
  application: SerializedCompanyApplicant;
  onView: () => void;
};

export function ApplicantMobileCard({
  application,
  onView,
}: ApplicantMobileCardProps) {
  const schedule = formatApplicantShiftSchedule(
    application.shiftStartTime,
    application.shiftEndTime
  );
  const locationLine = application.shiftLocationSubtext
    ? `${application.shiftLocationLabel} · ${application.shiftLocationSubtext}`
    : application.shiftLocationLabel;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]">
      <div className="flex items-start gap-3">
        <OfficerAvatar
          name={application.officerName}
          photoUrl={application.profilePhotoUrl}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fo-text">
            {application.officerName}
          </p>
          <div className="mt-1">
            <ApplicantStatusBadge status={application.status} />
          </div>
        </div>
      </div>

      <div className="mt-2.5 space-y-1">
        <p className="truncate text-sm font-medium text-fo-text">
          {application.shiftTitle}
        </p>
        <p className="truncate text-xs text-fo-text-muted">{locationLine}</p>
        <p className="text-xs text-fo-text-muted">
          {schedule.dateLabel} · {schedule.timeLabel}
        </p>
        <p className="text-xs text-fo-text-subtle">
          Applied {application.appliedDateLabel}
        </p>
      </div>

      <MobileSecondaryButton
        onClick={onView}
        className="mt-3 min-h-10 text-sm"
      >
        View Applicant
      </MobileSecondaryButton>
    </article>
  );
}
