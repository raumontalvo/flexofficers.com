"use client";

import { useState } from "react";

type ReviewLicenseButtonProps = {
  licenseId: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
};

export default function ReviewLicenseButton({
  licenseId,
  verificationStatus,
}: ReviewLicenseButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectNotes, setShowRejectNotes] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  async function openDocument() {
    setIsOpening(true);

    try {
      const response = await fetch("/api/uploads/license/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to open document");
        return;
      }

      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch {
      alert("Failed to open document");
    } finally {
      setIsOpening(false);
    }
  }

  async function submitReview(decision: "VERIFIED" | "REJECTED") {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/licenses/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseId,
          decision,
          verificationNotes: decision === "REJECTED" ? rejectNotes : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to review license");
        return;
      }

      alert(
        decision === "VERIFIED"
          ? "License marked as verified"
          : "License marked as rejected"
      );
      window.location.reload();
    } catch {
      alert("Failed to review license");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 md:w-auto md:min-w-72">
      <div className="text-sm text-slate-300">
        Current status:{" "}
        <span className="font-semibold text-white">{verificationStatus}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={openDocument}
          disabled={isOpening || isSubmitting}
          className="rounded-xl bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isOpening ? "Opening..." : "Open Document"}
        </button>

        <button
          onClick={() => submitReview("VERIFIED")}
          disabled={isSubmitting || isOpening}
          className="rounded-xl bg-green-600 px-4 py-2 font-semibold hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Verify"}
        </button>

        <button
          onClick={() => setShowRejectNotes((value) => !value)}
          disabled={isSubmitting || isOpening}
          className="rounded-xl bg-red-700 px-4 py-2 font-semibold hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reject
        </button>
      </div>

      {showRejectNotes ? (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-200">
            Rejection notes (optional)
          </label>

          <textarea
            value={rejectNotes}
            onChange={(event) => setRejectNotes(event.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-sky-400 focus:ring-2"
            placeholder="Provide context for the officer (optional)."
          />

          <button
            onClick={() => submitReview("REJECTED")}
            disabled={isSubmitting || isOpening}
            className="rounded-xl bg-red-700 px-4 py-2 font-semibold hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Confirm Reject"}
          </button>
        </div>
      ) : null}
    </div>
  );
}