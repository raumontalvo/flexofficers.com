"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName, ProfileAvatar } from "@/components/ui";
import { interpolate } from "@/lib/app-i18n";
import { cn } from "@/lib/cn";
import type { SerializedClientProfile } from "@/lib/client-profile-page-data";
import {
  resolveProfilePhotoUrl,
  validateProfilePhotoFile,
} from "@/lib/profile-photo";

type ClientProfileViewProps = {
  profile: SerializedClientProfile;
};

function ProfileSectionCard({
  title,
  helper,
  children,
  className,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "fo-glass-card h-auto self-start rounded-xl border border-white/10 p-4 sm:p-5",
        className
      )}
    >
      <h2 className="text-base font-semibold text-fo-text">{title}</h2>
      {helper ? <p className="mt-1 text-sm text-fo-text-muted">{helper}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailField({
  label,
  value,
  required,
  badge,
  notProvided,
  optionalLabel,
}: {
  label: string;
  value: string | null | undefined;
  required?: boolean;
  badge?: React.ReactNode;
  notProvided: string;
  optionalLabel: string;
}) {
  const trimmed = value?.trim();

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fo-text-subtle">
        {label}
        {required ? <span className="text-red-400"> *</span> : null}
        {!required ? (
          <span className="ml-1 font-normal normal-case tracking-normal text-fo-text-muted">
            ({optionalLabel})
          </span>
        ) : null}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-fo-text">
          {trimmed || notProvided}
        </p>
        {badge}
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-center">
      <p className="text-2xl font-bold text-fo-text">{value}</p>
      <p className="mt-1 text-xs text-fo-text-muted">{label}</p>
    </div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3">
      <span className="text-sm font-medium text-fo-text">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-fo-primary-bright" : "bg-white/15",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

function ProfileHeroPhoto({
  name,
  imageUrl,
  changePhotoLabel,
  onPhotoSaved,
}: {
  name: string;
  imageUrl: string | null;
  changePhotoLabel: string;
  onPhotoSaved: (url: string) => void;
}) {
  const { isLoaded, user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const displayUrl = localUrl || imageUrl;

  async function handleFileSelected(file: File | null) {
    if (!file || !user || !isLoaded) {
      return;
    }

    setError(null);
    const validation = validateProfilePhotoFile({
      size: file.size,
      type: file.type,
      name: file.name,
    });

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalUrl(objectUrl);
    setIsUploading(true);

    try {
      const imageResource = await user.setProfileImage({ file });
      await user.reload();
      const uploadedUrl =
        imageResource.publicUrl?.trim() ||
        user.imageUrl?.trim() ||
        resolveProfilePhotoUrl("", user.imageUrl);

      if (!uploadedUrl) {
        throw new Error("upload failed");
      }

      const response = await fetch("/api/client/profile/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePhotoUrl: uploadedUrl }),
      });

      if (!response.ok) {
        throw new Error("save failed");
      }

      onPhotoSaved(uploadedUrl);
      URL.revokeObjectURL(objectUrl);
      setLocalUrl(null);
    } catch {
      setError("Failed to upload photo.");
      setLocalUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="relative shrink-0">
      <ProfileAvatar
        name={name}
        src={displayUrl}
        size="xl"
        className="h-20 w-20 text-xl sm:h-24 sm:w-24 sm:text-2xl"
      />
      <button
        type="button"
        disabled={isUploading || !isLoaded}
        onClick={() => fileInputRef.current?.click()}
        className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/40 bg-[#0a1628] text-blue-200 shadow-[0_0_16px_rgba(59,130,246,0.35)] transition hover:border-blue-400 hover:text-white"
        aria-label={changePhotoLabel}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7.5h2.5l2-2h7l2 2H20a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          void handleFileSelected(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      {error ? (
        <p className="absolute left-0 top-full mt-1 w-40 text-[11px] text-red-400">{error}</p>
      ) : null}
    </div>
  );
}

export function ClientProfileView({ profile: initialProfile }: ClientProfileViewProps) {
  const router = useRouter();
  const { t } = useLandingLanguage();
  const labels = t.client.clientProfile.view;
  const editLabels = t.client.clientProfile.edit;
  const notProvided = t.commonExtras.notProvided;
  const [profile, setProfile] = useState(initialProfile);
  const [prefs, setPrefs] = useState(profile.notifications);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  async function savePreferences() {
    setIsSavingPrefs(true);
    setPrefsMessage(null);

    try {
      const response = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        throw new Error("save failed");
      }

      const data = (await response.json()) as {
        notifications: typeof prefs;
      };
      setPrefs(data.notifications);
      setPrefsMessage(labels.preferencesSaved);
      router.refresh();
    } catch {
      setPrefsMessage(labels.preferencesSaveFailed);
    } finally {
      setIsSavingPrefs(false);
    }
  }

  function activityTitle(item: (typeof profile.recentActivity)[number]) {
    switch (item.title) {
      case "lead_created":
        return labels.activityLeadCreated;
      case "company_applied":
        return interpolate(labels.activityCompanyApplied, {
          company: item.subtitle ?? "Company",
        });
      case "company_accepted":
        return interpolate(labels.activityCompanyAccepted, {
          company: item.subtitle ?? "Company",
        });
      case "request_completed":
        return labels.activityRequestCompleted;
      default:
        return item.title;
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fo-text">{labels.title}</h1>
          <p className="mt-1 text-sm text-fo-text-muted">{labels.subtitle}</p>
        </div>
        <Link
          href="/client/profile/edit"
          className={buttonClassName({ size: "md", className: "shrink-0 self-start" })}
        >
          {labels.editProfile}
        </Link>
      </div>

      <section className="fo-glass-card rounded-2xl border border-white/10 p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ProfileHeroPhoto
              name={profile.contactName}
              imageUrl={profile.profilePhotoUrl}
              changePhotoLabel={labels.changePhoto}
              onPhotoSaved={(url) =>
                setProfile((current) => ({ ...current, profilePhotoUrl: url }))
              }
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-fo-text sm:text-2xl">
                  {profile.contactName}
                </h2>
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-blue-100">
                  {labels.clientBadge}
                </span>
              </div>
              <p className="mt-2 text-sm text-fo-text-muted">
                {interpolate(labels.memberSince, { date: profile.memberSinceLabel })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[320px]">
            <StatBlock label={labels.statSecurityRequests} value={profile.stats.securityRequests} />
            <StatBlock label={labels.statApplications} value={profile.stats.applications} />
            <StatBlock label={labels.statCompleted} value={profile.stats.completed} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-4">
          <ProfileSectionCard title={labels.personalInformation}>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField
                label={labels.fullName}
                value={profile.contactName}
                required
                notProvided={notProvided}
                optionalLabel={labels.optional}
              />
              <DetailField
                label={labels.emailAddress}
                value={profile.email}
                required
                notProvided={notProvided}
                optionalLabel={labels.optional}
                badge={
                  profile.emailVerified ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                      {labels.verified}
                    </span>
                  ) : null
                }
              />
              <DetailField
                label={labels.phoneNumber}
                value={profile.phone}
                required
                notProvided={notProvided}
                optionalLabel={labels.optional}
              />
              <DetailField
                label={labels.businessName}
                value={profile.companyName}
                notProvided={notProvided}
                optionalLabel={labels.optional}
              />
              <DetailField
                label={labels.industry}
                value={profile.industry}
                notProvided={notProvided}
                optionalLabel={labels.optional}
              />
              <DetailField
                label={labels.website}
                value={profile.website}
                notProvided={notProvided}
                optionalLabel={labels.optional}
              />
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard
            title={labels.businessAddress}
            helper={labels.businessAddressHelper}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label={labels.address} value={profile.address} notProvided={notProvided} optionalLabel={labels.optional} />
              <DetailField label={labels.city} value={profile.city} notProvided={notProvided} optionalLabel={labels.optional} />
              <DetailField label={labels.state} value={profile.state} notProvided={notProvided} optionalLabel={labels.optional} />
              <DetailField label={labels.zipCode} value={profile.zipCode} notProvided={notProvided} optionalLabel={labels.optional} />
              <DetailField label={labels.country} value={profile.country} notProvided={notProvided} optionalLabel={labels.optional} />
            </div>
          </ProfileSectionCard>
        </div>

        <div className="space-y-4">
          <ProfileSectionCard title={labels.billingSummary}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fo-text-subtle">
                  {labels.totalSpent}
                </p>
                <p className="mt-1 text-2xl font-bold text-fo-text">
                  {profile.billing.totalSpentLabel}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fo-text-subtle">
                  {labels.latestPaymentMethod}
                </p>
                <p className="mt-1 text-sm text-fo-text">
                  {profile.billing.paymentMethodLabel ?? labels.noPaymentMethod}
                </p>
              </div>
              <Link
                href="/client/billing"
                className={buttonClassName({ size: "md", className: "w-full" })}
              >
                {labels.managePaymentMethods}
              </Link>
              <Link
                href="/client/billing"
                className="block text-center text-sm text-blue-200 transition hover:text-blue-100"
              >
                {labels.viewBillingHistory}
              </Link>
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard title={labels.notificationPreferences}>
            <div className="space-y-2.5">
              <ToggleSwitch
                label={labels.emailNotifications}
                checked={prefs.emailNotifications}
                onChange={(next) => setPrefs((current) => ({ ...current, emailNotifications: next }))}
                disabled={isSavingPrefs}
              />
              <ToggleSwitch
                label={labels.newCompanyApplications}
                checked={prefs.newCompanyApplications}
                onChange={(next) =>
                  setPrefs((current) => ({ ...current, newCompanyApplications: next }))
                }
                disabled={isSavingPrefs}
              />
              <ToggleSwitch
                label={labels.messages}
                checked={prefs.messages}
                onChange={(next) => setPrefs((current) => ({ ...current, messages: next }))}
                disabled={isSavingPrefs}
              />
              <ToggleSwitch
                label={labels.marketingEmails}
                checked={prefs.marketingEmails}
                onChange={(next) => setPrefs((current) => ({ ...current, marketingEmails: next }))}
                disabled={isSavingPrefs}
              />
              <button
                type="button"
                onClick={() => void savePreferences()}
                disabled={isSavingPrefs}
                className={buttonClassName({
                  size: "md",
                  className: "mt-2 w-full",
                })}
              >
                {isSavingPrefs ? labels.savingPreferences : labels.savePreferences}
              </button>
              {prefsMessage ? (
                <p
                  className={cn(
                    "text-xs",
                    prefsMessage === labels.preferencesSaved
                      ? "text-emerald-300"
                      : "text-red-400"
                  )}
                >
                  {prefsMessage}
                </p>
              ) : null}
            </div>
          </ProfileSectionCard>
        </div>
      </div>

      <ProfileSectionCard title={labels.recentActivity}>
        {profile.recentActivity.length === 0 ? (
          <p className="text-sm text-fo-text-muted">{labels.noRecentActivity}</p>
        ) : (
          <ol className="relative space-y-0 border-l border-blue-500/20 pl-5">
            {profile.recentActivity.map((item, index) => (
              <li key={item.id} className="relative pb-5 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[1.625rem] top-1.5 h-3 w-3 rounded-full border-2 border-[#040a14]",
                    index === 0 ? "bg-fo-primary-bright" : "bg-blue-500/40"
                  )}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-fo-text">{activityTitle(item)}</p>
                {item.subtitle && item.title !== "company_applied" && item.title !== "company_accepted" ? (
                  <p className="mt-0.5 text-sm text-fo-text-muted">{item.subtitle}</p>
                ) : null}
                <p className="mt-1 text-xs text-fo-text-subtle">{item.timestampLabel}</p>
              </li>
            ))}
          </ol>
        )}
      </ProfileSectionCard>
    </div>
  );
}
