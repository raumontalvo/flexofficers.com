"use client";

import { useState } from "react";
import { SecurityLeadCard } from "@/components/security-leads/security-lead-card";
import type { SerializedSecurityLeadCard } from "@/lib/security-lead-data";

type CompanyLeadsBrowseProps = {
  leads: SerializedSecurityLeadCard[];
  appliedLeadIds: string[];
};

export function CompanyLeadsBrowse({ leads, appliedLeadIds }: CompanyLeadsBrowseProps) {
  const [appliedIds, setAppliedIds] = useState(new Set(appliedLeadIds));
  const [error, setError] = useState<string | null>(null);

  async function handleApply(leadId: string) {
    setError(null);

    const response = await fetch("/api/company/lead-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ securityLeadId: leadId }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Failed to apply.");
      return;
    }

    setAppliedIds((current) => new Set([...current, leadId]));
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {leads.length === 0 ? (
        <div className="fo-glass-card rounded-2xl border border-white/10 p-6 text-sm text-fo-text-muted">
          No public security leads available right now.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {leads.map((lead) => (
            <SecurityLeadCard
              key={lead.id}
              lead={lead}
              href={`/company/leads/${lead.id}`}
              showApply
              applied={appliedIds.has(lead.id)}
              onApply={() => {
                void handleApply(lead.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
