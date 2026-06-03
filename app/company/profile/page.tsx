"use client";

import { useState } from "react";

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/company/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Company profile saved!");
    } else {
      alert("Failed to save company profile");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Company Profile</h1>

        <p className="mt-4 text-slate-300">
          Add your company details so officers can learn who they are applying
          to work with.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <input
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Company name"
            />

            <input
              value={form.contactName}
              onChange={(e) =>
                setForm({ ...form, contactName: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Contact name"
            />

            <input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Phone number"
            />

            <input
              value={form.website}
              onChange={(e) =>
                setForm({ ...form, website: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Website"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <input
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="City"
              />

              <input
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="State"
              />
            </div>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Company description"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
            >
              Save Company Profile
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}