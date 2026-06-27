"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  ProfileAvatar,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  LICENSE_TYPE_OPTIONS,
  US_STATES,
} from "@/lib/license-options";
import {
  LICENSE_CERTIFICATION_COMPANY_HELPER,
  LICENSE_CERTIFICATION_ERROR,
  LICENSE_CERTIFICATION_LABEL,
  LICENSE_TYPE_REQUIRED_ERROR,
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
  PROFILE_WIZARD_STEPS,
  type ProfileWizardStepId,
} from "./profile-wizard-steps";

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
  "min-h-12 w-full rounded-fo-button border border-fo-border bg-fo-bg-elevated px-4 py-3 text-base text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

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
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-fo-text">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-fo-text-muted">{description}</p>
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
                "min-h-11 rounded-full border px-4 py-2.5 text-sm font-medium transition active:scale-[0.98]",
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

function ProfilePhotoPreview({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string;
}) {
  const [hasError, setHasError] = useState(false);
  const showImage = photoUrl.trim().length > 0 && !hasError;

  useEffect(() => {
    setHasError(false);
  }, [photoUrl]);

  if (!showImage) {
    return <ProfileAvatar name={name} size="xl" />;
  }

  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-full border border-fo-border-strong bg-fo-bg-elevated">
      <img
        src={photoUrl}
        alt={name ? `${name} profile photo` : "Profile photo preview"}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

function validateStep(
  step: ProfileWizardStepId,
  form: OfficerProfileFormState
): string | null {
  switch (step) {
    case "basic":
      if (!form.firstName.trim()) return "First name is required.";
      if (!form.lastName.trim()) return "Last name is required.";
      if (!form.phone.trim()) return "Phone number is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!form.city.trim()) return "City is required.";
      return null;
    case "experience":
      if (form.armedStatuses.length === 0) {
        return "Select at least one armed status option.";
      }
      if (!form.experienceYears.trim()) {
        return "Years of experience is required.";
      }
      if (Number(form.experienceYears) < 0) {
        return "Years of experience must be zero or greater.";
      }
      if (form.experienceCategories.length === 0) {
        return "Select at least one experience category.";
      }
      return null;
    case "licenses": {
      if (form.licenses.some((license) => !license.licenseType.trim())) {
        return LICENSE_TYPE_REQUIRED_ERROR;
      }
      for (const license of form.licenses) {
        if (!license.licenseNumber.trim()) {
          return "Every license must include a license number.";
        }
        if (!license.issuingState.trim()) {
          return "Every license must include an issuing state.";
        }
        if (!license.expirationDate.trim()) {
          return "Every license must include an expiration date.";
        }
      }
      if (!form.licenseCertificationAccepted) {
        return LICENSE_CERTIFICATION_ERROR;
      }
      return null;
    }
    case "certifications":
    case "availability":
      return null;
    default:
      return null;
  }
}

export default function OfficerProfileForm({
  initialForm,
}: OfficerProfileFormProps) {
  const [form, setForm] = useState(initialForm);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentStep = PROFILE_WIZARD_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === PROFILE_WIZARD_STEPS.length - 1;
  const displayName = `${form.firstName} ${form.lastName}`.trim();

  const completionPercent = useMemo(
    () => getProfileCompletionFromForm(form),
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
        alert("Officer profile saved!");
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
    const error = validateStep(currentStep.id, form);
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

  function renderStepContent() {
    switch (currentStep.id) {
      case "basic":
        return (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ProfilePhotoPreview
                name={displayName}
                photoUrl={form.profilePhotoUrl}
              />
              <div className="min-w-0 flex-1 space-y-2">
                <FieldLabel htmlFor="profilePhotoUrl">Profile photo URL</FieldLabel>
                <input
                  id="profilePhotoUrl"
                  value={form.profilePhotoUrl}
                  onChange={(e) =>
                    setForm({ ...form, profilePhotoUrl: e.target.value })
                  }
                  className={fieldClassName}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={fieldClassName}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={fieldClassName}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
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
        );

      case "experience":
        return (
          <div className="space-y-5">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
              <FieldLabel htmlFor="introduction">Short introduction</FieldLabel>
              <textarea
                id="introduction"
                value={form.introduction}
                maxLength={300}
                onChange={(e) =>
                  setForm({ ...form, introduction: e.target.value })
                }
                className={cn(fieldClassName, "min-h-32 resize-y py-3")}
                placeholder="Tell companies about your experience, reliability, and the shifts you prefer."
              />
              <p
                className={cn(
                  "text-right text-sm",
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
        return (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-fo-text-muted">
              {OFFICER_LICENSE_HELPER_TEXT}
            </p>

            <div className="space-y-4">
              {form.licenses.map((license, index) => (
                <div
                  key={license.clientId}
                  className="space-y-4 rounded-2xl border border-fo-border bg-fo-bg-elevated/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-fo-text">
                      License {index + 1}
                    </p>
                    {form.licenses.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeLicense(license.clientId)}
                        className="text-sm font-medium text-fo-rejected transition hover:text-red-400"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <FieldLabel htmlFor={`licenseType-${license.clientId}`}>
                        License type
                      </FieldLabel>
                      <select
                        id={`licenseType-${license.clientId}`}
                        value={license.licenseType}
                        onChange={(e) =>
                          updateLicense(license.clientId, {
                            licenseType: e.target.value,
                          })
                        }
                        className={fieldClassName}
                      >
                        <option value="">Select license type</option>
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

                    <div className="space-y-2">
                      <FieldLabel htmlFor={`licenseNumber-${license.clientId}`}>
                        License number
                      </FieldLabel>
                      <input
                        id={`licenseNumber-${license.clientId}`}
                        value={license.licenseNumber}
                        onChange={(e) =>
                          updateLicense(license.clientId, {
                            licenseNumber: e.target.value,
                          })
                        }
                        className={fieldClassName}
                        placeholder="License number"
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel htmlFor={`issuingState-${license.clientId}`}>
                        Issuing state
                      </FieldLabel>
                      <select
                        id={`issuingState-${license.clientId}`}
                        value={license.issuingState}
                        onChange={(e) =>
                          updateLicense(license.clientId, {
                            issuingState: e.target.value,
                          })
                        }
                        className={fieldClassName}
                      >
                        <option value="">Select state</option>
                        {US_STATES.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <FieldLabel htmlFor={`expirationDate-${license.clientId}`}>
                        Expiration date
                      </FieldLabel>
                      <input
                        id={`expirationDate-${license.clientId}`}
                        type="date"
                        value={license.expirationDate}
                        onChange={(e) =>
                          updateLicense(license.clientId, {
                            expirationDate: e.target.value,
                          })
                        }
                        className={fieldClassName}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="secondary" onClick={addLicense}>
              Add Another License
            </Button>

            <div className="space-y-3 rounded-2xl border border-fo-border bg-fo-bg-elevated/60 p-4">
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
                  className="mt-1 h-4 w-4 shrink-0 rounded border-fo-border bg-fo-bg-elevated text-fo-primary-bright focus:ring-fo-primary-bright/30"
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
          <TagToggleGroup
            label="When can you work?"
            description="Tap the times and schedules that fit you."
            options={AVAILABILITY_OPTIONS}
            selected={form.availability}
            onChange={(availability) => setForm({ ...form, availability })}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="space-y-5">
      <div className="fo-glass-card fo-glass-card-hover space-y-4 rounded-fo-card border border-white/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-fo-text-muted">
              Profile completion
            </p>
            <p className="text-2xl font-bold text-fo-primary-bright">
              {completionPercent}%
            </p>
          </div>
          <p className="text-xs text-fo-text-subtle sm:text-sm">
            Step {currentStepIndex + 1} of {PROFILE_WIZARD_STEPS.length}
          </p>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-slate-800/80"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completion"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-fo-primary via-fo-primary-bright to-sky-400 transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <nav
          aria-label="Profile steps"
          className="-mx-1 overflow-x-auto px-1 pb-1"
        >
          <ol className="flex min-w-max gap-2">
            {PROFILE_WIZARD_STEPS.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm",
                      isActive
                        ? "fo-nav-pill-active border-fo-primary-bright/30 text-white"
                        : isComplete
                          ? "border-fo-primary/30 bg-fo-primary/10 text-fo-primary-hover"
                          : "border-fo-border bg-fo-bg-elevated/60 text-fo-text-muted hover:text-fo-text"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-fo-bg text-fo-text-muted"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="whitespace-nowrap">{step.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <Card
        variant="elevated"
        className="fo-glass-card fo-glass-card-hover space-y-5"
      >
        <CardHeader>
          <CardTitle>{currentStep.label}</CardTitle>
          <CardDescription>
            {currentStep.id === "basic" &&
              "Add a photo URL and contact details companies may review."}
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

        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-between">
          {!isFirstStep ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={isSaving}
            >
              Back
            </Button>
          ) : (
            <span className="hidden sm:block" aria-hidden />
          )}

          <Button
            type="button"
            onClick={handleContinue}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving
              ? "Saving..."
              : isLastStep
                ? "Save Profile"
                : "Save & Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
