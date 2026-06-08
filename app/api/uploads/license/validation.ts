import {
  generateLicenseDocumentObjectKey,
  validateLicenseUploadInput,
} from "@/lib/license-documents";
import { getStorageConfig } from "@/lib/storage";

type LicenseUploadPayload = {
  licenseId?: unknown;
  fileName?: unknown;
  fileType?: unknown;
  fileSizeBytes?: unknown;
};

type FieldError = {
  field: string;
  message: string;
};

export function parseLicenseUploadPayload(payload: LicenseUploadPayload) {
  const errors: FieldError[] = [];

  const licenseId = typeof payload.licenseId === "string" ? payload.licenseId.trim() : "";

  if (!licenseId) {
    errors.push({
      field: "licenseId",
      message: "licenseId is required",
    });
  }

  const storageConfig = getStorageConfig();
  const fileValidation = validateLicenseUploadInput(
    {
      fileName: payload.fileName,
      fileType: payload.fileType,
      fileSizeBytes: payload.fileSizeBytes,
    },
    {
      allowedMimeTypes: storageConfig.allowedMimeTypes,
      maxUploadBytes: storageConfig.maxUploadBytes,
    }
  );

  if ("errors" in fileValidation) {
    errors.push(...fileValidation.errors);
  }

  const fileData = "data" in fileValidation ? fileValidation.data : null;

  if (errors.length > 0 || !fileData) {
    return { errors };
  }

  return {
    data: {
      licenseId,
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSizeBytes: fileData.fileSizeBytes,
      createObjectKey(officerId: string, now?: Date) {
        return generateLicenseDocumentObjectKey({
          uploadPrefix: storageConfig.uploadPrefix,
          officerId,
          licenseId,
          fileName: fileData.fileName,
          now,
        });
      },
    },
  };
}
