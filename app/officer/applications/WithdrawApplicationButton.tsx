"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function WithdrawApplicationButton({
  applicationId,
  compact = false,
  className,
  label = "Withdraw Application",
  icon,
}: {
  applicationId: string;
  compact?: boolean;
  className?: string;
  label?: string;
  icon?: ReactNode;
}) {
  async function withdrawApplication() {
    const confirmed = window.confirm(
      "Withdraw this application? You will no longer be considered for this shift."
    );

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
      alert("Application withdrawn.");
      window.location.reload();
      return;
    }

    alert(data?.error || "Failed to withdraw application");
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
        {label}
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
      {label}
    </Button>
  );
}
