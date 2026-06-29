import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MobileActionCardProps = {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  iconClassName?: string;
  className?: string;
};

export function MobileActionCard({
  href,
  title,
  description,
  icon,
  iconClassName,
  className,
}: MobileActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "fo-glass-card fo-glass-card-hover flex items-center gap-3 rounded-xl border border-white/10 p-3 transition",
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            iconClassName ?? "bg-blue-500/20 text-blue-300"
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-fo-text">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-snug text-fo-text-muted">{description}</p>
        ) : null}
      </div>
      <span className="shrink-0 text-xs text-fo-text-subtle" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export function MobileActionCardGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}>
      {children}
    </div>
  );
}
