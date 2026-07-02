"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseClientProfilePayload } from "@/app/api/client/profile/validation";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload";
import { buttonClassName } from "@/components/ui";
import type { ClientProfileEditFormState } from "@/lib/client-profile-page-data";
import { US_STATES } from "@/lib/license-options";
import { cn } from "@/lib/cn";

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

function RequiredLabel({ children, htmlFor }: { children: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-fo-text-muted">
      {children}
      <span className="text-red-400"> *</span>
    </label>
  );
}

function OptionalLabel({ children, htmlFor }: { children: string; htmlFor?: string }) {
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
      {helper ? <p className="mt-1 text-sm text-fo-text-muted">{helper}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

type ClientProfileEditFormProps = {
  initialForm: ClientProfileEditFormState;
};

export function ClientProfileEditForm({ initialForm }: ClientProfileEditFormProps) {
  const router = useRouter();
  const { t } = useLandingLanguage();
  const view = t.client.clientProfile.view;
  const labels = t.client.clientProfile.edit;
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  function updateField<K extends keyof ClientProfileEditFormState>(
    key: K,
    value: ClientProfileEditFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function persistPhotoUrl(url: string) {
    const response = await fetch("/api/client/profile/photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profilePhotoUrl: url }),
    });

    if (!response.ok) {
      throw new Error(labels.photoSaveFailed);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = parseClientProfilePayload(form);

    if ("errors" in parsed) {
      const nextErrors: Record<string, string> = {};
      for (const error of parsed.errors ?? []) {
        nextErrors[error.field] = error.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/client/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          profilePhotoUrl: form.profilePhotoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(labels.saveFailed);
      }

      router.push("/client/profile");
      router.refresh();
    } catch {
      setFormError(labels.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }

  const saveDisabled = isSaving || isUploadingPhoto;

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fo-text">{labels.title}</h1>
          <p className="mt-1 text-sm text-fo-text-muted">{labels.subtitle}</p>
        </div>
        <Link
          href="/client/profile"
          className={buttonClassName({ variant: "secondary", size: "md" })}
        >
          {labels.backToProfile}
        </Link>
      </div>

      <EditSectionCard title={view.personalInformation}>
        <ProfilePhotoUpload
          value={form.profilePhotoUrl}
          onChange={(url) => updateField("profilePhotoUrl", url)}
          previewName={form.contactName || view.title}
          disabled={saveDisabled}
          onUploadingChange={setIsUploadingPhoto}
          onPersistPhotoUrl={persistPhotoUrl}
          helperText={labels.photoHelper}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <RequiredLabel htmlFor="contactName">{view.fullName}</RequiredLabel>
            <input
              id="contactName"
              value={form.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
              className={inputClassName(Boolean(fieldErrors.contactName))}
            />
            <FieldErrorMessage message={fieldErrors.contactName} />
          </div>

          <div className="space-y-1.5">
            <RequiredLabel htmlFor="email">{view.emailAddress}</RequiredLabel>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className={inputClassName(Boolean(fieldErrors.email))}
            />
            <FieldErrorMessage message={fieldErrors.email} />
          </div>

          <div className="space-y-1.5">
            <RequiredLabel htmlFor="phone">{view.phoneNumber}</RequiredLabel>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className={inputClassName(Boolean(fieldErrors.phone))}
            />
            <FieldErrorMessage message={fieldErrors.phone} />
          </div>

          <div className="space-y-1.5">
            <OptionalLabel htmlFor="companyName">{view.businessName}</OptionalLabel>
            <input
              id="companyName"
              value={form.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
              className={inputClassName(false)}
            />
          </div>

          <div className="space-y-1.5">
            <OptionalLabel htmlFor="industry">{view.industry}</OptionalLabel>
            <input
              id="industry"
              value={form.industry}
              onChange={(event) => updateField("industry", event.target.value)}
              className={inputClassName(false)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <OptionalLabel htmlFor="website">{view.website}</OptionalLabel>
            <input
              id="website"
              type="url"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              className={inputClassName(false)}
              placeholder="https://"
            />
          </div>
        </div>
      </EditSectionCard>

      <EditSectionCard title={view.businessAddress} helper={view.businessAddressHelper}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <OptionalLabel htmlFor="address">{view.address}</OptionalLabel>
            <input
              id="address"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              className={inputClassName(false)}
            />
          </div>

          <div className="space-y-1.5">
            <OptionalLabel htmlFor="city">{view.city}</OptionalLabel>
            <input
              id="city"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              className={inputClassName(false)}
            />
          </div>

          <div className="space-y-1.5">
            <OptionalLabel htmlFor="state">{view.state}</OptionalLabel>
            <select
              id="state"
              value={form.state}
              onChange={(event) => updateField("state", event.target.value)}
              className={inputClassName(false)}
            >
              <option value="">—</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <OptionalLabel htmlFor="zipCode">{view.zipCode}</OptionalLabel>
            <input
              id="zipCode"
              value={form.zipCode}
              onChange={(event) => updateField("zipCode", event.target.value)}
              className={inputClassName(false)}
            />
          </div>

          <div className="space-y-1.5">
            <OptionalLabel htmlFor="country">{view.country}</OptionalLabel>
            <input
              id="country"
              value={form.country}
              onChange={(event) => updateField("country", event.target.value)}
              className={inputClassName(false)}
            />
          </div>
        </div>
      </EditSectionCard>

      {formError ? (
        <p className="text-sm text-red-400" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saveDisabled}
          className={buttonClassName({ size: "md" })}
        >
          {isSaving ? labels.saving : labels.saveChanges}
        </button>
        <Link
          href="/client/profile"
          className={buttonClassName({ variant: "secondary", size: "md" })}
        >
          {labels.backToProfile}
        </Link>
      </div>
    </form>
  );
}
