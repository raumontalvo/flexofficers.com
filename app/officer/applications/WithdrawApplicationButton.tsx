"use client";

import { Button } from "@/components/ui";

export default function WithdrawApplicationButton({
  applicationId,
}: {
  applicationId: string;
}) {
  async function withdrawApplication() {
    const confirmed = window.confirm(
      "Withdraw this application? You will no longer be considered for this shift."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/applications/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Application withdrawn.");
      window.location.reload();
      return;
    }

    alert(data?.error || "Failed to withdraw application");
  }

  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      className="w-full border-yellow-500/30 text-fo-pending hover:bg-fo-pending-bg"
      onClick={withdrawApplication}
    >
      Withdraw Application
    </Button>
  );
}
