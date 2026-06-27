export type OfficerLicenseSnapshot = {
  id: string;
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: Date;
};

export function formatLicenseExpirationDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function hasAtLeastOneLicense(
  licenses: readonly OfficerLicenseSnapshot[] | null | undefined
) {
  return (licenses?.length ?? 0) > 0;
}

export const OFFICER_LICENSE_HELPER_TEXT =
  "Add your professional security license information. Companies may use this information to review your eligibility.";

export const LICENSE_DISPLAY_DISCLAIMER =
  "FlexOfficers displays license information provided by the officer. Companies are responsible for verifying license validity before hiring or assigning work.";

export const LICENSE_CERTIFICATION_LABEL =
  "I certify that the professional license information I have provided is accurate and up to date.";

export const LICENSE_CERTIFICATION_ERROR =
  "You must certify that your license information is accurate before saving.";

export const LICENSE_CERTIFICATION_COMPANY_HELPER =
  "Companies are responsible for verifying license validity before hiring or assigning work.";

export const LICENSE_TYPE_REQUIRED_ERROR =
  "Select a license type for every license before saving.";
