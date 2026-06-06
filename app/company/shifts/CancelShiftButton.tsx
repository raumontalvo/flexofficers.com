"use client";

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
    <button
      onClick={cancelShift}
      className="rounded-xl bg-yellow-600 px-5 py-3 font-semibold hover:bg-yellow-500"
    >
      Cancel Shift
    </button>
  );
}