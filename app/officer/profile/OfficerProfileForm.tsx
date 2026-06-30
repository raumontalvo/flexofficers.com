"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  LICENSE_TYPE_OPTIONS,
  US_STATES,
} from "@/lib/license-options";
import {
  LICENSE_CERTIFICATION_COMPANY_HELPER,
  LICENSE_CERTIFICATION_LABEL,
  OFFICER_LICENSE_HELPER_TEXT,
} from "@/lib/officer-licenses";
import { getProfileCompletionFromForm } from "@/lib/officer-profile-form";
import {
  ARMED_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
  formatArmedStatusLabel,
  type ArmedStatusOption,
} from "@/lib/profile-options";
import {
  formatLicenseExpiration,
  getLicenseDisplayMeta,
  LicenseTypeBadge,
} from "./license-display";
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload";
import { ProfileSuccessScreen } from "./ProfileSuccessScreen";
import { ProfileWizardFooter } from "./ProfileWizardFooter";
import { ProfileWizardHeader } from "./ProfileWizardHeader";
import { ProfileWizardTips } from "./ProfileWizardTips";
import {
  getWizardSectionProgress,
  validateWizardStep,
} from "./profile-wizard-progress";
import { PROFILE_WIZARD_STEPS } from "./profile-wizard-steps";
import { StepRequiredBadge } from "./profile-wizard-ui";

type LicenseFormEntry = {
  clientId: string;
  id?: string;
  licenseNumber: string;
  licenseType: string;
  issuingState: string;
  expirationDate: string;
};

export type OfficerProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  profilePhotoUrl: string;
  armedStatuses: ArmedStatusOption[];
  experienceYears: string;
  licenses: LicenseFormEntry[];
  availability: string[];
  certifications: string[];
  experienceCategories: string[];
  introduction: string;
  licenseCertificationAccepted: boolean;
};

type OfficerProfileFormProps = {
  initialForm: OfficerProfileFormState;
};

const fieldClassName =
  "min-h-10 w-full rounded-fo-button border border-fo-border bg-fo-bg-elevated px-3 py-2 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

const compactFieldClassName =
  "min-h-8 w-full rounded-lg border border-fo-border/80 bg-fo-bg-elevated px-2 py-1.5 text-xs text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30 sm:text-sm";

function createEmptyLicense(): LicenseFormEntry {
  return {
    clientId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `license-${Date.now()}-${Math.random()}`,
    licenseNumber: "",
    licenseType: "",
    issuingState: "",
    expirationDate: "",
  };
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

function getStateName(code: string) {
  return US_STATES.find((state) => state.code === code)?.name ?? code;
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-fo-text-muted">
      {children}
    </label>
  );
}

function TagToggleGroup({
  label,
  description,
  options,
  selected,
  onChange,
}: {
  label: string;
  description?: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2.5">
      <div>
        <p className="text-sm font-semibold text-fo-text">{label}</p>
        {description ? (
          <p className="mt-0.5 text-sm text-fo-text-muted">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleValue(selected, option))}
              className={cn(
                "min-h-9 rounded-full border px-3 py-1.5 text-sm font-medium transition active:scale-[0.98]",
                isSelected
                  ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-hover"
                  : "border-fo-border bg-fo-bg-elevated text-fo-text-muted hover:border-fo-border-strong hover:text-fo-text"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OfficerProfileForm({
  initialForm,
}: OfficerProfileFormProps) {
  const [form, setForm] = useState(initialForm);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStep = PROFILE_WIZARD_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === PROFILE_WIZARD_STEPS.length - 1;
  const displayName = `${form.firstName} ${form.lastName}`.trim();

  const completionPercent = useMemo(
    () => getProfileCompletionFromForm(form),
    [form]
  );

  const sectionProgress = useMemo(
    () => getWizardSectionProgress(form),
    [form]
  );

  function updateLicense(
    clientId: string,
    patch: Partial<Omit<LicenseFormEntry, "clientId">>
  ) {
    setForm((current) => ({
      ...current,
      licenses: current.licenses.map((license) =>
        license.clientId === clientId ? { ...license, ...patch } : license
      ),
    }));
  }

  function addLicense() {
    setForm((current) => ({
      ...current,
      licenses: [...current.licenses, createEmptyLicense()],
    }));
  }

  function removeLicense(clientId: string) {
    setForm((current) => {
      if (current.licenses.length <= 1) {
        return current;
      }

      return {
        ...current,
        licenses: current.licenses.filter(
          (license) => license.clientId !== clientId
        ),
      };
    });
  }

  function goToStep(index: number) {
    setStepError(null);
    setCurrentStepIndex(index);
  }

  function handleBack() {
    if (!isFirstStep) {
      goToStep(currentStepIndex - 1);
    }
  }

  async function saveProfile() {
    setIsSaving(true);

    try {
      const response = await fetch("/api/officer/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          licenses: form.licenses.map((license) => ({
            id: license.id,
            licenseNumber: license.licenseNumber,
            licenseType: license.licenseType,
            issuingState: license.issuingState,
            expirationDate: license.expirationDate,
          })),
          licenseCertificationAccepted: form.licenseCertificationAccepted,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        return true;
      }

      const payload = (await response.json().catch(() => null)) as {
        details?: Array<{ field: string; message: string }>;
        error?: string;
      } | null;

      const firstDetail = payload?.details?.[0];
      if (firstDetail) {
        setStepError(firstDetail.message);
        return false;
      }

      alert(payload?.error ?? "Failed to save officer profile");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleContinue() {
    const error = validateWizardStep(currentStep.id, form);
    if (error) {
      setStepError(error);
      return;
    }

    setStepError(null);

    if (isLastStep) {
      await saveProfile();
      return;
    }

    goToStep(currentStepIndex + 1);
  }

  function renderLicensesStep() {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-fo-text-muted">
            {OFFICER_LICENSE_HELPER_TEXT}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={addLicense}
            className="w-full shrink-0 sm:w-auto"
          >
            Add Another License
          </Button>
        </div>

        <div className="space-y-2">
          {form.licenses.map((license) => {
            const meta = getLicenseDisplayMeta(license.licenseType);
            const stateName = license.issuingState
              ? getStateName(license.issuingState)
              : "—";

            return (
              <div
                key={license.clientId}
                className="rounded-xl border border-fo-border bg-fo-bg-elevated/40 p-3"
              >
                <div className="grid gap-3 sm:grid-cols-[minmax(130px,1fr)_minmax(100px,0.9fr)_minmax(110px,1fr)_minmax(110px,0.9fr)_auto] sm:items-center">
                  <div className="space-y-1.5">
                    {license.licenseType ? (
                      <LicenseTypeBadge licenseType={license.licenseType} />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-600 px-2.5 py-1.5 text-xs text-slate-500">
                        {meta.icon} Select type
                      </span>
                    )}
                    <select
                      aria-label="License type"
                      value={license.licenseType}
                      onChange={(e) =>
                        updateLicense(license.clientId, {
                          licenseType: e.target.value,
                        })
                      }
                      className={compactFieldClassName}
                    >
                      <option value="">License type</option>
                      {LICENSE_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      {license.licenseType &&
                      !LICENSE_TYPE_OPTIONS.includes(
                        license.licenseType as (typeof LICENSE_TYPE_OPTIONS)[number]
                      ) ? (
                        <option value={license.licenseType}>
                          {license.licenseType}
                        </option>
                      ) : null}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle sm:hidden">
                      State
                    </p>
                    <p className="hidden min-h-5 text-sm font-medium text-fo-text sm:block">
                      {stateName}
                    </p>
                    <select
                      aria-label="Issuing state"
                      value={license.issuingState}
                      onChange={(e) =>
                        updateLicense(license.clientId, {
                          issuingState: e.target.value,
                        })
                      }
                      className={compactFieldClassName}
                    >
                      <option value="">State</option>
                      {US_STATES.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle sm:hidden">
                      Number
                    </p>
                    <input
                      aria-label="License number"
                      value={license.licenseNumber}
                      onChange={(e) =>
                        updateLicense(license.clientId, {
                          licenseNumber: e.target.value,
                        })
                      }
                      className={compactFieldClassName}
                      placeholder="License number"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-fo-text-subtle sm:hidden">
                      Expiration
                    </p>
                    {license.expirationDate ? (
                      <p className="hidden text-sm font-medium text-fo-text sm:block">
                        {formatLicenseExpiration(license.expirationDate)}
                      </p>
                    ) : null}
                    <input
                      aria-label="Expiration date"
                      type="date"
                      value={license.expirationDate}
                      onChange={(e) =>
                        updateLicense(license.clientId, {
                          expirationDate: e.target.value,
                        })
                      }
                      className={compactFieldClassName}
                    />
                  </div>

                  <div className="flex items-center justify-end sm:justify-center">
                    {form.licenses.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeLicense(license.clientId)}
                        className="text-xs font-medium text-fo-rejected transition hover:text-red-400"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-xs text-fo-text-subtle">—</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2 rounded-xl border border-fo-border bg-fo-bg-elevated/40 p-3.5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.licenseCertificationAccepted}
              onChange={(e) =>
                setForm({
                  ...form,
                  licenseCertificationAccepted: e.target.checked,
                })
              }
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-fo-border bg-fo-bg-elevated text-fo-primary-bright focus:ring-fo-primary-bright/30"
            />
            <span className="text-sm leading-relaxed text-fo-text">
              {LICENSE_CERTIFICATION_LABEL}
            </span>
          </label>
          <p className="text-xs leading-relaxed text-fo-text-muted">
            {LICENSE_CERTIFICATION_COMPANY_HELPER}
          </p>
        </div>
      </div>
    );
  }

  function renderStepContent() {
    switch (currentStep.id) {
      case "basic":
        return (
          <div className="space-y-4">
            <ProfilePhotoUpload
              value={form.profilePhotoUrl}
              onChange={(profilePhotoUrl) =>
                setForm({ ...form, profilePhotoUrl })
              }
              onPersistPhotoUrl={async (profilePhotoUrl) => {
                const response = await fetch("/api/officer/profile/photo", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ profilePhotoUrl }),
                });

                if (!response.ok) {
                  throw new Error("Failed to save profile photo");
                }
              }}
              previewName={displayName}
              onUploadingChange={setIsUploadingPhoto}
              disabled={isSaving}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className={fieldClassName}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={fieldClassName}
                  placeholder="Last name"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={fieldClassName}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={fieldClassName}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <FieldLabel htmlFor="city">City</FieldLabel>
                <input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={fieldClassName}
                  placeholder="City"
                />
              </div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <TagToggleGroup
              label="Armed status"
              description="Select all that apply. Choose both if you can work armed and unarmed assignments."
              options={ARMED_STATUS_OPTIONS.map(formatArmedStatusLabel)}
              selected={form.armedStatuses.map(formatArmedStatusLabel)}
              onChange={(labels) =>
                setForm({
                  ...form,
                  armedStatuses: labels.map((label) =>
                    label === "Armed" ? "ARMED" : "UNARMED"
                  ) as ArmedStatusOption[],
                })
              }
            />

            <div className="max-w-xs space-y-1.5">
              <FieldLabel htmlFor="experienceYears">Years of experience</FieldLabel>
              <input
                id="experienceYears"
                type="number"
                min="0"
                value={form.experienceYears}
                onChange={(e) =>
                  setForm({ ...form, experienceYears: e.target.value })
                }
                className={fieldClassName}
                placeholder="0"
              />
            </div>

            <TagToggleGroup
              label="Experience categories"
              description="Highlight the types of sites and assignments you know best."
              options={EXPERIENCE_CATEGORIES}
              selected={form.experienceCategories}
              onChange={(experienceCategories) =>
                setForm({ ...form, experienceCategories })
              }
            />

            <div className="space-y-1.5">
              <FieldLabel htmlFor="introduction">Short introduction</FieldLabel>
              <textarea
                id="introduction"
                value={form.introduction}
                maxLength={300}
                onChange={(e) =>
                  setForm({ ...form, introduction: e.target.value })
                }
                className={cn(fieldClassName, "min-h-24 resize-y py-2.5")}
                placeholder="Tell companies about your experience, reliability, and the shifts you prefer."
              />
              <p
                className={cn(
                  "text-right text-xs",
                  form.introduction.length >= 280
                    ? "text-fo-pending"
                    : "text-fo-text-subtle"
                )}
              >
                {form.introduction.length}/300
              </p>
            </div>
          </div>
        );

      case "licenses":
        return renderLicensesStep();

      case "certifications":
        return (
          <TagToggleGroup
            label="Your certifications"
            description="Select any certifications you currently hold."
            options={CERTIFICATION_OPTIONS}
            selected={form.certifications}
            onChange={(certifications) => setForm({ ...form, certifications })}
          />
        );

      case "availability":
        return (
          <div className="space-y-4">
            <TagToggleGroup
              label="When can you work?"
              description="Tap the times and schedules that fit you."
              options={AVAILABILITY_OPTIONS}
              selected={form.availability}
              onChange={(availability) => setForm({ ...form, availability })}
            />

            <div className="rounded-xl border border-fo-border bg-fo-bg-elevated/40 p-3.5">
              <p className="text-sm font-semibold text-fo-text">
                Availability summary
              </p>
              {form.availability.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.availability.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-fo-text-muted">
                  No availability selected yet. Choose the schedules that fit you.
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  if (showSuccess) {
    return (
      <div className="pb-4">
        <ProfileSuccessScreen />
      </div>
    );
  }

  return (
    <div className="pb-3">
      <ProfileWizardHeader
        currentStepIndex={currentStepIndex}
        completionPercent={completionPercent}
        completedSections={sectionProgress.completedCount}
        totalSections={sectionProgress.totalCount}
        nextStepLabel={sectionProgress.nextStepLabel}
        allSectionsComplete={sectionProgress.allComplete}
        form={form}
        onStepSelect={goToStep}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <Card
          variant="elevated"
          className="fo-glass-card min-w-0 space-y-4 border border-white/10 p-3.5 sm:p-4 lg:p-5"
        >
          <CardHeader className="space-y-1.5 p-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{currentStep.label}</CardTitle>
              <StepRequiredBadge required={currentStep.required} />
            </div>
            <CardDescription className="text-sm">
              {currentStep.id === "basic" &&
                "Add a photo and contact details companies may review."}
              {currentStep.id === "experience" &&
                "Help companies understand your background and credentials."}
              {currentStep.id === "licenses" &&
                "At least one license is required to complete your profile."}
              {currentStep.id === "certifications" &&
                "Select any certifications you currently hold."}
              {currentStep.id === "availability" &&
                "Choose the schedules that fit you best."}
            </CardDescription>
          </CardHeader>

          {renderStepContent()}

          {stepError ? (
            <p className="text-sm text-fo-rejected" role="alert">
              {stepError}
            </p>
          ) : null}
        </Card>

        <ProfileWizardTips
          stepId={currentStep.id}
          className="hidden lg:block"
          showApplyTip={completionPercent < 100}
        />
      </div>

      <ProfileWizardTips
        stepId={currentStep.id}
        className="mt-4 lg:hidden"
        showApplyTip={completionPercent < 100}
      />

      <ProfileWizardFooter
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSaving={isSaving}
        isUploading={isUploadingPhoto}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
