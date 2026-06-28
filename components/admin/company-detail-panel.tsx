"use client";

import { useEffect, useState } from "react";
import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import {
  formatAdminDate,
  formatDaysRemaining,
  type SerializedAdminCompany,
} from "@/lib/admin-companies";
import { Button, StatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";

const PRESET_DAYS = [7, 14, 30, 60, 90] as const;

type DetailTab = "overview" | "access" | "activity" | "details";

type CompanyDetailPanelProps = {
  company: SerializedAdminCompany | null;
  onClose: () => void;
  onUpdated: () => void;
};

function accessBadgeVariant(status: CompanyAccessStatus) {
  switch (status) {
    case CompanyAccessStatus.ACTIVE:
      return "success" as const;
    case CompanyAccessStatus.TRIAL:
      return "info" as const;
    case CompanyAccessStatus.EXPIRED:
    default:
      return "rejected" as const;
  }
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-fo-text">{value?.trim() || "—"}</dd>
    </div>
  );
}

export function CompanyDetailPanel({
  company,
  onClose,
  onUpdated,
}: CompanyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [customDays, setCustomDays] = useState("30");
  const [reason, setReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setActiveTab("overview");
      setCustomDays("30");
      setReason("");
      setSelectedPreset(null);
      setError(null);
    }
  }, [company?.id]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (company) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [company, onClose]);

  async function extendTrial(days: number) {
    if (!company) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/companies/${company.id}/extend-trial`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            days,
            reason: reason.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Failed to extend trial");
      }

      onUpdated();
    } catch (extendError) {
      setError(
        extendError instanceof Error
          ? extendError.message
          : "Failed to extend trial"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateAccessStatus(action: "mark_active" | "expire") {
    if (!company) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/companies/${company.id}/access-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Failed to update access status");
      }

      onUpdated();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update access status"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleExtendSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const days =
      selectedPreset ?? Number.parseInt(customDays, 10);

    if (!Number.isInteger(days) || days < 1 || days > 365) {
      setError("Custom days must be an integer between 1 and 365.");
      return;
    }

    void extendTrial(days);
  }

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "access", label: "Access & Billing" },
    { id: "activity", label: "Activity" },
    { id: "details", label: "Details" },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Close company detail panel"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity",
          company ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#07101c]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          company ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!company}
      >
        {company ? (
          <>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-fo-text-muted">
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt=""
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        company.companyName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-fo-text">
                        {company.companyName}
                      </h2>
                      <p className="truncate text-sm text-fo-text-muted">
                        {company.contactEmail}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      activeTab === tab.id
                        ? "bg-fo-primary-bright/20 text-fo-primary-hover"
                        : "text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {activeTab === "overview" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                        Current status
                      </p>
                      <p className="mt-1 text-sm text-fo-text">
                        {company.statusLabel}
                      </p>
                    </div>
                    <StatusBadge variant={accessBadgeVariant(company.effectiveStatus)}>
                      {company.effectiveStatus}
                    </StatusBadge>
                  </div>

                  <dl className="grid gap-4 sm:grid-cols-2">
                    <DetailField label="Contact" value={company.contactName} />
                    <DetailField label="Phone" value={company.phone} />
                    <DetailField label="City" value={company.city} />
                    <DetailField label="State" value={company.state} />
                    <DetailField label="Plan" value={company.planLabel} />
                    <DetailField
                      label="Open shifts"
                      value={String(company.shiftCount)}
                    />
                  </dl>
                </div>
              ) : null}

              {activeTab === "access" ? (
                <div className="space-y-5">
                  <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      Access Status
                    </h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Current status"
                        value={company.effectiveStatus}
                      />
                      <DetailField
                        label="Stored status"
                        value={company.accessStatus}
                      />
                      <DetailField
                        label="Trial started"
                        value={formatAdminDate(company.trialStartedAt)}
                      />
                      <DetailField
                        label="Trial ends"
                        value={formatAdminDate(company.trialEndsAt)}
                      />
                      <DetailField
                        label="Days remaining"
                        value={formatDaysRemaining(company.daysRemaining)}
                      />
                      <DetailField label="Plan" value={company.planLabel} />
                    </dl>
                  </section>

                  <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      Extend Trial
                    </h3>
                    <p className="mt-1 text-xs text-fo-text-muted">
                      Active trials extend from the current end date. Expired
                      trials restart from today.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {PRESET_DAYS.map((days) => (
                        <button
                          key={days}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => {
                            setSelectedPreset(days);
                            setCustomDays(String(days));
                          }}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                            selectedPreset === days
                              ? "border-fo-primary-bright/50 bg-fo-primary-bright/15 text-fo-primary-hover"
                              : "border-white/10 text-fo-text-muted hover:bg-white/[0.04] hover:text-fo-text"
                          )}
                        >
                          +{days}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleExtendSubmit} className="mt-4 space-y-3">
                      <label className="block text-xs font-medium text-fo-text-muted">
                        Custom Days
                        <input
                          type="number"
                          min={1}
                          max={365}
                          value={customDays}
                          onChange={(event) => {
                            setCustomDays(event.target.value);
                            setSelectedPreset(null);
                          }}
                          className="mt-1 w-full rounded-lg border border-fo-border bg-fo-bg px-3 py-2 text-sm text-fo-text"
                          disabled={isSubmitting}
                        />
                      </label>

                      <label className="block text-xs font-medium text-fo-text-muted">
                        Reason (optional)
                        <input
                          type="text"
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
                          maxLength={500}
                          placeholder="Sales follow-up, onboarding delay, etc."
                          className="mt-1 w-full rounded-lg border border-fo-border bg-fo-bg px-3 py-2 text-sm text-fo-text"
                          disabled={isSubmitting}
                        />
                      </label>

                      <Button type="submit" size="md" disabled={isSubmitting}>
                        {isSubmitting ? "Extending..." : "Extend"}
                      </Button>
                    </form>
                  </section>

                  <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      Audit Information
                    </h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Last trial extension"
                        value={formatAdminDate(company.trialExtendedAt)}
                      />
                      <DetailField
                        label="Extended by"
                        value={
                          company.trialExtendedByEmail ??
                          company.trialExtendedByAdminId
                        }
                      />
                      <div className="sm:col-span-2">
                        <DetailField
                          label="Reason"
                          value={company.trialExtensionReason}
                        />
                      </div>
                    </dl>
                  </section>

                  <section className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      Stripe (future)
                    </h3>
                    <p className="mt-1 text-xs text-fo-text-muted">
                      Subscription billing will connect here when Stripe is
                      enabled.
                    </p>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Customer ID"
                        value={company.stripeCustomerId}
                      />
                      <DetailField
                        label="Subscription ID"
                        value={company.stripeSubscriptionId}
                      />
                    </dl>
                  </section>
                </div>
              ) : null}

              {activeTab === "activity" ? (
                <div className="space-y-4">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <DetailField
                      label="Account created"
                      value={formatAdminDate(company.createdAt)}
                    />
                    <DetailField
                      label="Last updated"
                      value={formatAdminDate(company.updatedAt)}
                    />
                    <DetailField
                      label="Last trial extension"
                      value={formatAdminDate(company.trialExtendedAt)}
                    />
                    <DetailField
                      label="Shifts posted"
                      value={String(company.shiftCount)}
                    />
                  </dl>
                  <p className="text-xs leading-relaxed text-fo-text-muted">
                    Full audit log history will appear here as admin actions are
                    recorded.
                  </p>
                </div>
              ) : null}

              {activeTab === "details" ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Company" value={company.companyName} />
                  <DetailField label="Contact" value={company.contactName} />
                  <DetailField label="Email" value={company.contactEmail} />
                  <DetailField label="Phone" value={company.phone} />
                  <DetailField label="Website" value={company.website} />
                  <DetailField label="Address" value={company.address} />
                  <DetailField label="City" value={company.city} />
                  <DetailField label="State" value={company.state} />
                  <DetailField
                    label="Verified"
                    value={company.verified ? "Yes" : "No"}
                  />
                </dl>
              ) : null}

              {error ? <p className="mt-4 text-xs text-red-300">{error}</p> : null}
            </div>

            <div className="border-t border-white/[0.06] px-5 py-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-500"
                  disabled={isSubmitting}
                  onClick={() => updateAccessStatus("mark_active")}
                >
                  Mark as Active (Paid)
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  disabled={isSubmitting}
                  onClick={() => updateAccessStatus("expire")}
                >
                  Expire Trial / Revoke Access
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
