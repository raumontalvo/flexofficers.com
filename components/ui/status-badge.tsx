import { cn } from "@/lib/cn";

export type StatusBadgeVariant =
  | "success"
  | "pending"
  | "rejected"
  | "neutral"
  | "info";

type StatusBadgeProps = {
  children: React.ReactNode;
  variant?: StatusBadgeVariant;
  className?: string;
};

const variantClasses: Record<StatusBadgeVariant, string> = {
  success: "border-green-500/20 bg-fo-success-bg text-fo-success",
  pending: "border-yellow-500/20 bg-fo-pending-bg text-fo-pending",
  rejected: "border-red-500/20 bg-fo-rejected-bg text-fo-rejected",
  neutral: "border-fo-border-strong bg-fo-neutral-bg text-fo-text-muted",
  info: "border-blue-500/20 bg-blue-500/10 text-fo-primary-hover",
};

export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

const applicationStatusMap = {
  ACCEPTED: "success",
  PENDING: "pending",
  REJECTED: "rejected",
  WITHDRAWN: "neutral",
} as const satisfies Record<string, StatusBadgeVariant>;

export function applicationStatusVariant(
  status: string
): StatusBadgeVariant {
  return applicationStatusMap[status as keyof typeof applicationStatusMap] ?? "neutral";
}

export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <StatusBadge variant={applicationStatusVariant(status)} className={className}>
      {status.replaceAll("_", " ")}
    </StatusBadge>
  );
}

const shiftStatusMap = {
  OPEN: "success",
  INVITED: "pending",
  PARTIALLY_FILLED: "info",
  FILLED: "neutral",
  CANCELLED: "rejected",
  COMPLETED: "neutral",
} as const satisfies Record<string, StatusBadgeVariant>;

export function shiftStatusVariant(status: string): StatusBadgeVariant {
  return shiftStatusMap[status as keyof typeof shiftStatusMap] ?? "neutral";
}

export function ShiftStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <StatusBadge variant={shiftStatusVariant(status)} className={className}>
      {status.replaceAll("_", " ")}
    </StatusBadge>
  );
}
