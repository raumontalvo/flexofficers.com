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
};

const toneClasses: Record<StatCardTone, string> = {
  purple: "bg-violet-500/20 text-violet-300 shadow-[0_0_20px_-6px_rgba(139,92,246,0.35)]",
  green: "bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_-6px_rgba(16,185,129,0.35)]",
  blue: "bg-blue-500/20 text-blue-300 shadow-[0_0_20px_-6px_rgba(59,130,246,0.35)]",
  amber: "bg-amber-500/20 text-amber-300 shadow-[0_0_20px_-6px_rgba(245,158,11,0.35)]",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "blue",
  className,
}: StatCardProps) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className={cn(
        "fo-glass-card fo-glass-card-hover flex h-full items-start gap-3 p-3.5",
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            toneClasses[tone]
          )}
        >
          {icon}
        </div>
      ) : null}

      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium text-fo-text-muted">{label}</p>
        <p className="text-2xl font-bold leading-none tracking-tight text-fo-text">
          {value}
        </p>
        {hint ? (
          <p className="text-[11px] leading-snug text-fo-text-subtle">{hint}</p>
        ) : null}
      </div>
    </Card>
  );
}
