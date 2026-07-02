"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge, buttonClassName, ProfileAvatar } from "@/components/ui";
import {
  formatLeadApplicationStatusLabel,
  type SerializedLeadApplicant,
} from "@/lib/security-lead-data";

type ClientLeadApplicantCardProps = {
  leadId: string;
  applicant: SerializedLeadApplicant;
};

export function ClientLeadApplicantCard({
  leadId,
  applicant,
}: ClientLeadApplicantCardProps) {
  const [status, setStatus] = useState(applicant.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(nextStatus: "ACCEPTED" | "REJECTED") {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/client/lead-applications/${applicant.id}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to update status.");
        setIsUpdating(false);
        return;
      }

      setStatus(nextStatus);
      window.location.reload();
    } catch {
      setError("Failed to update status.");
      setIsUpdating(false);
    }
  }

  const statusVariant =
    status === "ACCEPTED" ? "success" : status === "REJECTED" ? "rejected" : "pending";

  return (
    <article className="fo-glass-card rounded-2xl border border-white/10 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <ProfileAvatar
          name={applicant.company.companyName}
          src={applicant.company.logoUrl}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-fo-text">
              {applicant.company.companyName}
            </h3>
            <StatusBadge variant={statusVariant}>
              {formatLeadApplicationStatusLabel(status)}
            </StatusBadge>
            {applicant.company.verified ? (
              <StatusBadge variant="success">Verified</StatusBadge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-fo-text-muted">
            {[applicant.company.city, applicant.company.state].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {applicant.company.licenseNumber ? (
          <div>
            <dt className="text-fo-text-muted">License</dt>
            <dd className="font-medium text-fo-text">
              {applicant.company.licenseNumber}
              {applicant.company.licenseState
                ? ` (${applicant.company.licenseState})`
                : ""}
            </dd>
          </div>
        ) : null}
        {status === "ACCEPTED" && applicant.company.phone ? (
          <div>
            <dt className="text-fo-text-muted">Phone</dt>
            <dd className="font-medium text-fo-text">{applicant.company.phone}</dd>
          </div>
        ) : null}
        {status === "ACCEPTED" && applicant.company.email ? (
          <div>
            <dt className="text-fo-text-muted">Email</dt>
            <dd className="font-medium text-fo-text">{applicant.company.email}</dd>
          </div>
        ) : null}
      </dl>

      {applicant.message ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-fo-text-muted">
          {applicant.message}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/client/leads/${leadId}/companies/${applicant.company.id}`}
          className={buttonClassName({ variant: "secondary", size: "md" })}
        >
          View Profile
        </Link>
        {status === "PENDING" ? (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => updateStatus("ACCEPTED")}
              className={buttonClassName({ size: "md" })}
            >
              Accept
            </button>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => updateStatus("REJECTED")}
              className={buttonClassName({ variant: "secondary", size: "md" })}
            >
              Reject
            </button>
          </>
        ) : null}
        {status === "ACCEPTED" && applicant.company.phone ? (
          <a
            href={`tel:${applicant.company.phone}`}
            className={buttonClassName({ size: "md" })}
          >
            Contact
          </a>
        ) : null}
      </div>
    </article>
  );
}
