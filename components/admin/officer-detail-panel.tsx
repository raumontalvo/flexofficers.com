"use client";

import { useEffect, useState } from "react";
import {
  formatAdminDate,
  formatDaysRemaining,
  formatLocation,
  type SerializedAdminOfficer,
} from "@/lib/admin-officers";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";
import { Button, StatusBadge } from "@/components/ui";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { cn } from "@/lib/cn";

type DetailTab = "overview" | "licenses" | "activity" | "notes";

type OfficerDetailPanelProps = {
  officer: SerializedAdminOfficer | null;
  onClose: () => void;
};

function statusBadgeVariant(status: SerializedAdminOfficer["accountStatus"]) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "PENDING":
      return "pending" as const;
    case "INACTIVE":
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

export function OfficerDetailPanel({ officer, onClose }: OfficerDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  useEffect(() => {
    if (officer) {
      setActiveTab("overview");
    }
  }, [officer?.id]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (officer) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [officer, onClose]);

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "licenses", label: "Licenses" },
    { id: "activity", label: "Activity" },
    { id: "notes", label: "Notes & Admin" },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Close officer detail panel"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity",
          officer ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#07101c]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          officer ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!officer}
      >
        {officer ? (
          <>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <ProfileAvatar
                      name={officer.fullName}
                      src={officer.profilePhotoUrl}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-bold text-fo-text">
                          {officer.fullName}
                        </h2>
                        <StatusBadge variant={statusBadgeVariant(officer.accountStatus)}>
                          {officer.accountStatus}
                        </StatusBadge>
                      </div>
                      <p className="mt-1 truncate text-sm text-fo-text-muted">
                        {officer.email}
                      </p>
                      <p className="mt-1 text-sm text-fo-text-muted">
                        {formatLocation(officer.city, officer.state)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-fo-text-muted transition hover:bg-white/[0.04] hover:text-fo-text"
                >
                  X
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
                  <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      Profile Information
                    </h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <DetailField label="Full name" value={officer.fullName} />
                      <DetailField label="Phone" value={officer.phone} />
                      <DetailField label="City" value={officer.city} />
                      <DetailField label="State" value={officer.state} />
                      <DetailField
                        label="Member since"
                        value={formatAdminDate(officer.joinedAt)}
                      />
                    </dl>
                  </section>

                  <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      License Summary
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-fo-text-muted">
                      {LICENSE_DISPLAY_DISCLAIMER}
                    </p>

                    {officer.licenses.length === 0 ? (
                      <p className="mt-4 text-sm text-fo-text-muted">
                        No licenses submitted.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {officer.licenses.map((license) => (
                          <div
                            key={license.id}
                            className="rounded-lg border border-white/10 bg-fo-bg/40 p-3"
                          >
                            <p className="text-sm font-semibold text-fo-text">
                              {license.licenseType}
                            </p>
                            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                              <DetailField
                                label="License number"
                                value={license.licenseNumber}
                              />
                              <DetailField
                                label="Issuing state"
                                value={license.issuingState}
                              />
                              <DetailField
                                label="Expiration date"
                                value={formatAdminDate(license.expirationDate)}
                              />
                              <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                                  Days remaining
                                </dt>
                                <dd
                                  className={cn(
                                    "mt-1 text-sm",
                                    license.expired
                                      ? "font-semibold text-red-300"
                                      : "text-fo-text"
                                  )}
                                >
                                  {formatDaysRemaining(
                                    license.daysRemaining,
                                    license.expired
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-sm font-semibold text-fo-text">
                      Approval Status
                    </h3>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <DetailField
                        label="Officer account status"
                        value={officer.accountStatus}
                      />
                      <DetailField
                        label="License certification accepted"
                        value={
                          officer.licenseCertificationAccepted ? "Yes" : "No"
                        }
                      />
                    </dl>
                    <p className="mt-3 text-xs leading-relaxed text-fo-text-muted">
                      Status is derived from submitted profile data and accepted
                      company applications. FlexOfficers does not verify
                      licenses.
                    </p>
                  </section>
                </div>
              ) : null}

              {activeTab === "licenses" ? (
                <div className="space-y-4">
                  <p className="text-xs leading-relaxed text-fo-text-muted">
                    {LICENSE_DISPLAY_DISCLAIMER}
                  </p>

                  {officer.licenses.length === 0 ? (
                    <p className="text-sm text-fo-text-muted">
                      No licenses submitted.
                    </p>
                  ) : (
                    officer.licenses.map((license) => (
                      <div
                        key={license.id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <p className="text-sm font-semibold text-fo-text">
                          {license.licenseType}
                        </p>
                        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                          <DetailField
                            label="License number"
                            value={license.licenseNumber}
                          />
                          <DetailField
                            label="Issuing state"
                            value={license.issuingState}
                          />
                          <DetailField
                            label="Expiration date"
                            value={formatAdminDate(license.expirationDate)}
                          />
                          <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-fo-text-muted">
                              Days remaining
                            </dt>
                            <dd
                              className={cn(
                                "mt-1 text-sm",
                                license.expired
                                  ? "font-semibold text-red-300"
                                  : "text-fo-text"
                              )}
                            >
                              {formatDaysRemaining(
                                license.daysRemaining,
                                license.expired
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ))
                  )}
                </div>
              ) : null}

              {activeTab === "activity" ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <DetailField
                    label="Account created"
                    value={formatAdminDate(officer.joinedAt)}
                  />
                  <DetailField
                    label="Profile updated"
                    value={formatAdminDate(officer.updatedAt)}
                  />
                  <DetailField
                    label="Total applications"
                    value={String(officer.applicationCount)}
                  />
                  <DetailField
                    label="Accepted applications"
                    value={String(officer.acceptedApplicationCount)}
                  />
                  <DetailField
                    label="Pending applications"
                    value={String(officer.pendingApplicationCount)}
                  />
                  <DetailField
                    label="Last application"
                    value={formatAdminDate(officer.lastAppliedAt)}
                  />
                  <DetailField
                    label="Last accepted company"
                    value={officer.lastAcceptedCompany}
                  />
                </dl>
              ) : null}

              {activeTab === "notes" ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                  <h3 className="text-sm font-semibold text-fo-text">
                    Admin notes
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fo-text-muted">
                    No admin notes are stored for this officer yet. Internal note
                    storage will be added in a future update.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/[0.06] px-5 py-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled
                  title="Account suspension controls are not enabled yet"
                >
                  Suspend Officer
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  disabled
                  title="Account deactivation controls are not enabled yet"
                >
                  Deactivate Officer
                </Button>
              </div>
              <p className="mt-2 text-xs text-fo-text-muted">
                Account suspension and deactivation require future admin account
                controls. No changes are made from these buttons yet.
              </p>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
