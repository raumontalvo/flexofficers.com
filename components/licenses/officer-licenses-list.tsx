import type { OfficerLicenseSnapshot } from "@/lib/officer-licenses";
import { formatLicenseExpirationDate } from "@/lib/officer-licenses";

type OfficerLicensesListProps = {
  licenses: readonly OfficerLicenseSnapshot[];
  emptyMessage?: string;
};

export function OfficerLicensesList({
  licenses,
  emptyMessage = "No licenses provided",
}: OfficerLicensesListProps) {
  if (licenses.length === 0) {
    return <p className="text-sm text-fo-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {licenses.map((license) => (
        <div
          key={license.id}
          className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4"
        >
          <p className="text-sm font-semibold text-fo-text">{license.licenseType}</p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                License Number
              </dt>
              <dd className="mt-1 text-fo-text">{license.licenseNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Issuing State
              </dt>
              <dd className="mt-1 text-fo-text">{license.issuingState}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Expiration Date
              </dt>
              <dd className="mt-1 text-fo-text">
                {formatLicenseExpirationDate(license.expirationDate)}
              </dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
