import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card variant="elevated" padding="md" className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-fo-text-muted">{label}</p>
        {icon ? (
          <div className="text-fo-primary-hover">{icon}</div>
        ) : null}
      </div>

      <p className="text-3xl font-bold tracking-tight text-fo-text">{value}</p>

      {hint ? <p className="text-sm text-fo-text-subtle">{hint}</p> : null}
    </Card>
  );
}
