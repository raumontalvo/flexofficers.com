import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-fo-primary-bright text-white hover:bg-fo-primary-hover active:scale-[0.98]",
  secondary:
    "border border-fo-border-strong bg-fo-surface text-fo-text hover:bg-fo-surface-hover active:scale-[0.98]",
  ghost:
    "bg-transparent text-fo-text-muted hover:bg-fo-surface hover:text-fo-text",
  danger:
    "bg-fo-rejected text-white hover:bg-red-500 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm font-semibold",
  lg: "min-h-12 px-6 py-3 text-base font-semibold",
};

export function buttonClassName({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-fo-button transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fo-primary-bright/60",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}
