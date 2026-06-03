"use client";

export default function ApplyButton({ shiftId }: { shiftId: string }) {
  async function applyToShift() {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId }),
    });

    if (response.ok) {
      alert("Application submitted!");
    } else {
      alert("Failed to apply to shift");
    }
  }

  return (
    <button
      onClick={applyToShift}
      className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
    >
      Apply
    </button>
  );
}