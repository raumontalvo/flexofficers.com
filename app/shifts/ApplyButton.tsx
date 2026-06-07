"use client";

import { useState } from "react";

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
    <button
      onClick={applyToShift}
      disabled={isLoading || hasApplied}
      className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {hasApplied ? "Applied" : isLoading ? "Applying..." : "Apply"}
    </button>
  );
}