"use client";

import { useEffect, useMemo, useState } from "react";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { Button, ProfileAvatar, StatusBadge } from "@/components/ui";
import { MobileSecondaryButton } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  getShiftApplicantOverview,
  type SerializedCompanyApplicant,
} from "@/lib/company-applications-page";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";

type ApplicationReviewPanelProps = {
  application: SerializedCompanyApplicant | null;
  allApplications?: SerializedCompanyApplicant[];
  onClose: () => void;
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-fo-text">{value?.trim() || "Not provided"}</dd>
    </div>
  );
}

function TagList({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
        {label}
      </p>
      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-100"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-fo-text-muted">Not provided</p>
      )}
    </div>
  );
}

function ShiftStatusBadge({ status }: { status: ShiftStatus }) {
  const variant =
    status === ShiftStatus.OPEN
      ? "success"
      : status === ShiftStatus.FILLED
        ? "info"
        : status === ShiftStatus.CANCELLED
          ? "rejected"
          : "neutral";

  return <StatusBadge variant={variant}>{status}</StatusBadge>;
}

function CompactInfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="w-5 shrink-0 text-base leading-none" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-muted">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-fo-text">{value}</p>
      </div>
    </div>
  );
}

function OverviewStatCard({
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
    <div className={cn("rounded-xl border px-2.5 py-2", toneClasses[tone])}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-bold leading-none">{value}</p>
    </div>
  );
}

function MobileShiftDetailsSection({
  application,
  overview,
}: {
  application: SerializedCompanyApplicant;
  overview: ReturnType<typeof getShiftApplicantOverview>;
}) {
  return (
    <div className="space-y-3 lg:hidden">
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <h3 className="text-sm font-bold text-fo-text">Shift Details</h3>
        <div className="mt-2 divide-y divide-white/[0.06]">
          <CompactInfoRow
            icon="📅"
            label="Date"
            value={application.appliedShift.dateLabel}
          />
          <CompactInfoRow
            icon="🕒"
            label="Time"
            value={application.appliedShift.timeLabel}
          />
          <CompactInfoRow
            icon="📍"
            label="Location"
            value={application.appliedShift.locationLabel}
          />
          <CompactInfoRow
            icon="💵"
            label="Pay"
            value={application.appliedShift.payRateLabel}
          />
          <CompactInfoRow
            icon="👥"
            label="Open Positions"
            value={String(application.appliedShift.openPositions)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <h3 className="text-sm font-bold text-fo-text">Applicants Overview</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <OverviewStatCard label="Total" value={overview.total} tone="default" />
          <OverviewStatCard label="Pending" value={overview.pending} tone="amber" />
          <OverviewStatCard label="Accepted" value={overview.accepted} tone="green" />
          <OverviewStatCard label="Rejected" value={overview.rejected} tone="red" />
        </div>
      </section>
    </div>
  );
}

export function ApplicationReviewPanel({
  application,
  allApplications = [],
  onClose,
}: ApplicationReviewPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (application) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [application, onClose]);

  async function updateStatus(nextStatus: "ACCEPTED" | "REJECTED") {
    if (!application) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
          status: nextStatus,
        }),
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      alert(data?.error || "Failed to update applicant");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isPending = application?.status === ApplicationStatus.PENDING;
  const shiftOverview = useMemo(() => {
    if (!application) {
      return null;
    }

    return getShiftApplicantOverview(allApplications, application.shiftId);
  }, [allApplications, application]);

  return (
    <>
      <button
        type="button"
        aria-label="Close applicant review panel"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity lg:block",
          application ? "opacity-100" : "pointer-events-none opacity-0",
          "max-lg:pointer-events-none max-lg:opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-[#07101c]/98 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:inset-y-0 lg:left-auto lg:w-full lg:max-w-xl lg:border-l lg:border-white/10",
          application ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!application}
      >
        {application ? (
          <>
            <div className="border-b border-white/[0.06] px-4 py-3.5 lg:px-5 lg:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-fo-text">
                    Applicant Review
                  </h2>
                  <p className="mt-1 truncate text-sm text-fo-text-muted">
                    {application.officerProfile.name} · {application.appliedShift.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1.5 text-sm text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3.5 lg:space-y-4 lg:px-5 lg:py-4">
              {shiftOverview ? (
                <MobileShiftDetailsSection
                  application={application}
                  overview={shiftOverview}
                />
              ) : null}

              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 lg:p-4">
                <div className="flex items-start gap-3">
                  <ProfileAvatar
                    name={application.officerProfile.name}
                    src={application.officerProfile.profilePhotoUrl}
                    size="md"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-fo-text">
                      Officer Profile
                    </h3>
                    <p className="mt-0.5 text-xs text-fo-text-muted">
                      Self-reported information submitted by the officer.
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailField label="Name" value={application.officerProfile.name} />
                  <DetailField label="Email" value={application.officerProfile.email} />
                  <DetailField label="Phone" value={application.officerProfile.phone} />
                  <DetailField
                    label="City, State"
                    value={application.officerProfile.cityStateLabel}
                  />
                  <DetailField
                    label="Years of Experience"
                    value={application.officerProfile.experienceYearsLabel}
                  />
                  <DetailField
                    label="Armed / Unarmed"
                    value={application.officerProfile.armedStatusLabel}
                  />
                </dl>

                <div className="mt-4 space-y-4">
                  <TagList
                    label="Experience Categories"
                    values={application.officerProfile.experienceCategories}
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      Introduction
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-fo-text">
                      {application.officerProfile.introduction || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      Licenses Submitted
                    </p>
                    {application.officerProfile.licenses.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {application.officerProfile.licenses.map((license) => (
                          <div
                            key={license.id}
                            className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
                          >
                            <p className="text-sm font-semibold text-fo-text">
                              {license.licenseType}
                            </p>
                            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                              <div>
                                <dt className="text-[11px] uppercase tracking-wide text-fo-text-muted">
                                  License Number
                                </dt>
                                <dd className="mt-0.5 text-fo-text">
                                  {license.licenseNumber}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[11px] uppercase tracking-wide text-fo-text-muted">
                                  Issuing State
                                </dt>
                                <dd className="mt-0.5 text-fo-text">
                                  {license.issuingState}
                                </dd>
                              </div>
                              <div className="sm:col-span-2">
                                <dt className="text-[11px] uppercase tracking-wide text-fo-text-muted">
                                  Expiration Date
                                </dt>
                                <dd className="mt-0.5 text-fo-text">
                                  {license.expirationDateLabel}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-fo-text-muted">Not provided</p>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-fo-text-muted">
                      {LICENSE_DISPLAY_DISCLAIMER}
                    </p>
                  </div>

                  <TagList
                    label="Certifications"
                    values={application.officerProfile.certifications}
                  />
                  <TagList
                    label="Availability"
                    values={application.officerProfile.availability}
                  />
                </div>
              </section>

              <section className="hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:block">
                <h3 className="text-base font-semibold text-fo-text">Applied Shift</h3>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailField label="Shift Title" value={application.appliedShift.title} />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      Shift Status
                    </dt>
                    <dd className="mt-2">
                      <ShiftStatusBadge status={application.appliedShift.status} />
                    </dd>
                  </div>
                  <DetailField label="Date" value={application.appliedShift.dateLabel} />
                  <DetailField label="Time" value={application.appliedShift.timeLabel} />
                  <DetailField
                    label="Location"
                    value={application.appliedShift.locationLabel}
                  />
                  <DetailField label="Pay Rate" value={application.appliedShift.payRateLabel} />
                  <DetailField
                    label="Work Type"
                    value={application.appliedShift.workTypeLabel}
                  />
                  <DetailField
                    label="Open Positions"
                    value={String(application.appliedShift.openPositions)}
                  />
                </dl>

                <div className="mt-4 space-y-4">
                  <TagList
                    label="Required Licenses"
                    values={application.appliedShift.requiredLicenses}
                  />
                  <TagList
                    label="Required Certifications"
                    values={application.appliedShift.requiredCertifications}
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      Other Requirements
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-fo-text">
                      {application.appliedShift.otherRequirements || "Not provided"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t border-white/[0.06] px-4 py-3.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] lg:px-5 lg:py-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                {isPending ? (
                  <>
                    <Button
                      type="button"
                      fullWidth
                      className="w-full bg-fo-success hover:bg-green-500"
                      disabled={isSubmitting}
                      onClick={() => updateStatus("ACCEPTED")}
                    >
                      {isSubmitting ? "Updating..." : "Accept Applicant"}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      fullWidth
                      className="w-full"
                      disabled={isSubmitting}
                      onClick={() => updateStatus("REJECTED")}
                    >
                      Reject Applicant
                    </Button>
                  </>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  className="hidden w-full lg:inline-flex"
                  disabled={isSubmitting}
                  onClick={onClose}
                >
                  Close
                </Button>
                <MobileSecondaryButton
                  href="/company/shifts"
                  className="min-h-10 text-sm lg:hidden"
                >
                  Back to My Shifts
                </MobileSecondaryButton>
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
