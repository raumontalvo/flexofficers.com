"use client";

import type { ComponentType, SVGProps } from "react";
import { AcceptedIcon, BrowseIcon } from "@/components/nav/icons";
import { cn } from "@/lib/cn";
import {
  APPLICATION_STATUS_TABS,
  type ApplicationStatusFilter,
} from "@/lib/officer-application-data";

const TOP_ROW: ApplicationStatusFilter[] = ["", "PENDING", "ACCEPTED"];
const BOTTOM_ROW: ApplicationStatusFilter[] = ["REJECTED", "WITHDRAWN"];

type StatusTileStyle = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  accentClass: string;
};

const STATUS_TILE_STYLES: Record<ApplicationStatusFilter, StatusTileStyle> = {
  "": {
    Icon: BrowseIcon,
    accentClass: "text-fo-primary-bright",
  },
  PENDING: {
    Icon: PendingStatusIcon,
    accentClass: "text-fo-pending",
  },
  ACCEPTED: {
    Icon: AcceptedIcon,
    accentClass: "text-fo-success",
  },
  REJECTED: {
    Icon: RejectedStatusIcon,
    accentClass: "text-fo-rejected",
  },
  WITHDRAWN: {
    Icon: WithdrawnStatusIcon,
    accentClass: "text-fo-text-subtle",
  },
};

type ApplicationStatusSummaryCardProps = {
  activeFilter: ApplicationStatusFilter;
  counts: Record<ApplicationStatusFilter, number>;
  onSelect: (filter: ApplicationStatusFilter) => void;
};

function PendingStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4.5l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RejectedStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m9 9 6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WithdrawnStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M8 7H5v3M5 10c1.8 2.8 4.8 4.5 8 4.5 4.2 0 7.7-2.7 9-6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getTabLabel(value: ApplicationStatusFilter) {
  return APPLICATION_STATUS_TABS.find((tab) => tab.value === value)?.label ?? "";
}

function StatusCell({
  value,
  count,
  isActive,
  onSelect,
}: {
  value: ApplicationStatusFilter;
  count: number;
  isActive: boolean;
  onSelect: (filter: ApplicationStatusFilter) => void;
}) {
  const label = getTabLabel(value);
  const { Icon, accentClass } = STATUS_TILE_STYLES[value];

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex min-w-0 flex-col items-center gap-1 border-b-2 px-2 py-2.5 transition",
        isActive
          ? "border-fo-primary-bright bg-white/[0.06] text-fo-text"
          : "border-transparent hover:bg-white/[0.02]"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-fo-primary-bright" : accentClass
        )}
      />
      <span className="truncate text-[10px] font-medium leading-tight text-fo-text-muted">
        {label} ({count})
      </span>
      <span
        className={cn(
          "text-xl font-bold leading-none tabular-nums",
          isActive ? "text-fo-primary-bright" : accentClass
        )}
      >
        {count}
      </span>
    </button>
  );
}

export function ApplicationStatusSummaryCard({
  activeFilter,
  counts,
  onSelect,
}: ApplicationStatusSummaryCardProps) {
  return (
    <div className="fo-glass-card overflow-hidden rounded-2xl border border-white/10 md:hidden">
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
        {TOP_ROW.map((value) => (
          <StatusCell
            key={value || "all"}
            value={value}
            count={counts[value]}
            isActive={activeFilter === value}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
        {BOTTOM_ROW.map((value) => (
          <StatusCell
            key={value}
            value={value}
            count={counts[value]}
            isActive={activeFilter === value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
