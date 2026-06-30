"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COMPANY_PROFILE_FORM_OPTIONS,
  parseCompanyPayload,
} from "@/app/api/company/profile/validation";
import { buttonClassName } from "@/components/ui";
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload";
import { cn } from "@/lib/cn";
import type { CompanyProfileEditFormState } from "@/lib/company-profile-edit-data";
import {
  buildCompanyProfileSavePayload,
  formatCompanyProfileFieldErrors,
} from "@/lib/company-profile-payload";
import { US_STATES } from "@/lib/license-options";

type CompanyProfileEditFormProps = {
  initialForm: CompanyProfileEditFormState;
};

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-fo-border bg-fo-bg-elevated px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

function inputClassName(hasError: boolean) {
  return cn(
    fieldClassName,
    hasError && "border-red-500/50 focus:border-red-400 focus:ring-red-400/30"
  );
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-red-400">{message}</p>;
}

function RequiredLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-fo-text-muted">
      {children}
      <span className="text-red-400"> *</span>
    </label>
  );
}

function OptionalLabel({
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

function EditSectionCard({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="fo-glass-card h-auto self-start rounded-xl border border-white/10 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-fo-text">{title}</h2>
      {helper ? (
        <p className="mt-1 text-sm text-fo-text-muted">{helper}</p>
      ) : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SelectionChipField({
  options,
  selected,
  customItems,
  onToggle,
  onAddCustom,
  onRemoveCustom,
  customLabel,
  customPlaceholder,
  addButtonLabel,
}: {
  options: readonly string[];
  selected: string[];
  customItems: string[];
  onToggle: (value: string) => void;
  onAddCustom: (value: string) => void;
  onRemoveCustom: (value: string) => void;
  customLabel: string;
  customPlaceholder: string;
  addButtonLabel: string;
}) {
  const [customValue, setCustomValue] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition",
                isSelected
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-100"
                  : "border-white/10 bg-white/[0.02] text-fo-text-muted hover:border-white/20"
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(option)}
                className="h-4 w-4 rounded border-fo-border text-fo-primary-bright focus:ring-fo-primary-bright/40"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>

      {customItems.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {customItems.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-100"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemoveCustom(item)}
                className="text-blue-200 hover:text-white"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="space-y-2">
        <OptionalLabel>{customLabel}</OptionalLabel>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            placeholder={customPlaceholder}
            className={fieldClassName}
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = customValue.trim();
              if (!trimmed) {
                return;
              }

              onAddCustom(trimmed);
              setCustomValue("");
            }}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0",
            })}
          >
            {addButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompanyProfileEditForm({ initialForm }: CompanyProfileEditFormProps) {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const descriptionCount = form.description.length;
  const descriptionMax = COMPANY_PROFILE_FORM_OPTIONS.descriptionMaxLength;

  const previewHref = useMemo(
    () => (form.hasPublicProfile ? "/company/profile/preview" : "/company/profile"),
    [form.hasPublicProfile]
  );

  function toggleSelection(
    key: "services" | "officerBenefits" | "workEnvironment",
    value: string
  ) {
    setForm((current) => {
      const selected = current[key];
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      return { ...current, [key]: next };
    });
  }

  function addCustomItem(
    key: "customServices" | "customBenefits" | "customWorkEnvironment",
    value: string
  ) {
    setForm((current) => {
      const existing = current[key];
      if (existing.includes(value)) {
        return current;
      }

      return { ...current, [key]: [...existing, value] };
    });
  }

  function removeCustomItem(
    key: "customServices" | "customBenefits" | "customWorkEnvironment",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((item) => item !== value),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    setFieldErrors({});

    const payload = buildCompanyProfileSavePayload(form);
    const parsed = parseCompanyPayload(payload);

    if ("errors" in parsed && parsed.errors) {
      const nextFieldErrors = Object.fromEntries(
        parsed.errors.map((error) => [error.field, error.message])
      );

      setFieldErrors(nextFieldErrors);
      setSubmitError(
        formatCompanyProfileFieldErrors(parsed.errors).join(" ")
      );
      setIsSaving(false);
      return;
    }

    const response = await fetch("/api/company/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setIsSaving(false);

    if (response.ok) {
      setSubmitSuccess("Company profile saved.");
      return;
    }

    if (Array.isArray(data.details)) {
      const nextFieldErrors = Object.fromEntries(
        data.details.map((error: { field: string; message: string }) => [
          error.field,
          error.message,
        ])
      );

      setFieldErrors(nextFieldErrors);
      setSubmitError(formatCompanyProfileFieldErrors(data.details).join(" "));
      return;
    }

    setSubmitError(data.error || "Failed to save company profile.");
  }

  return (
    <form id="company-profile-edit-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-fo-text">Edit Company Profile</h1>
          <p className="text-sm text-fo-text-muted">
            Update your public profile information. This information is visible to
            officers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/company/profile"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
            })}
          >
            Back to Profile
          </Link>
          <button
            type="submit"
            disabled={isSaving || isUploadingLogo}
            className={buttonClassName({ size: "md" })}
          >
            {isUploadingLogo
              ? "Uploading..."
              : isSaving
                ? "Saving..."
                : "Save Changes"}
          </button>
        </div>
      </div>

      {submitError ? (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {submitError}
        </div>
      ) : null}

      {submitSuccess ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
        >
          {submitSuccess}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="space-y-4">
          <EditSectionCard title="Company Information">
            <ProfilePhotoUpload
              value={form.logoUrl}
              onChange={(logoUrl) => setForm({ ...form, logoUrl })}
              onPersistPhotoUrl={async (logoUrl) => {
                const response = await fetch("/api/company/profile/logo", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ logoUrl }),
                });

                if (!response.ok) {
                  throw new Error("Failed to save company logo");
                }
              }}
              previewName={form.companyName}
              onUploadingChange={setIsUploadingLogo}
              disabled={isSaving}
              previewShape="circle"
              helperText="Square JPG, PNG, or WEBP recommended. Max 5MB."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel htmlFor="companyName">Company Name</RequiredLabel>
                <input
                  id="companyName"
                  value={form.companyName}
                  onChange={(event) =>
                    setForm({ ...form, companyName: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.companyName))}
                />
                <FieldErrorMessage message={fieldErrors.companyName} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel htmlFor="tagline">Tagline / Category</RequiredLabel>
                <input
                  id="tagline"
                  value={form.tagline}
                  onChange={(event) =>
                    setForm({ ...form, tagline: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.tagline))}
                />
                <FieldErrorMessage message={fieldErrors.tagline} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="city">City</RequiredLabel>
                <input
                  id="city"
                  value={form.city}
                  onChange={(event) =>
                    setForm({ ...form, city: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.city))}
                />
                <FieldErrorMessage message={fieldErrors.city} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="state">State</RequiredLabel>
                <select
                  id="state"
                  value={form.state}
                  onChange={(event) =>
                    setForm({ ...form, state: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.state))}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <FieldErrorMessage message={fieldErrors.state} />
              </div>
            </div>
          </EditSectionCard>

          <EditSectionCard title="About Us">
            <div className="space-y-2">
              <RequiredLabel htmlFor="description">Company Description</RequiredLabel>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                maxLength={descriptionMax}
                rows={6}
                className={cn(inputClassName(Boolean(fieldErrors.description)), "min-h-32 resize-y")}
              />
              <FieldErrorMessage message={fieldErrors.description} />
              <p className="text-xs text-fo-text-muted">
                {descriptionCount} / {descriptionMax} characters
              </p>
            </div>
          </EditSectionCard>

          <EditSectionCard
            title="Services We Provide"
            helper="Select all services your company provides."
          >
            <SelectionChipField
              options={COMPANY_PROFILE_FORM_OPTIONS.services}
              selected={form.services}
              customItems={form.customServices}
              onToggle={(value) => toggleSelection("services", value)}
              onAddCustom={(value) => addCustomItem("customServices", value)}
              onRemoveCustom={(value) => removeCustomItem("customServices", value)}
              customLabel="Add Your Own Service"
              customPlaceholder="Enter a service"
              addButtonLabel="+ Add Service"
            />
          </EditSectionCard>

          <EditSectionCard
            title="Why Officers Choose Us"
            helper="Select the benefits you offer to officers."
          >
            <SelectionChipField
              options={COMPANY_PROFILE_FORM_OPTIONS.officerBenefits}
              selected={form.officerBenefits}
              customItems={form.customBenefits}
              onToggle={(value) => toggleSelection("officerBenefits", value)}
              onAddCustom={(value) => addCustomItem("customBenefits", value)}
              onRemoveCustom={(value) => removeCustomItem("customBenefits", value)}
              customLabel="Add Your Own Benefit"
              customPlaceholder="Enter a benefit"
              addButtonLabel="+ Add Benefit"
            />
          </EditSectionCard>

          <EditSectionCard
            title="Work Environment"
            helper="Select all that describe your work environment."
          >
            <SelectionChipField
              options={COMPANY_PROFILE_FORM_OPTIONS.workEnvironment}
              selected={form.workEnvironment}
              customItems={form.customWorkEnvironment}
              onToggle={(value) => toggleSelection("workEnvironment", value)}
              onAddCustom={(value) => addCustomItem("customWorkEnvironment", value)}
              onRemoveCustom={(value) =>
                removeCustomItem("customWorkEnvironment", value)
              }
              customLabel="Add Your Own Environment"
              customPlaceholder="Enter a work environment"
              addButtonLabel="+ Add Environment"
            />
          </EditSectionCard>
        </div>

        <aside className="space-y-4 self-start">
          <EditSectionCard title="License Information">
            <div className="space-y-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="licenseNumber">License Number</RequiredLabel>
                <input
                  id="licenseNumber"
                  value={form.licenseNumber}
                  onChange={(event) =>
                    setForm({ ...form, licenseNumber: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.licenseNumber))}
                />
                <FieldErrorMessage message={fieldErrors.licenseNumber} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="licenseType">License Type</RequiredLabel>
                <input
                  id="licenseType"
                  value={form.licenseType}
                  onChange={(event) =>
                    setForm({ ...form, licenseType: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.licenseType))}
                />
                <FieldErrorMessage message={fieldErrors.licenseType} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="licenseState">State Issued</RequiredLabel>
                <select
                  id="licenseState"
                  value={form.licenseState}
                  onChange={(event) =>
                    setForm({ ...form, licenseState: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.licenseState))}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <FieldErrorMessage message={fieldErrors.licenseState} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="licenseIssueDate">Issue Date</RequiredLabel>
                <input
                  id="licenseIssueDate"
                  type="date"
                  value={form.licenseIssueDate}
                  onChange={(event) =>
                    setForm({ ...form, licenseIssueDate: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.licenseIssueDate))}
                />
                <FieldErrorMessage message={fieldErrors.licenseIssueDate} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="licenseExpirationDate">
                  Expiration Date
                </RequiredLabel>
                <input
                  id="licenseExpirationDate"
                  type="date"
                  value={form.licenseExpirationDate}
                  onChange={(event) =>
                    setForm({ ...form, licenseExpirationDate: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.licenseExpirationDate))}
                />
                <FieldErrorMessage message={fieldErrors.licenseExpirationDate} />
              </div>
            </div>
          </EditSectionCard>

          <EditSectionCard title="Company Details">
            <div className="space-y-4">
              <div className="space-y-2">
                <OptionalLabel htmlFor="industry">Industry</OptionalLabel>
                <input
                  id="industry"
                  value={form.industry}
                  onChange={(event) =>
                    setForm({ ...form, industry: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.industry))}
                  placeholder="Security Services"
                />
                <FieldErrorMessage message={fieldErrors.industry} />
              </div>

              <div className="space-y-2">
                <OptionalLabel htmlFor="companySize">Company Size</OptionalLabel>
                <input
                  id="companySize"
                  value={form.companySize}
                  onChange={(event) =>
                    setForm({ ...form, companySize: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.companySize))}
                  placeholder="11–50 employees"
                />
                <FieldErrorMessage message={fieldErrors.companySize} />
              </div>

              <div className="space-y-2">
                <OptionalLabel htmlFor="established">Established</OptionalLabel>
                <input
                  id="established"
                  value={form.established}
                  onChange={(event) =>
                    setForm({ ...form, established: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.established))}
                  placeholder="2018"
                />
                <FieldErrorMessage message={fieldErrors.established} />
              </div>

              <div className="space-y-2">
                <OptionalLabel htmlFor="website">Website</OptionalLabel>
                <input
                  id="website"
                  value={form.website}
                  onChange={(event) =>
                    setForm({ ...form, website: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.website))}
                  placeholder="https://yourcompany.com"
                />
                <FieldErrorMessage message={fieldErrors.website} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="email">Contact Email</RequiredLabel>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.email))}
                />
                <FieldErrorMessage message={fieldErrors.email} />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="phone">Phone</RequiredLabel>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.phone))}
                />
                <FieldErrorMessage message={fieldErrors.phone} />
              </div>
            </div>
          </EditSectionCard>

          <EditSectionCard
            title="Support & Contact"
            helper="Business hours shown on your public profile."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="businessHours">Business Hours</RequiredLabel>
                <input
                  id="businessHours"
                  value={form.businessHours}
                  onChange={(event) =>
                    setForm({ ...form, businessHours: event.target.value })
                  }
                  className={inputClassName(Boolean(fieldErrors.businessHours))}
                  placeholder="Mon–Fri 9:00 AM – 5:00 PM"
                />
                <FieldErrorMessage message={fieldErrors.businessHours} />
              </div>
            </div>
          </EditSectionCard>

          <EditSectionCard title="Preview">
            <p className="text-sm text-fo-text-muted">
              This is how your profile appears to officers.
            </p>
            <Link
              href={previewHref}
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "mt-4 w-full text-center",
              })}
            >
              View Public Profile
            </Link>
          </EditSectionCard>
        </aside>
      </div>
    </form>
  );
}
