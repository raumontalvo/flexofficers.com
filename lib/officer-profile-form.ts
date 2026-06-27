import type { ArmedStatus } from "@/app/generated/prisma/enums";
import { getProfileCompletionPercent } from "@/lib/officer-profile-completion";

type LicenseFormEntry = {
  licenseNumber: string;
  licenseType: string;
  issuingState: string;
  expirationDate: string;
};

export type OfficerProfileFormSnapshot = {
  phone: string;
  armedStatuses: ArmedStatus[];
  experienceCategories: string[];
  experienceYears: string;
  licenses: LicenseFormEntry[];
};

export function getProfileCompletionFromForm(form: OfficerProfileFormSnapshot) {
  const experienceYears =
    form.experienceYears.trim() === ""
      ? null
      : Number(form.experienceYears);

  const licenses = form.licenses
    .filter(
      (license) =>
        license.licenseType.trim() &&
        license.licenseNumber.trim() &&
        license.issuingState.trim() &&
        license.expirationDate.trim()
    )
    .map((license, index) => ({
      id: `form-${index}`,
      licenseType: license.licenseType,
      licenseNumber: license.licenseNumber,
      issuingState: license.issuingState,
      expirationDate: new Date(license.expirationDate),
    }));

  return getProfileCompletionPercent({
    phone: form.phone,
    armedStatuses: form.armedStatuses,
    experienceCategories: form.experienceCategories,
    experienceYears: Number.isFinite(experienceYears) ? experienceYears : null,
    licenses,
  });
}
