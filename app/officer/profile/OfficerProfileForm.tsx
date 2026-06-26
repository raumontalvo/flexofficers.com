"use client";

import { useEffect, useState } from "react";
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
  AVAILABILITY_OPTIONS,
  CERTIFICATION_OPTIONS,
  EXPERIENCE_CATEGORIES,
} from "@/lib/profile-options";

type OfficerProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  profilePhotoUrl: string;
  armedStatus: "" | "ARMED" | "UNARMED";
  experienceYears: string;
  licenseExpirationDate: string;
  availability: string[];
  certifications: string[];
  experienceCategories: string[];
  introduction: string;
};

type OfficerProfileFormProps = {
  initialForm: OfficerProfileFormState;
};

const fieldClassName =
  "min-h-12 w-full rounded-fo-button border border-fo-border bg-fo-bg-elevated px-4 py-3 text-base text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

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

export default function OfficerProfileForm({
  initialForm,
}: OfficerProfileFormProps) {
  const [form, setForm] = useState(initialForm);
  const displayName = `${form.firstName} ${form.lastName}`.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/officer/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Officer profile saved!");
    } else {
      alert("Failed to save officer profile");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card variant="elevated" className="space-y-5">
        <CardHeader>
          <CardTitle>Profile photo & basic info</CardTitle>
          <CardDescription>
            Add a photo URL and contact details companies may review.
          </CardDescription>
        </CardHeader>

        <div className="flex items-center gap-4">
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
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
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
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Security experience</CardTitle>
          <CardDescription>
            Help companies understand your background and credentials.
          </CardDescription>
        </CardHeader>

        <div className="space-y-3">
          <FieldLabel>Armed status</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            {(["ARMED", "UNARMED"] as const).map((status) => {
              const isSelected = form.armedStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setForm({ ...form, armedStatus: status })}
                  className={cn(
                    "min-h-12 rounded-fo-button border px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
                    isSelected
                      ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-hover"
                      : "border-fo-border bg-fo-bg-elevated text-fo-text-muted hover:border-fo-border-strong hover:text-fo-text"
                  )}
                >
                  {status === "ARMED" ? "Armed" : "Unarmed"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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

          <div className="space-y-2">
            <FieldLabel htmlFor="licenseExpirationDate">
              License expiration date
            </FieldLabel>
            <input
              id="licenseExpirationDate"
              type="date"
              value={form.licenseExpirationDate}
              onChange={(e) =>
                setForm({ ...form, licenseExpirationDate: e.target.value })
              }
              className={fieldClassName}
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>
            Tap the times and schedules that fit you.
          </CardDescription>
        </CardHeader>

        <TagToggleGroup
          label="When can you work?"
          options={AVAILABILITY_OPTIONS}
          selected={form.availability}
          onChange={(availability) => setForm({ ...form, availability })}
        />
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Select any certifications you currently hold.
          </CardDescription>
        </CardHeader>

        <TagToggleGroup
          label="Your certifications"
          options={CERTIFICATION_OPTIONS}
          selected={form.certifications}
          onChange={(certifications) => setForm({ ...form, certifications })}
        />
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Experience categories</CardTitle>
          <CardDescription>
            Highlight the types of sites and assignments you know best.
          </CardDescription>
        </CardHeader>

        <TagToggleGroup
          label="Where you have experience"
          options={EXPERIENCE_CATEGORIES}
          selected={form.experienceCategories}
          onChange={(experienceCategories) =>
            setForm({ ...form, experienceCategories })
          }
        />
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Short introduction</CardTitle>
          <CardDescription>
            A brief note companies can read when reviewing your profile.
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <textarea
            value={form.introduction}
            maxLength={300}
            onChange={(e) => setForm({ ...form, introduction: e.target.value })}
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
      </Card>

      <Button type="submit" fullWidth className="w-full">
        Save Officer Profile
      </Button>
    </form>
  );
}
