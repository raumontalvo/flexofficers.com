"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import type { ClientApplicantsOverview } from "@/lib/client-dashboard-data";
import { buildDonutGradientStops } from "@/lib/donut-gradient-stops";

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

  const gradientStops = buildDonutGradientStops(segments, total);

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
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-base font-bold text-fo-text">
          {copy.applicantsOverview}
        </h2>
        <Link
          href="/client/applicants"
          className="shrink-0 text-xs font-semibold text-fo-primary-hover hover:underline"
        >
          {copy.viewAll}
        </Link>
      </div>

      <div className="mt-4 flex w-full min-w-0 flex-col items-center gap-4">
        <DonutChart
          segments={segments}
          total={overview.total}
          totalLabel={copy.totalApplicants}
          noDataLabel={t.common.noData}
        />

        {overview.total === 0 ? (
          <p className="w-full max-w-sm break-words text-center text-sm leading-relaxed text-fo-text-muted">
            {copy.applicantsEmpty}
          </p>
        ) : (
          <div className="w-full min-w-0">
            <DonutLegend segments={segments} />
          </div>
        )}
      </div>
    </Card>
  );
}
