"use client";

import { useEffect, useState } from "react";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { Button, ProfileAvatar, StatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SerializedCompanyApplicant } from "@/lib/company-applications-page";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";

type ApplicationReviewPanelProps = {
  application: SerializedCompanyApplicant | null;
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

export function ApplicationReviewPanel({
  application,
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

  return (
    <>
      <button
        type="button"
        aria-label="Close applicant review panel"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity",
          application ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#07101c]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          application ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!application}
      >
        {application ? (
          <>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-fo-text">
                    Applicant Review
                  </h2>
                  <p className="mt-1 text-sm text-fo-text-muted">
                    {application.officerProfile.name} · {application.appliedShift.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-sm text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
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

              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
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

            <div className="border-t border-white/[0.06] px-5 py-4">
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
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
