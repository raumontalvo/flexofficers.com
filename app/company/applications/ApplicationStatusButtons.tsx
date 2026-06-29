"use client";

import { Button } from "@/components/ui";

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

  async function updateStatus(nextStatus: "ACCEPTED" | "REJECTED") {
    const response = await fetch("/api/applications/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId, status: nextStatus }),
    });

    if (response.ok) {
      alert(`Applicant ${nextStatus.toLowerCase()}!`);
      window.location.reload();
    } else {
      alert("Failed to update applicant");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        fullWidth
        className="w-full bg-fo-success hover:bg-green-500"
        onClick={() => updateStatus("ACCEPTED")}
      >
        Accept
      </Button>

      <Button
        type="button"
        variant="danger"
        fullWidth
        className="w-full"
        onClick={() => updateStatus("REJECTED")}
      >
        Reject
      </Button>
    </div>
  );
}
