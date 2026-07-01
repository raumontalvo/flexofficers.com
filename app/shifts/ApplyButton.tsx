"use client";

import { useState } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

type ApplyButtonProps = {
  shiftId: string;
  initialHasApplied?: boolean;
  className?: string;
};

export default function ApplyButton({
  shiftId,
  initialHasApplied = false,
  className,
}: ApplyButtonProps) {
  const { t } = useLandingLanguage();
  const actions = t.shiftDetail.actions;
  const toast = t.shiftDetail.toast;
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isLoading, setIsLoading] = useState(false);

  async function applyToShift() {
    setIsLoading(true);

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId }),
    });

    const data = await response.json();

    setIsLoading(false);

    if (response.ok) {
      setHasApplied(true);
      alert(toast.applySuccess);
    } else {
      alert(data.error || toast.applyFailed);
    }
  }

  return (
    <Button
      onClick={applyToShift}
      disabled={isLoading || hasApplied}
      fullWidth
      className={cn("w-full", className)}
    >
      {hasApplied
        ? actions.applied
        : isLoading
          ? actions.applying
          : actions.apply}
    </Button>
  );
}
