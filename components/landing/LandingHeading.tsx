import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LandingHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

export function LandingHeading({
  title,
  subtitle,
  align = "left",
  className,
  titleClassName,
}: LandingHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      <h2
        className={cn(
          "text-4xl font-bold tracking-tight text-fo-text sm:text-5xl lg:text-6xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fo-text-muted sm:text-xl sm:leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function LandingEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fo-primary-hover">
      {children}
    </p>
  );
}
