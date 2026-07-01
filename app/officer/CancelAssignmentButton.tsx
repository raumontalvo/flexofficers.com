"use client";

import { useRouter } from "next/navigation";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

type CancelAssignmentButtonProps = {
  applicationId: string;
  className?: string;
  label?: string;
};

export function CancelAssignmentButton({
  applicationId,
  className,
  label,
}: CancelAssignmentButtonProps) {
  const router = useRouter();
  const { t } = useLandingLanguage();
  const copy = t.forms.cancelAssignment;
  const buttonLabel = label ?? copy.title;

  async function cancelAssignment() {
    const confirmed = window.confirm(copy.confirm);

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

    alert(data?.error || copy.failed);
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
      {buttonLabel}
    </button>
  );
}
