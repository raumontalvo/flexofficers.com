"use client";

import { useState } from "react";

type LicenseForm = {
  id?: string;
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: string;
  documentKey?: string;
  documentFileName?: string;
  documentMimeType?: string;
  documentSizeBytes?: number;
  documentUploadedAt?: string;
  verificationStatus?: string;
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
  const [uploadStatusByRow, setUploadStatusByRow] = useState<Record<string, string>>({});

  function getRowKey(license: LicenseForm, index: number) {
    return license.id ?? `new-${index}`;
  }

  function updateLicense(
    index: number,
    field: "licenseType" | "licenseNumber" | "issuingState" | "expirationDate",
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
          id: undefined,
          licenseType: "",
          licenseNumber: "",
          issuingState: "",
          expirationDate: "",
          documentKey: undefined,
          documentFileName: undefined,
          documentMimeType: undefined,
          documentSizeBytes: undefined,
          documentUploadedAt: undefined,
          verificationStatus: undefined,
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
                id: undefined,
                licenseType: "",
                licenseNumber: "",
                issuingState: "",
                expirationDate: "",
                documentKey: undefined,
                documentFileName: undefined,
                documentMimeType: undefined,
                documentSizeBytes: undefined,
                documentUploadedAt: undefined,
                verificationStatus: undefined,
              },
            ],
    });
  }

  async function uploadLicenseDocument(index: number, file: File) {
    const license = form.licenses[index];
    const rowKey = getRowKey(license, index);

    if (!license.id) {
      setUploadStatusByRow((prev) => ({
        ...prev,
        [rowKey]: "Save the profile once to create this license before uploading a document.",
      }));
      return;
    }

    setUploadStatusByRow((prev) => ({
      ...prev,
      [rowKey]: "Requesting upload URL...",
    }));

    try {
      const presignResponse = await fetch("/api/uploads/license/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseId: license.id,
          fileName: file.name,
          fileType: file.type,
          fileSizeBytes: file.size,
        }),
      });

      const presignPayload = (await presignResponse.json()) as {
        uploadUrl?: string;
        objectKey?: string;
        requiredHeaders?: Record<string, string>;
        error?: string;
      };

      if (!presignResponse.ok || !presignPayload.uploadUrl || !presignPayload.objectKey) {
        throw new Error(presignPayload.error || "Failed to create upload URL");
      }

      setUploadStatusByRow((prev) => ({
        ...prev,
        [rowKey]: "Uploading document...",
      }));

      const uploadResponse = await fetch(presignPayload.uploadUrl, {
        method: "PUT",
        headers: presignPayload.requiredHeaders,
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadStatusByRow((prev) => ({
        ...prev,
        [rowKey]: "Finalizing upload...",
      }));

      const completeResponse = await fetch("/api/uploads/license/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseId: license.id,
          objectKey: presignPayload.objectKey,
          fileName: file.name,
          fileType: file.type,
          fileSizeBytes: file.size,
        }),
      });

      const completePayload = (await completeResponse.json()) as {
        error?: string;
        success?: boolean;
        license?: {
          id: string;
          documentKey?: string | null;
          documentFileName?: string | null;
          documentMimeType?: string | null;
          documentSizeBytes?: number | null;
          documentUploadedAt?: string | null;
          verificationStatus?: string | null;
        };
      };

      if (!completeResponse.ok || !completePayload.license) {
        throw new Error(completePayload.error || "Failed to finalize upload");
      }

      const completedLicense = completePayload.license;

      setForm((prev) => {
        const updatedLicenses = [...prev.licenses];
        updatedLicenses[index] = {
          ...updatedLicenses[index],
          id: completedLicense.id,
          documentKey: completedLicense.documentKey ?? undefined,
          documentFileName: completedLicense.documentFileName ?? undefined,
          documentMimeType: completedLicense.documentMimeType ?? undefined,
          documentSizeBytes: completedLicense.documentSizeBytes ?? undefined,
          documentUploadedAt: completedLicense.documentUploadedAt ?? undefined,
          verificationStatus: completedLicense.verificationStatus ?? undefined,
        };

        return {
          ...prev,
          licenses: updatedLicenses,
        };
      });

      setUploadStatusByRow((prev) => ({
        ...prev,
        [rowKey]: "Upload complete",
      }));
    } catch (error) {
      setUploadStatusByRow((prev) => ({
        ...prev,
        [rowKey]:
          error instanceof Error ? error.message : "Failed to upload document",
      }));
    }
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

            <div className="grid gap-3">
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    void uploadLicenseDocument(index, file);
                  }
                }}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-white"
              />

              {uploadStatusByRow[getRowKey(license, index)] && (
                <p className="text-sm text-slate-300">
                  {uploadStatusByRow[getRowKey(license, index)]}
                </p>
              )}

              {license.documentFileName && (
                <p className="text-sm text-slate-300">
                  Uploaded file: {license.documentFileName}
                </p>
              )}

              {license.verificationStatus && (
                <p className="text-sm text-slate-300">
                  Verification status: {license.verificationStatus}
                </p>
              )}
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