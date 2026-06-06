"use client";

import { useState } from "react";

export default function CreateShiftPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    hourlyRate: "",
    requiredLicense: "",
    positionsNeeded: "1",
  });

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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Post a Shift</h1>

        <p className="mt-4 text-slate-300">
          Create a security shift and make it available to qualified officers.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Shift Title"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              />

              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                type="number"
                value={form.hourlyRate}
                onChange={(e) =>
                  setForm({ ...form, hourlyRate: e.target.value })
                }
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
              onChange={(e) =>
                setForm({ ...form, requiredLicense: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Required License"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
            >
              Create Shift
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}