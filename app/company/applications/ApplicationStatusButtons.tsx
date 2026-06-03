"use client";

export default function ApplicationStatusButtons({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  if (status !== "PENDING") {
    return null;
  }

  async function updateStatus(status: "ACCEPTED" | "REJECTED") {
    const response = await fetch("/api/applications/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId, status }),
    });

    if (response.ok) {
      alert(`Application ${status.toLowerCase()}!`);
      window.location.reload();
    } else {
      alert("Failed to update application");
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={() => updateStatus("ACCEPTED")}
        className="rounded-xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-500"
      >
        Accept
      </button>

      <button
        onClick={() => updateStatus("REJECTED")}
        className="rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
      >
        Reject
      </button>
    </div>
  );
}