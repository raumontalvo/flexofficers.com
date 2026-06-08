"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ShiftFormState = {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  hourlyRate: string;
  requiredLicense: string;
  positionsNeeded: string;
};

export default function EditShiftForm({
  shiftId,
  initialForm,
}: {
  shiftId: string;
  initialForm: ShiftFormState;
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
    <form onSubmit={handleSubmit} className="grid gap-6">
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Shift Title"
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Shift Description"
      />

      <input
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Location"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <input
          type="datetime-local"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        />

        <input
          type="datetime-local"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <input
          type="number"
          value={form.hourlyRate}
          onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          placeholder="Hourly Rate"
        />

        <input
          type="number"
          min="1"
          value={form.positionsNeeded}
          onChange={(e) =>
            setForm({ ...form, positionsNeeded: e.target.value })
          }
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          placeholder="Number of officers needed"
        />
      </div>

      <input
        value={form.requiredLicense}
        onChange={(e) => setForm({ ...form, requiredLicense: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Required License"
      />

      <button
        type="submit"
        className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
      >
        Save Changes
      </button>
    </form>
  );
}
