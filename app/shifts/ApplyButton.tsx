"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function ApplyButton({ shiftId }: { shiftId: string }) {
  const [hasApplied, setHasApplied] = useState(false);
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
      alert("Application submitted!");
    } else {
      alert(data.error || "Failed to apply to shift");
    }
  }

  return (
    <Button
      onClick={applyToShift}
      disabled={isLoading || hasApplied}
      fullWidth
      className="w-full"
    >
      {hasApplied
        ? "Applied"
        : isLoading
          ? "Applying..."
          : "Apply to Shift"}
    </Button>
  );
}
