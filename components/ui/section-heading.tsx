import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  action,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:items-end sm:text-left",
        className
      )}
    >
      <div className={cn("space-y-2", align === "center" && "sm:text-left")}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="max-w-2xl text-base text-fo-text-muted sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
