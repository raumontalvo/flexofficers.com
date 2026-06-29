import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type MobilePrimaryButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
};

const primaryButtonClassName = (variant: MobilePrimaryButtonProps["variant"] = "primary") =>
  buttonClassName({
    variant,
    size: "md",
    fullWidth: true,
    className: "min-h-[52px] text-base",
  });

export function MobilePrimaryButton({
  children,
  href,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = "button",
  variant = "primary",
}: MobilePrimaryButtonProps) {
  const classes = cn(primaryButtonClassName(variant), className);

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export function MobileSecondaryButton({
  children,
  href,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = "button",
  variant = "secondary",
}: MobilePrimaryButtonProps) {
  return (
    <MobilePrimaryButton
      href={href}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
      type={type}
      variant={variant}
    >
      {children}
    </MobilePrimaryButton>
  );
}
