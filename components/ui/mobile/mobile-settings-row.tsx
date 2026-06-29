"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const rowClassName =
  "flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50";

type MobileSettingsRowProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  description?: string;
  icon?: ReactNode;
  className?: string;
  chevron?: "right" | "down";
};

export function MobileSettingsRow({
  label,
  href,
  onClick,
  disabled = false,
  loading = false,
  description,
  icon,
  className,
  chevron = "right",
}: MobileSettingsRowProps) {
  const chevronSymbol = chevron === "down" ? "▼" : "→";

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {icon ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            {icon}
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="block text-sm font-medium text-fo-text">
            {loading ? "Opening..." : label}
          </span>
          {description ? (
            <span className="mt-0.5 block text-xs text-fo-text-muted">{description}</span>
          ) : null}
        </span>
      </span>
      <span className="shrink-0 text-sm text-fo-text-subtle" aria-hidden="true">
        {chevronSymbol}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={cn(rowClassName, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(rowClassName, className)}
    >
      {content}
    </button>
  );
}

export function MobileSettingsRowGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}
