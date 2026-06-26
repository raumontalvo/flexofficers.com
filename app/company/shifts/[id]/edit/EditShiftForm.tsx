"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import {
  ShiftFormFields,
  type ShiftFormValues,
} from "@/app/shifts/ShiftFormFields";

export default function EditShiftForm({
  shiftId,
  initialForm,
}: {
  shiftId: string;
  initialForm: ShiftFormValues;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/shifts/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shiftId, ...form }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Shift updated!");
      router.push("/company/shifts");
      router.refresh();
      return;
    }

    if (Array.isArray(data?.details) && data.details.length > 0) {
      alert(data.details.join("\n"));
      return;
    }

    alert(data?.error || "Failed to update shift");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ShiftFormFields form={form} onChange={setForm} />

      <Button type="submit" fullWidth className="w-full">
        Save Changes
      </Button>
    </form>
  );
}
