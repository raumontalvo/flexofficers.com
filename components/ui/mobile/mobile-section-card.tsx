import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MobileSectionCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  contentClassName?: string;
};

export function MobileSectionCard({
  title,
  children,
  className,
  id,
  contentClassName,
}: MobileSectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "fo-glass-card h-auto self-start rounded-xl border border-white/10 p-3",
        className
      )}
    >
      {title ? (
        <h2 className="text-sm font-semibold text-fo-text">{title}</h2>
      ) : null}
      <div className={cn(title ? "mt-2.5" : undefined, contentClassName)}>
        {children}
      </div>
    </section>
  );
}

type MobileDetailRowProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function MobileDetailRow({ label, value, className }: MobileDetailRowProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-white/[0.06] py-2 last:border-b-0 last:pb-0",
        className
      )}
    >
      <dt className="text-sm text-fo-text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-fo-text">{value}</dd>
    </div>
  );
}

export function MobileStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}
