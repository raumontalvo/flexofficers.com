"use client";

import { useEffect } from "react";
import { AddToStaffButton } from "@/components/company/add-to-staff-button";
import { Button, ProfileAvatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SerializedOfficerSearchResult } from "@/lib/company-officers-page";
import {
  OfficerProfileName,
  officerProfileNameLabel,
} from "@/components/company/officer-profile-name";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";

type OfficerProfilePanelProps = {
  officer: SerializedOfficerSearchResult | null;
  onClose: () => void;
  isOnStaff?: boolean;
  onStaffChange?: (onStaff: boolean) => void;
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

export function OfficerProfilePanel({
  officer,
  onClose,
  isOnStaff = false,
  onStaffChange,
}: OfficerProfilePanelProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (officer) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [officer, onClose]);

  const hideMobileFooter = Boolean(onStaffChange);

  return (
    <>
      <button
        type="button"
        aria-label="Close officer profile panel"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity",
          officer ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#07101c]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          officer ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!officer}
      >
        {officer ? (
          <>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ProfileAvatar
                    name={officerProfileNameLabel(
                      officer.firstName,
                      officer.lastName
                    )}
                    src={officer.profilePhotoUrl}
                    size="md"
                  />
                  <div>
                    <OfficerProfileName
                      firstName={officer.firstName}
                      lastName={officer.lastName}
                      size="md"
                    />
                    <p className="mt-1 text-sm text-fo-text-muted">
                      {officer.cityStateLabel}
                    </p>
                  </div>
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

            <div
              className={cn(
                "flex-1 space-y-4 overflow-y-auto px-5 py-4",
                hideMobileFooter && "pb-28 lg:pb-4"
              )}
            >
              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-base font-semibold text-fo-text">
                  Basic Information
                </h3>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailField label="First name" value={officer.firstName} />
                  <DetailField label="Last name" value={officer.lastName} />
                  <DetailField label="Email" value={officer.email} />
                  <DetailField label="Phone" value={officer.phone} />
                  <DetailField label="City, State" value={officer.cityStateLabel} />
                  <DetailField
                    label="Years of Experience"
                    value={officer.experienceYearsLabel}
                  />
                  <DetailField
                    label="Armed / Unarmed"
                    value={officer.armedStatusLabel}
                  />
                </dl>
              </section>

              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
                <TagList label="Experience" values={officer.experienceCategories} />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                    Licenses
                  </p>
                  {officer.licenses.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {officer.licenses.map((license) => (
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

                <TagList label="Certifications" values={officer.certifications} />
                <TagList label="Availability" values={officer.availabilityLabels} />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                    Introduction
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-fo-text">
                    {officer.introduction || "Not provided"}
                  </p>
                </div>
              </section>

              {onStaffChange ? (
                <div className="lg:hidden">
                  <AddToStaffButton
                    officerId={officer.id}
                    isOnStaff={isOnStaff}
                    size="mobile"
                    className="w-full"
                    onAdded={() => onStaffChange(true)}
                    onRemoved={() => onStaffChange(false)}
                  />
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                "space-y-2 border-t border-white/[0.06] px-5 py-4",
                hideMobileFooter && "hidden lg:block"
              )}
            >
              <Button
                type="button"
                variant="secondary"
                fullWidth
                className="w-full"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
