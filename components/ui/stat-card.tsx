import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";

export type StatCardTone = "purple" | "green" | "blue" | "amber";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: StatCardTone;
  className?: string;
  showChevron?: boolean;
};

const toneClasses: Record<StatCardTone, string> = {
  purple: "bg-violet-500/20 text-violet-300 shadow-[0_0_20px_-6px_rgba(139,92,246,0.35)]",
  green: "bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_-6px_rgba(16,185,129,0.35)]",
  blue: "bg-blue-500/20 text-blue-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)]",
  amber: "bg-amber-500/20 text-amber-300 shadow-[0_0_20px_-6px_rgba(245,158,11,0.35)]",
};

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "blue",
  className,
  showChevron = false,
}: StatCardProps) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className={cn(
        "fo-glass-card fo-glass-card-hover flex h-full p-4 md:p-3.5",
        showChevron
          ? "items-center gap-3.5 md:items-start md:gap-3"
          : "items-start gap-3",
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg",
            showChevron ? "h-11 w-11 md:h-9 md:w-9" : "h-9 w-9",
            toneClasses[tone]
          )}
        >
          {icon}
        </div>
      ) : null}

      <div
        className={cn(
          "min-w-0 flex-1",
          showChevron ? "space-y-1.5 md:space-y-0.5" : "space-y-0.5"
        )}
      >
        <p className="text-xs font-medium text-fo-text-muted">{label}</p>
        <p
          className={cn(
            "font-bold leading-none tracking-tight text-fo-text",
            showChevron
              ? "text-[1.375rem] md:text-xl lg:text-2xl"
              : "text-xl sm:text-2xl"
          )}
        >
          {value}
        </p>
        {hint ? (
          <p className="text-xs leading-snug text-fo-text-subtle">{hint}</p>
        ) : null}
      </div>

      {showChevron ? (
        <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-fo-text-subtle/45 md:hidden" />
      ) : null}
    </Card>
  );
}
