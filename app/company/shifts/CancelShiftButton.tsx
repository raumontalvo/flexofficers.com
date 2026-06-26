"use client";

import { Button } from "@/components/ui";

export default function CancelShiftButton({ shiftId }: { shiftId: string }) {
  async function cancelShift() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this shift? It will be removed from Available Shifts but kept in your company history."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/shifts/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId }),
    });

    if (response.ok) {
      alert("Shift cancelled!");
      window.location.reload();
    } else {
      alert("Failed to cancel shift");
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      className="w-full border-yellow-500/30 text-fo-pending hover:bg-fo-pending-bg"
      onClick={cancelShift}
    >
      Cancel Shift
    </Button>
  );
}
