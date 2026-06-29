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
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
        align === "center" && "items-center text-center sm:items-end sm:text-left",
        className
      )}
    >
      <div className={cn("space-y-1.5 sm:space-y-2", align === "center" && "sm:text-left")}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl md:text-4xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="max-w-2xl text-sm leading-relaxed text-fo-text-muted sm:text-base md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="w-full shrink-0 sm:w-auto [&_a]:flex [&_a]:w-full [&_a]:justify-center sm:[&_a]:inline-flex sm:[&_a]:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}
