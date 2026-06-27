import type { OfficerLicenseSnapshot } from "@/lib/officer-licenses";
import { formatLicenseExpirationDate } from "@/lib/officer-licenses";

type CompanyOfficerLicensesProps = {
  licenses: readonly OfficerLicenseSnapshot[];
};

export function CompanyOfficerLicenses({ licenses }: CompanyOfficerLicensesProps) {
  if (licenses.length === 0) {
    return <p className="text-xs text-fo-text-muted">No licenses provided</p>;
  }

  return (
    <div className="space-y-2">
      {licenses.map((license) => (
        <div
          key={license.id}
          className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] sm:grid-cols-4"
        >
          <div>
            <p className="text-[10px] uppercase tracking-wide text-fo-text-subtle">
              License Type
            </p>
            <p className="mt-0.5 font-medium text-fo-text">{license.licenseType}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-fo-text-subtle">
              License Number
            </p>
            <p className="mt-0.5 font-medium text-fo-text">{license.licenseNumber}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-fo-text-subtle">
              Issuing State
            </p>
            <p className="mt-0.5 font-medium text-fo-text">{license.issuingState}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-fo-text-subtle">
              Expiration Date
            </p>
            <p className="mt-0.5 font-medium text-fo-text">
              {formatLicenseExpirationDate(license.expirationDate)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
