"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostShiftForm } from "@/components/shifts/post-shift-form";
import { EditShiftSummaryPanel } from "@/components/shifts/edit-shift-summary-panel";
import {
  buildShiftUpdatePayload,
  type PostShiftFormValues,
} from "@/lib/shift-create-form";

export default function EditShiftForm({
  shiftId,
  initialForm,
  reportingInstructions,
}: {
  shiftId: string;
  initialForm: PostShiftFormValues;
  reportingInstructions?: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit() {
    setErrorMessage(null);

    const built = buildShiftUpdatePayload(form, {
      shiftId,
      reportingInstructions,
    });

    if (!("payload" in built)) {
      setErrorMessage(built.error);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/shifts/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(built.payload),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        details?: string[];
      } | null;

      if (!response.ok) {
        const details = data?.details?.join(", ");
        throw new Error(details || data?.error || "Failed to update shift.");
      }

      router.push("/company/shifts");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update shift."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <PostShiftForm
        form={form}
        onChange={setForm}
        otherRequirementsPlaceholder="2+ years experience, customer service, professional appearance"
      />
      <EditShiftSummaryPanel
        shiftId={shiftId}
        form={form}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
