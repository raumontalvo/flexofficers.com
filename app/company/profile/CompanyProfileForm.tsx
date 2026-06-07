"use client";

import { useState } from "react";

type CompanyProfileFormProps = {
  initialForm: {
    companyName: string;
    contactName: string;
    phone: string;
    website: string;
    city: string;
    state: string;
    description: string;
    licenseType: string;
    licenseNumber: string;
    licenseState: string;
  };
};

export default function CompanyProfileForm({
  initialForm,
}: CompanyProfileFormProps) {
  const [form, setForm] = useState(initialForm);

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
    <form onSubmit={handleSubmit} className="grid gap-6">
      <input
        value={form.companyName}
        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Company name"
      />

      <input
        value={form.contactName}
        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Contact name"
      />

      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Phone number"
      />

      <input
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        placeholder="Website"
      />

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

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="text-xl font-semibold">Company License</h2>

        <input
          value={form.licenseType}
          onChange={(e) => setForm({ ...form, licenseType: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          placeholder="License type, example: Security Agency License"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <input
            value={form.licenseNumber}
            onChange={(e) =>
              setForm({ ...form, licenseNumber: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            placeholder="License number"
          />

          <input
            value={form.licenseState}
            onChange={(e) =>
              setForm({ ...form, licenseState: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            placeholder="Issuing state"
          />
        </div>
      </div>

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
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
  );
}