"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { ClientApplicantsOverview } from "@/lib/client-dashboard-data";
import { cn } from "@/lib/cn";

type ClientApplicantsOverviewProps = {
  overview: ClientApplicantsOverview;
};

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

function DonutChart({
  segments,
  total,
  totalLabel,
  noDataLabel,
}: {
  segments: DonutSegment[];
  total: number;
  totalLabel: string;
  noDataLabel: string;
}) {
  if (total === 0) {
    return (
      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.02]">
        <span className="px-2 text-center text-xs text-fo-text-muted">{noDataLabel}</span>
      </div>
    );
  }

  let cumulative = 0;
  const gradientStops = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const start = (cumulative / total) * 100;
      cumulative += segment.value;
      const end = (cumulative / total) * 100;
      return `${segment.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div
      className="relative h-32 w-32 rounded-full"
      style={{
        background: `conic-gradient(${gradientStops})`,
      }}
    >
      <div className="absolute inset-5 flex items-center justify-center rounded-full bg-[#07101c]">
        <div className="text-center">
          <p className="text-2xl font-bold text-fo-text">{total}</p>
          <p className="text-[10px] uppercase tracking-wide text-fo-text-muted">
            {totalLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function DonutLegend({ segments }: { segments: DonutSegment[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {segments.map((segment) => (
        <li key={segment.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: segment.color }}
          />
          <span className="text-fo-text-muted">{segment.label}</span>
          <span className="font-semibold text-fo-text">{segment.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function ClientApplicantsOverviewCard({
  overview,
}: ClientApplicantsOverviewProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.client;

  const segments: DonutSegment[] = [
    { label: copy.donutHired, value: overview.hired, color: "#10b981" },
    {
      label: copy.donutPendingReview,
      value: overview.pendingReview,
      color: "#3b82f6",
    },
    { label: copy.donutDeclined, value: overview.declined, color: "#f59e0b" },
    { label: copy.donutWithdrawn, value: overview.withdrawn, color: "#a855f7" },
  ];

  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card border border-white/10 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-fo-text">{copy.applicantsOverview}</h2>
        <Link
          href="/client/applicants"
          className="text-xs font-semibold text-fo-primary-hover hover:underline"
        >
          {copy.viewAll}
        </Link>
      </div>

      <div
        className={cn(
          "mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center",
          overview.total === 0 && "sm:flex-col"
        )}
      >
        <DonutChart
          segments={segments}
          total={overview.total}
          totalLabel={copy.totalApplicants}
          noDataLabel={t.common.noData}
        />

        {overview.total === 0 ? (
          <p className="text-center text-sm leading-relaxed text-fo-text-muted sm:text-left">
            {copy.applicantsEmpty}
          </p>
        ) : (
          <DonutLegend segments={segments} />
        )}
      </div>
    </Card>
  );
}
