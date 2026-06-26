import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "elevated" | "muted";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: "none" | "md" | "lg";
};

const variantClasses: Record<CardVariant, string> = {
  default: "border border-fo-border bg-fo-surface/80",
  elevated: "border border-fo-border-strong bg-fo-bg-elevated shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
  muted: "border border-fo-border bg-fo-neutral-bg",
};

const paddingClasses = {
  none: "",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "lg",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-fo-card",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-fo-text", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-fo-text-muted", className)} {...props} />
  );
}
