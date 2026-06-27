"use client";

import { cn } from "@/lib/cn";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StepRequiredBadgeProps = {
  required: boolean;
};

export function StepRequiredBadge({ required }: StepRequiredBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        required
          ? "border border-sky-500/30 bg-sky-500/10 text-sky-300"
          : "border border-slate-600/50 bg-slate-800/60 text-slate-400"
      )}
    >
      {required ? "Required" : "Optional"}
    </span>
  );
}

export { CheckIcon };
