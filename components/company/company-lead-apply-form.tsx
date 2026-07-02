"use client";

import { useState } from "react";
import { buttonClassName, Card } from "@/components/ui";

type CompanyLeadApplyFormProps = {
  securityLeadId: string;
  alreadyApplied: boolean;
};

export function CompanyLeadApplyForm({
  securityLeadId,
  alreadyApplied,
}: CompanyLeadApplyFormProps) {
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(alreadyApplied);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/company/lead-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityLeadId, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to apply.");
        setIsSubmitting(false);
        return;
      }

      setApplied(true);
    } catch {
      setError("Failed to apply.");
      setIsSubmitting(false);
    }
  }

  if (applied) {
    return (
      <Card className="fo-glass-card border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-sm font-medium text-emerald-100">
          Application submitted. The client will review your profile.
        </p>
      </Card>
    );
  }

  return (
    <Card className="fo-glass-card border border-white/10 p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fo-text">Message (optional)</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="min-h-28 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2.5 text-sm text-fo-text"
            placeholder="Tell the client why your company is a good fit..."
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClassName({ size: "md" })}
        >
          {isSubmitting ? "Submitting..." : "Apply to Lead"}
        </button>
      </form>
    </Card>
  );
}
