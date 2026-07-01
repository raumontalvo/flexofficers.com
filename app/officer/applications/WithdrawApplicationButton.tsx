"use client";

import { Button } from "@/components/ui";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function WithdrawApplicationButton({
  applicationId,
  compact = false,
  className,
  label,
  icon,
}: {
  applicationId: string;
  compact?: boolean;
  className?: string;
  label?: string;
  icon?: ReactNode;
}) {
  const { t } = useLandingLanguage();
  const copy = t.forms.withdrawApplication;
  const buttonLabel = label ?? copy.label;

  async function withdrawApplication() {
    const confirmed = window.confirm(copy.confirm);

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/applications/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(copy.success);
      window.location.reload();
      return;
    }

    alert(data?.error || copy.failed);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={withdrawApplication}
        className={cn(
          "inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-yellow-500/30 px-3 py-1.5 text-xs font-semibold text-fo-pending transition hover:bg-fo-pending-bg",
          className
        )}
      >
        {icon}
        {buttonLabel}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      className="w-full border-yellow-500/30 text-fo-pending hover:bg-fo-pending-bg"
      onClick={withdrawApplication}
    >
      {buttonLabel}
    </Button>
  );
}
