"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

type CompanyProfileFormProps = {
  initialForm: {
    logoUrl: string;
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    address: string;
    website: string;
  };
};

const fieldClassName =
  "min-h-12 w-full rounded-fo-button border border-fo-border bg-fo-bg-elevated px-4 py-3 text-base text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/30";

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

function getCompanyInitials(name: string) {
  if (!name.trim()) {
    return "CO";
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "CO";
}

function CompanyLogoPreview({
  companyName,
  logoUrl,
}: {
  companyName: string;
  logoUrl: string;
}) {
  const [hasError, setHasError] = useState(false);
  const showImage = logoUrl.trim().length > 0 && !hasError;

  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  if (showImage) {
    return (
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-fo-border-strong bg-fo-bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={companyName ? `${companyName} logo` : "Company logo preview"}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-fo-border-strong bg-fo-bg-elevated text-xl font-bold text-fo-text">
      {getCompanyInitials(companyName)}
    </div>
  );
}

export default function CompanyProfileForm({
  initialForm,
}: CompanyProfileFormProps) {
  const [form, setForm] = useState(initialForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/company/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Company profile saved!");
    } else {
      alert("Failed to save company profile");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card variant="elevated" className="space-y-5">
        <CardHeader>
          <CardTitle>Logo & company identity</CardTitle>
          <CardDescription>
            Add your logo URL and company name shown to officers.
          </CardDescription>
        </CardHeader>

        <div className="flex items-center gap-4">
          <CompanyLogoPreview
            companyName={form.companyName}
            logoUrl={form.logoUrl}
          />

          <div className="min-w-0 flex-1 space-y-2">
            <FieldLabel htmlFor="logoUrl">Company logo URL</FieldLabel>
            <input
              id="logoUrl"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className={fieldClassName}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="companyName">Company name</FieldLabel>
          <input
            id="companyName"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={fieldClassName}
            placeholder="Company name"
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Contact person</CardTitle>
          <CardDescription>
            Who should officers reach out to after acceptance?
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <FieldLabel htmlFor="contactName">Contact person</FieldLabel>
          <input
            id="contactName"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className={fieldClassName}
            placeholder="Full name"
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Phone & email</CardTitle>
          <CardDescription>
            Contact details shared with accepted officers.
          </CardDescription>
        </CardHeader>

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
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Address & website</CardTitle>
          <CardDescription>
            Help officers know where to report and learn more about your company.
          </CardDescription>
        </CardHeader>

        <div className="space-y-2">
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <input
            id="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className={fieldClassName}
            placeholder="Street address, city, state"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="website">Website</FieldLabel>
          <input
            id="website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className={fieldClassName}
            placeholder="https://yourcompany.com (optional)"
          />
        </div>
      </Card>

      <Button type="submit" fullWidth className="w-full">
        Save Company Profile
      </Button>
    </form>
  );
}
