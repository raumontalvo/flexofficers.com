"use client";

import { useEffect } from "react";
import {
  formatAdminDate,
  formatLocation,
  type SerializedAdminClient,
} from "@/lib/admin-clients";
import { Button, StatusBadge } from "@/components/ui";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { cn } from "@/lib/cn";

type ClientDetailPanelProps = {
  client: SerializedAdminClient | null;
  onClose: () => void;
};

function statusBadgeVariant(status: SerializedAdminClient["accountStatus"]) {
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

export function ClientDetailPanel({ client, onClose }: ClientDetailPanelProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (client) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [client, onClose]);

  if (!client) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close client details"
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside
        className={cn(
          "relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#040a14] shadow-2xl",
          "animate-in slide-in-from-right duration-200"
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <ProfileAvatar
              name={client.displayName}
              src={client.profilePhotoUrl}
              size="md"
            />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-fo-text">
                {client.displayName}
              </h2>
              <p className="truncate text-sm text-fo-text-muted">{client.email}</p>
            </div>
          </div>
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <StatusBadge variant={statusBadgeVariant(client.accountStatus)}>
              {client.accountStatus}
            </StatusBadge>
          </div>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-fo-text">Contact</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Contact Name" value={client.contactName} />
              <DetailField label="Business Name" value={client.companyName} />
              <DetailField label="Email" value={client.email} />
              <DetailField label="Phone" value={client.phone} />
              <DetailField
                label="Location"
                value={formatLocation(client.city, client.state)}
              />
              <DetailField label="Industry" value={client.industry} />
              <DetailField label="Website" value={client.website} />
            </dl>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-fo-text">Activity</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Security Requests" value={String(client.leadCount)} />
              <DetailField label="Paid Requests" value={String(client.paidLeadCount)} />
              <DetailField label="Open Requests" value={String(client.openLeadCount)} />
              <DetailField
                label="Company Applications"
                value={String(client.applicationCount)}
              />
              <DetailField label="Last Request" value={formatAdminDate(client.lastLeadAt)} />
              <DetailField label="Joined" value={formatAdminDate(client.joinedAt)} />
            </dl>
          </section>
        </div>
      </aside>
    </div>
  );
}
