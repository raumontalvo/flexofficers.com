"use client";

import { Card } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type CompanyApplicationsDonutProps = {
  pendingCount: number;
  invitedCount: number;
  acceptedCount: number;
};

function DonutChart({
  segments,
  size = "default",
  noDataLabel,
  totalLabel,
}: {
  segments: DonutSegment[];
  size?: "default" | "compact";
  noDataLabel: string;
  totalLabel: string;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const isCompact = size === "compact";
  const chartSize = isCompact ? "h-24 w-24" : "h-36 w-36";
  const inset = isCompact ? "inset-3.5" : "inset-5";
  const totalText = isCompact ? "text-xl" : "text-2xl";

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.02]",
          chartSize
        )}
      >
        <span className="text-xs text-fo-text-muted">{noDataLabel}</span>
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
      className={cn("relative rounded-full", chartSize)}
      style={{
        background: `conic-gradient(${gradientStops})`,
      }}
    >
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full bg-[#07101c]",
          inset
        )}
      >
        <div className="text-center">
          <p className={cn("font-bold text-fo-text", totalText)}>{total}</p>
          <p className="text-[10px] uppercase tracking-wide text-fo-text-muted">
            {totalLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function DonutLegend({
  segments,
  compact = false,
}: {
  segments: DonutSegment[];
  compact?: boolean;
}) {
  return (
    <ul className={cn("space-y-2 text-sm", compact && "space-y-1.5 text-xs")}>
      {segments.map((segment) => (
        <li key={segment.label} className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full",
              compact ? "h-2 w-2" : "h-2.5 w-2.5"
            )}
            style={{ backgroundColor: segment.color }}
          />
          <span className="text-fo-text-muted">{segment.label}</span>
          <span className="font-semibold text-fo-text">{segment.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function CompanyApplicationsDonut(props: CompanyApplicationsDonutProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.company;
  const segments: DonutSegment[] = [
    { label: copy.donutPending, value: props.pendingCount, color: "#3b82f6" },
    { label: copy.donutInvited, value: props.invitedCount, color: "#f59e0b" },
    { label: copy.donutAccepted, value: props.acceptedCount, color: "#10b981" },
  ];
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <>
      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card border border-white/10 p-3.5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] lg:hidden"
      >
        <h2 className="text-base font-bold text-fo-text">{copy.applicantsOverview}</h2>

        {total === 0 ? (
          <div className="mt-3 flex items-center gap-4">
            <DonutChart
              segments={segments}
              size="compact"
              noDataLabel={t.common.noData}
              totalLabel={t.common.total}
            />
            <p className="text-xs leading-relaxed text-fo-text-muted">
              {copy.applicantsEmpty}
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-4">
            <DonutChart
              segments={segments}
              size="compact"
              noDataLabel={t.common.noData}
              totalLabel={t.common.total}
            />
            <DonutLegend segments={segments} compact />
          </div>
        )}
      </Card>

      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card hidden h-full border border-white/10 p-4 lg:block"
      >
        <h2 className="text-base font-bold text-fo-text">{copy.applicantsOverview}</h2>

        {total === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center py-6 text-center">
            <DonutChart
              segments={segments}
              noDataLabel={t.common.noData}
              totalLabel={t.common.total}
            />
            <p className="mt-4 text-sm text-fo-text-muted">{copy.applicantsEmpty}</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <DonutChart
              segments={segments}
              noDataLabel={t.common.noData}
              totalLabel={t.common.total}
            />
            <DonutLegend segments={segments} />
          </div>
        )}
      </Card>
    </>
  );
}
