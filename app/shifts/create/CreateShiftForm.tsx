"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ShiftFormFields } from "../ShiftFormFields";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  startTime: "",
  endTime: "",
  hourlyRate: "",
  specialRequirements: "",
  reportingInstructions: "",
  positionsNeeded: "",
};

export default function CreateShiftForm() {
  const [form, setForm] = useState(emptyForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/shifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Shift created!");
    } else {
      alert("Failed to create shift");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ShiftFormFields form={form} onChange={setForm} />

      <Button type="submit" fullWidth className="w-full">
        Create Shift
      </Button>
    </form>
  );
}
