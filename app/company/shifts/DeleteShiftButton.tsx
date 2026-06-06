"use client";

export default function DeleteShiftButton({ shiftId }: { shiftId: string }) {
  async function deleteShift() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shift? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/shifts/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId }),
    });

    if (response.ok) {
      alert("Shift deleted!");
      window.location.reload();
    } else {
      alert("Failed to delete shift");
    }
  }

  return (
    <button
      onClick={deleteShift}
      className="rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
    >
      Delete Shift
    </button>
  );
}