"use client";

import { useState } from "react";
import { Button, buttonClassName } from "@/components/ui";
import { MobileSettingsRow } from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import { parseApiJsonResponse } from "@/lib/parse-api-response";

type StripeBillingActionType = "portal" | "checkout" | "payment-method";

const STRIPE_BILLING_ENDPOINTS: Record<StripeBillingActionType, string> = {
  portal: "/api/stripe/portal",
  checkout: "/api/stripe/checkout",
  "payment-method": "/api/stripe/payment-method",
};

type StripeBillingResponse = {
  url?: string;
  error?: string;
};

async function requestStripeBillingUrl(endpoint: string) {
  const response = await fetch(endpoint, {
    method: "POST",
  });

  const data = await parseApiJsonResponse<StripeBillingResponse>(response);

  if (!response.ok) {
    throw new Error(data?.error ?? "Unable to open billing.");
  }

  if (!data?.url) {
    throw new Error(data?.error ?? "Unable to open billing.");
  }

  return data.url;
}

type StripeBillingActionProps = {
  action: StripeBillingActionType;
  label: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
};

export function StripeBillingAction({
  action,
  label,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className,
}: StripeBillingActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);

    try {
      const url = await requestStripeBillingUrl(STRIPE_BILLING_ENDPOINTS[action]);
      window.location.href = url;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to open billing."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className={cn(fullWidth && "w-full", className)}>
      <Button
        type="button"
        variant={variant}
        fullWidth={fullWidth}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={fullWidth ? "w-full" : undefined}
      >
        {isLoading ? "Opening..." : label}
      </Button>
      {error ? <p className="mt-2 text-sm text-fo-rejected">{error}</p> : null}
    </div>
  );
}

type StripeBillingSettingRowProps = {
  action: StripeBillingActionType;
  label: string;
  disabled?: boolean;
  className?: string;
};

export function StripeBillingSettingRow({
  action,
  label,
  disabled = false,
  className,
}: StripeBillingSettingRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);

    try {
      const url = await requestStripeBillingUrl(STRIPE_BILLING_ENDPOINTS[action]);
      window.location.href = url;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to open billing."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className={className}>
      <MobileSettingsRow
        label={label}
        onClick={handleClick}
        disabled={disabled}
        loading={isLoading}
      />
      {error ? <p className="mt-1.5 text-xs text-fo-rejected">{error}</p> : null}
    </div>
  );
}

export function StripeBillingLink({
  label,
  disabled = false,
  className,
}: {
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);

    try {
      const url = await requestStripeBillingUrl(
        STRIPE_BILLING_ENDPOINTS["payment-method"]
      );
      window.location.href = url;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to open billing."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={buttonClassName({
          variant: "secondary",
          size: "md",
          className:
            "min-h-9 border-fo-primary-bright/40 bg-transparent px-3 py-1.5 text-xs text-fo-primary-bright hover:border-fo-primary-bright hover:bg-fo-primary/10",
        })}
      >
        {isLoading ? "Opening..." : label}
      </button>
      {error ? <p className="mt-2 text-sm text-fo-rejected">{error}</p> : null}
    </div>
  );
}
