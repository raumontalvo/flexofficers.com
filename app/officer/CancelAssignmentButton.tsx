"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type CancelAssignmentButtonProps = {
  applicationId: string;
  className?: string;
  label?: string;
};

export function CancelAssignmentButton({
  applicationId,
  className,
  label = "Cancel Assignment",
}: CancelAssignmentButtonProps) {
  const router = useRouter();

  async function cancelAssignment() {
    const confirmed = window.confirm(
      "Cancel this assignment? The company will be notified and the shift opening may become available again."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/applications/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId }),
    });

    const data = await response.json();

    if (response.ok) {
      router.refresh();
      return;
    }

    alert(data?.error || "Failed to cancel assignment");
  }

  return (
    <button
      type="button"
      onClick={cancelAssignment}
      className={cn(
        "inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-red-500/35 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10",
        className
      )}
    >
      {label}
    </button>
  );
}
