"use client";

import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LandingTranslations } from "@/lib/landing-i18n";
import { DeleteAccountDialog } from "./delete-account-dialog";

const SUPPORT_PHONE = "239-900-5653";
const SUPPORT_PHONE_HREF = "tel:+12399005653";

const actionButtonClassName =
  "inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs font-semibold text-fo-primary-bright transition hover:border-fo-primary-bright hover:bg-fo-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fo-primary-bright/40 disabled:cursor-not-allowed disabled:opacity-50";

type SettingsRowProps = {
  label: string;
  value: string;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
};

function SettingsRow({
  label,
  value,
  actionLabel,
  onAction,
  actionDisabled = false,
}: SettingsRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/[0.06] py-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-fo-text">{label}</p>
        <p className="break-all text-sm text-fo-text-muted">{value}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={actionDisabled}
        className={cn(actionButtonClassName, "w-full sm:w-auto sm:min-h-9 min-h-12")}
      >
        {actionLabel}
      </button>
    </div>
  );
}

function PrivacyBullet({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-fo-text-muted">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fo-primary-bright/80" />
      <span>{children}</span>
    </li>
  );
}

function SignOutRow({
  copy,
}: {
  copy: LandingTranslations["settings"]["signOut"];
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-fo-text">{copy.title}</p>
        <p className="text-sm text-fo-text-muted">{copy.description}</p>
      </div>
      <SignOutButton redirectUrl="/">
        <button
          type="button"
          className={cn(actionButtonClassName, "w-full min-h-12 sm:w-auto sm:min-h-9")}
        >
          {copy.button}
        </button>
      </SignOutButton>
    </div>
  );
}

type AccountSettingsContentProps = {
  role: "officer" | "company";
};

export function AccountSettingsContent({ role }: AccountSettingsContentProps) {
  const { t } = useLandingLanguage();
  const settings = t.settings;
  const { isLoaded, user } = useUser();
  const { openUserProfile } = useClerk();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const privacyItems =
    role === "officer"
      ? settings.privacy.officerItems
      : settings.privacy.companyItems;

  const deleteDescription =
    role === "officer"
      ? settings.danger.officerDeleteDescription
      : settings.danger.companyDeleteDescription;

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    settings.accountSecurity.noEmail;

  const passwordLabel = user?.passwordEnabled
    ? "••••••••••"
    : settings.accountSecurity.managedByProvider;

  function openClerkProfile(path: string) {
    openUserProfile({
      __experimental_startPath: path,
    });
  }

  async function handleCopyPhone() {
    try {
      await navigator.clipboard.writeText(SUPPORT_PHONE);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      setCopiedPhone(false);
    }
  }

  if (!isLoaded) {
    return (
      <Card variant="elevated" className="fo-glass-card border border-white/10">
        <p className="text-sm text-fo-text-muted">{settings.loading}</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">{settings.accountSecurity.title}</CardTitle>
            <CardDescription>{settings.accountSecurity.description}</CardDescription>
          </CardHeader>

          <div className="mt-4">
            <SettingsRow
              label={settings.accountSecurity.emailLabel}
              value={email}
              actionLabel={settings.accountSecurity.changeEmail}
              onAction={() => openClerkProfile("/email-addresses")}
            />
            <SettingsRow
              label={settings.accountSecurity.passwordLabel}
              value={passwordLabel}
              actionLabel={settings.accountSecurity.changePassword}
              onAction={() => openClerkProfile("/password")}
            />
            <SignOutRow copy={settings.signOut} />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-fo-text-subtle">
            {settings.accountSecurity.clerkFootnote}
          </p>
        </Card>

        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">{settings.language.title}</CardTitle>
            <CardDescription>{settings.language.description}</CardDescription>
          </CardHeader>

          <div className="mt-4 flex justify-start sm:justify-end">
            <LanguageToggle />
          </div>
        </Card>

        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">{settings.privacy.title}</CardTitle>
            <CardDescription>{settings.privacy.description}</CardDescription>
          </CardHeader>

          <ul className="mt-4 space-y-3">
            {privacyItems.map((item) => (
              <PrivacyBullet key={item}>{item}</PrivacyBullet>
            ))}
          </ul>
        </Card>

        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">{settings.contact.title}</CardTitle>
            <CardDescription>{settings.contact.description}</CardDescription>
          </CardHeader>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
              {settings.contact.callUs}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={SUPPORT_PHONE_HREF}
                className="text-2xl font-bold tracking-tight text-fo-primary-bright transition hover:text-fo-primary-hover sm:text-3xl"
              >
                {SUPPORT_PHONE}
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className={cn(actionButtonClassName, "min-h-8")}
              >
                {copiedPhone ? settings.contact.copied : settings.contact.copy}
              </button>
            </div>
            <p className="text-xs text-fo-text-muted">{settings.contact.hours}</p>
          </div>
        </Card>

        <Card
          variant="elevated"
          className="fo-glass-card border border-red-500/30 bg-red-950/10"
        >
          <CardHeader className="mb-0">
            <CardTitle className="text-lg text-red-200">{settings.danger.title}</CardTitle>
            <CardDescription className="text-red-200/70">
              {settings.danger.description}
            </CardDescription>
          </CardHeader>

          <div className="mt-4 space-y-4 rounded-lg border border-red-500/20 bg-red-950/10 p-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-100">
                {settings.danger.deleteAccount}
              </p>
              <p className="text-sm leading-relaxed text-red-200/70">
                {deleteDescription}
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => setDeleteDialogOpen(true)}
              className="bg-red-600 hover:bg-red-500"
            >
              {settings.danger.deleteButton}
            </Button>
          </div>
        </Card>
      </div>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
