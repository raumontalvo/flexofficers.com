"use client";

import { useState } from "react";

export default function OfficerProfilePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    licenseType: "",
    bio: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/officer/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Officer profile saved!");
    } else {
      alert("Failed to save officer profile");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Officer Profile</h1>

        <p className="mt-4 text-slate-300">
          Add your license, experience, location, and availability so companies
          can review your profile.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="First name"
              />

              <input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="Last name"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="City"
              />

              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="State"
              />
            </div>

            <input
              value={form.licenseType}
              onChange={(e) =>
                setForm({ ...form, licenseType: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="License type, example: D License, G License"
            />

            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Brief experience summary"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
            >
              Save Officer Profile
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}