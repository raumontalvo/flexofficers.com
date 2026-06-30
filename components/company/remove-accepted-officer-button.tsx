"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type RemoveAcceptedOfficerButtonProps = {
  applicationId: string;
  officerName: string;
  shiftTitle: string;
  onRemoved: () => void;
  label?: string;
  className?: string;
};

export function RemoveAcceptedOfficerButton({
  applicationId,
  officerName,
  shiftTitle,
  onRemoved,
  label = "Remove",
  className,
}: RemoveAcceptedOfficerButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    const confirmed = window.confirm(
      `Remove ${officerName} from ${shiftTitle}? They will be notified by email.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/applications/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        alert(data?.error || "Failed to remove officer from shift.");
        return;
      }

      onRemoved();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleRemove()}
      disabled={loading}
      className={cn(
        "inline-flex min-h-8 items-center justify-center rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-500/45 hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {loading ? "Removing..." : label}
    </button>
  );
}
