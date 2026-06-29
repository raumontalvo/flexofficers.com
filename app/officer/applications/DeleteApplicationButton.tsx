"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type DeleteApplicationButtonProps = {
  applicationId: string;
  onDeleted?: (applicationId: string) => void;
  className?: string;
  label?: string;
  icon?: ReactNode;
};

export function DeleteApplicationButton({
  applicationId,
  onDeleted,
  className,
  label = "Delete",
  icon,
}: DeleteApplicationButtonProps) {
  async function deleteApplication() {
    const confirmed = window.confirm(
      "Delete this application from your list?"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/applications/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId }),
    });

    const data = await response.json();

    if (response.ok) {
      onDeleted?.(applicationId);
      return;
    }

    alert(data?.error || "Failed to delete application");
  }

  return (
    <button
      type="button"
      onClick={deleteApplication}
      className={cn(
        "inline-flex items-center justify-center",
        icon ? "gap-1.5" : undefined,
        className
      )}
    >
      {icon}
      {label}
    </button>
  );
}
