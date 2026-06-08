import { LicenseVerificationStatus } from "@/app/generated/prisma/enums";
import { normalizeUploadPrefix } from "@/lib/license-documents";

type LicenseDocumentMetadata = {
  objectKey: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
};

export function validateLicenseDocumentObjectKeyScope(params: {
  uploadPrefix: string;
  officerId: string;
  licenseId: string;
  objectKey: string;
}) {
  const normalizedPrefix = normalizeUploadPrefix(params.uploadPrefix);
  const expectedPrefix = `${normalizedPrefix}/${params.officerId}/${params.licenseId}/`;

  return params.objectKey.startsWith(expectedPrefix);
}

export function buildLicenseDocumentReplacementData(
  metadata: LicenseDocumentMetadata,
  now: Date = new Date()
) {
  return {
    documentKey: metadata.objectKey,
    documentFileName: metadata.fileName,
    documentMimeType: metadata.fileType,
    documentSizeBytes: metadata.fileSizeBytes,
    documentUploadedAt: now,
    verificationStatus: LicenseVerificationStatus.PENDING,
    verified: false,
    verificationNotes: null,
    verifiedAt: null,
    verifiedByUserId: null,
  };
}
