"use client";

import Link from "next/link";
import { StatusBadge, buttonClassName } from "@/components/ui";
import {
  formatLeadDateLabel,
  formatLeadTimeRange,
  formatLeadUrgencyLabel,
  type SerializedSecurityLeadCard,
} from "@/lib/security-lead-data";

type SecurityLeadCardProps = {
  lead: SerializedSecurityLeadCard;
  href?: string;
  showApply?: boolean;
  onApply?: () => void;
  applied?: boolean;
};

export function SecurityLeadCard({
  lead,
  href,
  showApply,
  onApply,
  applied,
}: SecurityLeadCardProps) {
  const content = (
    <article className="fo-glass-card flex h-full flex-col rounded-2xl border border-white/10 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-fo-text">{lead.serviceNeeded}</h2>
          <p className="mt-1 text-sm text-fo-text-muted">
            {lead.city}, {lead.state}
          </p>
        </div>
        <StatusBadge variant={lead.urgency === "URGENT" ? "pending" : "info"}>
          {formatLeadUrgencyLabel(lead.urgency)}
        </StatusBadge>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-fo-text-muted">Date</dt>
          <dd className="font-medium text-fo-text">{formatLeadDateLabel(lead.dateNeeded)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-fo-text-muted">Time</dt>
          <dd className="font-medium text-fo-text">
            {formatLeadTimeRange(lead.startTime, lead.endTime)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-fo-text-muted">Budget</dt>
          <dd className="font-medium text-fo-text">{lead.budgetOffer}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-fo-text-muted">Officers</dt>
          <dd className="font-medium text-fo-text">{lead.officersNeeded}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {href ? (
          <Link
            href={href}
            className={buttonClassName({ variant: "secondary", size: "md", className: "min-w-0 flex-1" })}
          >
            View Details
          </Link>
        ) : null}
        {showApply ? (
          <button
            type="button"
            onClick={onApply}
            disabled={applied}
            className={buttonClassName({
              size: "md",
              className: "min-w-0 flex-1",
              variant: applied ? "secondary" : "primary",
            })}
          >
            {applied ? "Applied" : "Apply"}
          </button>
        ) : null}
      </div>
    </article>
  );

  return content;
}
