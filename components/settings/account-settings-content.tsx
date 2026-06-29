"use client";

import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";
import { DeleteAccountDialog } from "./delete-account-dialog";

const SUPPORT_PHONE = "239-900-5653";
const SUPPORT_PHONE_HREF = "tel:+12399005653";

export const OFFICER_PRIVACY_ITEMS = [
  "Companies can view your profile after you apply to a shift.",
  "Your phone number and email are shared only after you are accepted for a shift.",
  "License information is self-reported by officers.",
];

export const COMPANY_PRIVACY_ITEMS = [
  "Officer profiles are visible when they apply to your shifts.",
  "Your company contact information may be shared with accepted officers.",
  "You are responsible for verifying officer licenses and credentials.",
];

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

function SignOutRow() {
  return (
    <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-fo-text">Sign Out</p>
        <p className="text-sm text-fo-text-muted">
          Sign out of FlexOfficers on this device.
        </p>
      </div>
      <SignOutButton redirectUrl="/">
        <button
          type="button"
          className={cn(actionButtonClassName, "w-full min-h-12 sm:w-auto sm:min-h-9")}
        >
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}

type AccountSettingsContentProps = {
  privacyItems: string[];
  deleteDescription: string;
};

export function AccountSettingsContent({
  privacyItems,
  deleteDescription,
}: AccountSettingsContentProps) {
  const { isLoaded, user } = useUser();
  const { openUserProfile } = useClerk();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "No email on file";

  const passwordLabel = user?.passwordEnabled
    ? "••••••••••"
    : "Managed through your sign-in provider";

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
        <p className="text-sm text-fo-text-muted">Loading account settings…</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">Account Security</CardTitle>
            <CardDescription>
              Manage your email and password. Your account is securely managed by
              Clerk.
            </CardDescription>
          </CardHeader>

          <div className="mt-4">
            <SettingsRow
              label="Email Address"
              value={email}
              actionLabel="Change Email"
              onAction={() => openClerkProfile("/email-addresses")}
            />
            <SettingsRow
              label="Password"
              value={passwordLabel}
              actionLabel="Change Password"
              onAction={() => openClerkProfile("/password")}
            />
            <SignOutRow />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-fo-text-subtle">
            Your account is securely managed by Clerk. We never store your
            password.
          </p>
        </Card>

        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">Privacy &amp; Safety</CardTitle>
            <CardDescription>
              Learn how your information is used and shared.
            </CardDescription>
          </CardHeader>

          <ul className="mt-4 space-y-3">
            {privacyItems.map((item) => (
              <PrivacyBullet key={item}>{item}</PrivacyBullet>
            ))}
          </ul>
        </Card>

        <Card variant="elevated" className="fo-glass-card border border-white/10">
          <CardHeader className="mb-0">
            <CardTitle className="text-lg">Contact Support</CardTitle>
            <CardDescription>
              Need help? Our support team is here for you.
            </CardDescription>
          </CardHeader>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
              Call Us
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
                {copiedPhone ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-fo-text-muted">
              We&apos;re available Monday – Friday, 9AM – 6PM EST.
            </p>
          </div>
        </Card>

        <Card
          variant="elevated"
          className="fo-glass-card border border-red-500/30 bg-red-950/10"
        >
          <CardHeader className="mb-0">
            <CardTitle className="text-lg text-red-200">Danger Zone</CardTitle>
            <CardDescription className="text-red-200/70">
              Permanently delete your FlexOfficers account.
            </CardDescription>
          </CardHeader>

          <div className="mt-4 space-y-4 rounded-lg border border-red-500/20 bg-red-950/10 p-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-100">Delete Account</p>
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
              Delete Account
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
