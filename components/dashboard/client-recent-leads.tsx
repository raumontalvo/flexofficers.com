"use client";

import Link from "next/link";
import { buttonClassName, Card, StatusBadge } from "@/components/ui";
import type { StatusBadgeVariant } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
import {
  getClientLeadDisplayStatusLabel,
  type SerializedClientDashboardLead,
} from "@/lib/client-dashboard-data";
import { cn } from "@/lib/cn";

type ClientRecentLeadsProps = {
  leads: SerializedClientDashboardLead[];
};

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 17s5-4.5 5-8.5a5 5 0 1 0-10 0C5 12.5 10 17 10 17Z" />
      <circle cx="10" cy="8.5" r="1.75" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 6.5V10l2.5 1.5" strokeLinecap="round" />
    </svg>
  );
}

function leadStatusVariant(
  status: SerializedClientDashboardLead["displayStatus"]
): StatusBadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "pending";
    case "COMPLETED":
      return "info";
    case "CANCELLED":
    default:
      return "neutral";
  }
}

export function ClientRecentLeads({ leads }: ClientRecentLeadsProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.client;

  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card h-full border border-white/10 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-fo-text sm:text-lg">{copy.recentLeads}</h2>
        <Link
          href="/client/leads"
          className="text-xs font-semibold text-fo-primary-hover hover:underline"
        >
          {copy.viewAll}
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
          <p className="text-sm font-semibold text-fo-text">{copy.recentLeadsEmptyTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fo-text-muted">
            {copy.recentLeadsEmptyDesc}
          </p>
          <Link
            href="/client/leads/new"
            className={buttonClassName({ size: "md", className: "mt-5" })}
          >
            {copy.createLead}
          </Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-white/[0.06]">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={lead.href}
              className="group flex items-center gap-3 py-3.5 transition first:pt-0 last:pb-0 hover:bg-white/[0.02]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-fo-text sm:text-base">
                    {lead.title}
                  </p>
                  <StatusBadge variant={leadStatusVariant(lead.displayStatus)}>
                    {getClientLeadDisplayStatusLabel(lead.displayStatus)}
                  </StatusBadge>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fo-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <LocationIcon className="h-3.5 w-3.5 shrink-0 text-red-400/90" />
                    {lead.locationLabel}
                  </span>
                  <span>{lead.dateLabel}</span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {lead.timeLabel}
                  </span>
                </div>

                <p className="mt-1.5 text-xs font-medium text-fo-text-muted">
                  {lead.applicantCount === 1
                    ? copy.applicantCountOne
                    : interpolate(copy.applicantsCount, {
                        count: lead.applicantCount,
                      })}
                </p>
              </div>

              <span
                className={cn(
                  "shrink-0 text-sm text-fo-text-subtle transition",
                  "group-hover:translate-x-0.5 group-hover:text-fo-primary-hover"
                )}
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
