"use client";

import { useEffect } from "react";
import { AddToStaffButton } from "@/components/company/add-to-staff-button";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, ProfileAvatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SerializedOfficerSearchResult } from "@/lib/company-officers-page";
import {
  OfficerProfileName,
  officerProfileNameLabel,
} from "@/components/company/officer-profile-name";
import { translateProfileOptionLabel } from "@/lib/i18n/ui-labels";

type OfficerProfilePanelProps = {
  officer: SerializedOfficerSearchResult | null;
  onClose: () => void;
  isOnStaff?: boolean;
  onStaffChange?: (onStaff: boolean) => void;
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

export function OfficerProfilePanel({
  officer,
  onClose,
  isOnStaff = false,
  onStaffChange,
}: OfficerProfilePanelProps) {
  const { t } = useLandingLanguage();
  const copy = t.company.review;
  const shared = t.company.shared;
  const notProvided = t.commonExtras.notProvided;
  const translateTag = (value: string) => translateProfileOptionLabel(t, value);

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
        aria-label={copy.closeOfficerProfileAria}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity",
          officer ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-[#07101c]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 max-lg:border-x-0 lg:border-l lg:border-white/10",
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
                  {shared.close}
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
                  {copy.basicInformation}
                </h3>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailField
                    label={t.profileWizard.form.firstName}
                    value={officer.firstName}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={t.profileWizard.form.lastName}
                    value={officer.lastName}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.email}
                    value={officer.email}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.phone}
                    value={officer.phone}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.cityState}
                    value={officer.cityStateLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.yearsOfExperience}
                    value={officer.experienceYearsLabel}
                    notProvided={notProvided}
                  />
                  <DetailField
                    label={copy.armedUnarmed}
                    value={officer.armedStatusLabel}
                    notProvided={notProvided}
                  />
                </dl>
              </section>

              <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
                <TagList
                  label={copy.experience}
                  values={officer.experienceCategories}
                  notProvided={notProvided}
                  translateValue={translateTag}
                />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                    {copy.licenses}
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
                  values={officer.certifications}
                  notProvided={notProvided}
                  translateValue={translateTag}
                />
                <TagList
                  label={copy.availability}
                  values={officer.availabilityLabels}
                  notProvided={notProvided}
                  translateValue={translateTag}
                />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                    {copy.introduction}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-fo-text">
                    {officer.introduction || notProvided}
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
                {shared.close}
              </Button>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
