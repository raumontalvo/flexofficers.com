"use client";

import { useState } from "react";

type LicenseForm = {
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: string;
};

type OfficerProfileFormProps = {
  initialForm: {
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    state: string;
    bio: string;
    licenses: LicenseForm[];
  };
};

export default function OfficerProfileForm({
  initialForm,
}: OfficerProfileFormProps) {
  const [form, setForm] = useState(initialForm);

  function updateLicense(
    index: number,
    field: keyof LicenseForm,
    value: string
  ) {
    const updatedLicenses = [...form.licenses];
    updatedLicenses[index] = {
      ...updatedLicenses[index],
      [field]: value,
    };

    setForm({
      ...form,
      licenses: updatedLicenses,
    });
  }

  function addLicense() {
    setForm({
      ...form,
      licenses: [
        ...form.licenses,
        {
          licenseType: "",
          licenseNumber: "",
          issuingState: "",
          expirationDate: "",
        },
      ],
    });
  }

  function removeLicense(index: number) {
    const updatedLicenses = form.licenses.filter((_, i) => i !== index);

    setForm({
      ...form,
      licenses:
        updatedLicenses.length > 0
          ? updatedLicenses
          : [
              {
                licenseType: "",
                licenseNumber: "",
                issuingState: "",
                expirationDate: "",
              },
            ],
    });
  }

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
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <input
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          placeholder="First name"
        />

        <input
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          placeholder="Last name"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          placeholder="Phone"
        />

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
        <div>
          <h2 className="text-xl font-semibold">Licenses</h2>
          <p className="mt-2 text-sm text-slate-400">
            Add each license or certification separately.
          </p>
        </div>

        {form.licenses.map((license, index) => (
          <div
            key={index}
            className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={license.licenseType}
                onChange={(e) =>
                  updateLicense(index, "licenseType", e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="License type, example: D License"
              />

              <input
                value={license.licenseNumber}
                onChange={(e) =>
                  updateLicense(index, "licenseNumber", e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="License number"
              />

              <input
                value={license.issuingState}
                onChange={(e) =>
                  updateLicense(index, "issuingState", e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="Issuing state"
              />

                <input
                  type="date"
                  value={license.expirationDate}
                  onChange={(e) =>
                    updateLicense(index, "expirationDate", e.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                />
            </div>

            <button
              type="button"
              onClick={() => removeLicense(index)}
              className="w-fit rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
            >
              Remove License
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addLicense}
          className="w-fit rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
        >
          Add Another License
        </button>
      </div>

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
  );
}