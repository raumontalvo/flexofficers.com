"use client";

export default function VerifyCompanyButton({
  companyId,
  verified,
}: {
  companyId: string;
  verified: boolean;
}) {
  async function updateVerification() {
    const response = await fetch("/api/admin/companies/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyId, verified: !verified }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(verified ? "Company unverified!" : "Company verified!");
      window.location.reload();
    } else {
      alert(data.error || "Failed to update company verification");
    }
  }

  return (
    <button
      onClick={updateVerification}
      className={
        verified
          ? "rounded-xl bg-yellow-600 px-5 py-3 font-semibold hover:bg-yellow-500"
          : "rounded-xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-500"
      }
    >
      {verified ? "Remove Verification" : "Verify Company"}
    </button>
  );
}