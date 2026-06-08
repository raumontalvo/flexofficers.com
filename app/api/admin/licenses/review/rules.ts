import { LicenseVerificationStatus } from "@/app/generated/prisma/enums";

export function isValidAdminLicenseDecision(value: unknown): value is "VERIFIED" | "REJECTED" {
  return (
    value === LicenseVerificationStatus.VERIFIED ||
    value === LicenseVerificationStatus.REJECTED
  );
}

export function hasUploadedLicenseDocument(documentKey: string | null | undefined) {
  return typeof documentKey === "string" && documentKey.trim().length > 0;
}

export function buildAdminLicenseReviewData(params: {
  decision: "VERIFIED" | "REJECTED";
  verifiedByUserId: string;
  verificationNotes: string | null;
  now?: Date;
}) {
  const reviewedAt = params.now ?? new Date();

  return {
    verificationStatus: params.decision,
    verified: params.decision === LicenseVerificationStatus.VERIFIED,
    verifiedAt: reviewedAt,
    verifiedByUserId: params.verifiedByUserId,
    verificationNotes: params.verificationNotes,
  };
}
