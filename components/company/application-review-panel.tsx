"use client";

import { useEffect, useMemo, useState } from "react";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, ProfileAvatar, StatusBadge } from "@/components/ui";
import { MobileSecondaryButton } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  getShiftApplicantOverview,
  type SerializedCompanyApplicant,
} from "@/lib/company-applications-page";
import { getShiftStatusLabel, translateProfileOptionLabel } from "@/lib/i18n/ui-labels";
import type { AppTranslations } from "@/lib/app-i18n";

type ApplicationReviewPanelProps = {
  application: SerializedCompanyApplicant | null;
  allApplications?: SerializedCompanyApplicant[];
  onClose: () => void;
};

function DetailField({
  label,
  value,
  notProvided,
}: {
  label: string;
  value: string | null | undefined;
  notProvided: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-fo-text">{value?.trim() || notProvided}</dd>
    </div>
  );
}

function TagList({
  label,
  values,
  notProvided,
  translateValue,
}: {
  label: string;
  values: readonly string[];
  notProvided: string;
  translateValue?: (value: string) => string;
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
              {translateValue ? translateValue(value) : value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-fo-text-muted">{notProvided}</p>
      )}
    </div>
  );
}

function ShiftStatusBadge({
  status,
  t,
}: {
  status: ShiftStatus;
  t: AppTranslations;
}) {
  const variant =
    status === ShiftStatus.OPEN
      ? "success"
      : status === ShiftStatus.FILLED
        ? "info"
        : status === ShiftStatus.CANCELLED
          ? "rejected"
          : "neutral";

  return (
    <StatusBadge variant={variant}>{getShiftStatusLabel(t, status)}</StatusBadge>
  );
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
  t,
}: {
  application: SerializedCompanyApplicant;
  overview: ReturnType<typeof getShiftApplicantOverview>;
  t: AppTranslations;
}) {
  const copy = t.company.review;
  const shared = t.company.shared;

  return (
    <div className="space-y-3 lg:hidden">
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <h3 className="text-sm font-bold text-fo-text">{copy.shiftDetails}</h3>
        <div className="mt-2 divide-y divide-white/[0.06]">
          <CompactInfoRow
            icon="📅"
            label={shared.date}
            value={application.appliedShift.dateLabel}
          />
          <CompactInfoRow
            icon="🕒"
            label={shared.time}
            value={application.appliedShift.timeLabel}
          />
          <CompactInfoRow
            icon="📍"
            label={shared.location}
            value={application.appliedShift.locationLabel}
          />
          <CompactInfoRow
            icon="💵"
            label={shared.pay}
            value={application.appliedShift.payRateLabel}
          />
          <CompactInfoRow
            icon="👥"
            label={shared.openPositions}
            value={String(application.appliedShift.openPositions)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
        <h3 className="text-sm font-bold text-fo-text">{copy.applicantsOverview}</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <OverviewStatCard label={shared.total} value={overview.total} tone="default" />
          <OverviewStatCard label={shared.pending} value={overview.pending} tone="amber" />
          <OverviewStatCard label={shared.accepted} value={overview.accepted} tone="green" />
          <OverviewStatCard label={shared.rejected} value={overview.rejected} tone="red" />
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
  const { t } = useLandingLanguage();
  const copy = t.company.review;
  const shared = t.company.shared;
  const notProvided = t.commonExtras.notProvided;
  const translateTag = (value: string) => translateProfileOptionLabel(t, value);
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

      alert(data?.error || copy.updateFailed);
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
        aria-label={copy.closeAria}
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
                    {copy.title}
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
                  {shared.close}
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3.5 pb-28 lg:space-y-4 lg:px-5 lg:py-4 lg:pb-4">
              {shiftOverview ? (
                <MobileShiftDetailsSection
                  application={application}
                  overview={shiftOverview}
                  t={t}
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
                      {copy.officerProfile}
                    </h3>
                    <p className="mt-0.5 text-xs text-fo-text-muted">
                      {copy.officerProfileHint}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailField
                    label={copy.name}
                    value={application.officerProfile.name}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.email}
                    value={application.officerProfile.email}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.phone}
                    value={application.officerProfile.phone}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.cityState}
                    value={application.officerProfile.cityStateLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.yearsOfExperience}
                    value={application.officerProfile.experienceYearsLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.armedUnarmed}
                    value={application.officerProfile.armedStatusLabel}
                    notProvided={notProvided}
                  />
                </dl>

                <div className="mt-4 space-y-4">
                  <TagList
                    label={copy.experienceCategories}
                    values={application.officerProfile.experienceCategories}
                    notProvided={notProvided}
                    translateValue={translateTag}
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      {copy.introduction}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-fo-text">
                      {application.officerProfile.introduction || notProvided}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      {copy.licensesSubmitted}
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
                                  {copy.licenseNumber}
                                </dt>
                                <dd className="mt-0.5 text-fo-text">
                                  {license.licenseNumber}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[11px] uppercase tracking-wide text-fo-text-muted">
                                  {copy.issuingState}
                                </dt>
                                <dd className="mt-0.5 text-fo-text">
                                  {license.issuingState}
                                </dd>
                              </div>
                              <div className="sm:col-span-2">
                                <dt className="text-[11px] uppercase tracking-wide text-fo-text-muted">
                                  {copy.expirationDate}
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
                      <p className="mt-1 text-sm text-fo-text-muted">{notProvided}</p>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-fo-text-muted">
                      {shared.licenseDisclaimer}
                    </p>
                  </div>

                  <TagList
                    label={copy.certifications}
                    values={application.officerProfile.certifications}
                    notProvided={notProvided}
                    translateValue={translateTag}
                  />
                  <TagList
                    label={copy.availability}
                    values={application.officerProfile.availability}
                    notProvided={notProvided}
                    translateValue={translateTag}
                  />
                </div>
              </section>

              <section className="hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:block">
                <h3 className="text-base font-semibold text-fo-text">{copy.appliedShift}</h3>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailField
                    label={copy.shiftTitle}
                    value={application.appliedShift.title}
                    notProvided={notProvided}
                  />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      {copy.shiftStatus}
                    </dt>
                    <dd className="mt-2">
                      <ShiftStatusBadge
                        status={application.appliedShift.status}
                        t={t}
                      />
                    </dd>
                  </div>
                  <DetailField
                    label={shared.date}
                    value={application.appliedShift.dateLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={shared.time}
                    value={application.appliedShift.timeLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={shared.location}
                    value={application.appliedShift.locationLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.payRate}
                    value={application.appliedShift.payRateLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.workType}
                    value={application.appliedShift.workTypeLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={shared.openPositions}
                    value={String(application.appliedShift.openPositions)}
                    notProvided={notProvided}
                  />
                </dl>

                <div className="mt-4 space-y-4">
                  <TagList
                    label={copy.requiredLicenses}
                    values={application.appliedShift.requiredLicenses}
                    notProvided={notProvided}
                  />
                  <TagList
                    label={copy.requiredCertifications}
                    values={application.appliedShift.requiredCertifications}
                    notProvided={notProvided}
                    translateValue={translateTag}
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                      {copy.otherRequirements}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-fo-text">
                      {application.appliedShift.otherRequirements || notProvided}
                    </p>
                  </div>
                </div>
              </section>

              <div className="space-y-2 lg:hidden">
                {isPending ? (
                  <>
                    <Button
                      type="button"
                      fullWidth
                      className="w-full bg-fo-success hover:bg-green-500"
                      disabled={isSubmitting}
                      onClick={() => updateStatus("ACCEPTED")}
                    >
                      {isSubmitting ? copy.updating : copy.acceptApplicant}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      fullWidth
                      className="w-full"
                      disabled={isSubmitting}
                      onClick={() => updateStatus("REJECTED")}
                    >
                      {copy.rejectApplicant}
                    </Button>
                  </>
                ) : null}
                <MobileSecondaryButton
                  href="/company/shifts"
                  className="min-h-10 text-sm"
                >
                  {copy.backToShifts}
                </MobileSecondaryButton>
              </div>
            </div>

            <div className="hidden border-t border-white/[0.06] px-4 py-3.5 lg:block lg:px-5 lg:py-4">
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
                      {isSubmitting ? copy.updating : copy.acceptApplicant}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      fullWidth
                      className="w-full"
                      disabled={isSubmitting}
                      onClick={() => updateStatus("REJECTED")}
                    >
                      {copy.rejectApplicant}
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
                  {shared.close}
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
