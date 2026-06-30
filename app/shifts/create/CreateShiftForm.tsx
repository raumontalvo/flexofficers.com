"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  buildShiftApiPayload,
  emptyPostShiftForm,
  type PostShiftFormValues,
} from "@/lib/shift-create-form";
import { PostShiftForm } from "@/components/shifts/post-shift-form";
import { PostShiftSummaryPanel } from "@/components/shifts/post-shift-summary-panel";

export default function CreateShiftForm() {
  const router = useRouter();
  const [form, setForm] = useState<PostShiftFormValues>(emptyPostShiftForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit() {
    setErrorMessage(null);

    const built = buildShiftApiPayload(form);

    if (!("payload" in built)) {
      setErrorMessage(built.error);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(built.payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
          details?: string[];
        } | null;
        const details = data?.details?.join(", ");
        throw new Error(
          details || data?.error || "Failed to create shift. Check required fields."
        );
      }

      router.push("/company/shifts");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create shift."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid w-full min-w-0 max-w-full gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 w-full max-w-full">
        <PostShiftForm form={form} onChange={setForm} />
      </div>
      <div className="min-w-0 w-full max-w-full">
        <PostShiftSummaryPanel
          form={form}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          onVisibilityChange={(visibility) =>
            setForm((current) => ({ ...current, visibility }))
          }
        />
      </div>
    </div>
  );
}
