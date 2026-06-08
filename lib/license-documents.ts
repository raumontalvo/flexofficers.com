import { randomUUID } from "node:crypto";

export type LicenseUploadValidationOptions = {
  allowedMimeTypes: string[];
  maxUploadBytes: number;
};

export type LicenseUploadValidationInput = {
  fileName: unknown;
  fileType: unknown;
  fileSizeBytes: unknown;
};

type LicenseUploadFieldError = {
  field: string;
  message: string;
};

type LicenseUploadValidationResult =
  | {
      errors: LicenseUploadFieldError[];
    }
  | {
      data: {
        fileName: string;
        fileType: string;
        fileSizeBytes: number;
      };
    };

const SAFE_CHARS_REGEX = /[^a-zA-Z0-9._-]+/g;

export function sanitizeFileName(fileName: string) {
  const collapsed = fileName
    .replace(/[\\/]+/g, "-")
    .replace(SAFE_CHARS_REGEX, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .toLowerCase();

  return collapsed || "document";
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

export function validateLicenseUploadInput(
  input: LicenseUploadValidationInput,
  options: LicenseUploadValidationOptions
): LicenseUploadValidationResult {
  const errors: LicenseUploadFieldError[] = [];

  const fileName = typeof input.fileName === "string" ? input.fileName.trim() : "";
  if (!fileName) {
    errors.push({ field: "fileName", message: "fileName is required" });
  }

  const fileType = typeof input.fileType === "string" ? input.fileType.trim().toLowerCase() : "";
  if (!fileType) {
    errors.push({ field: "fileType", message: "fileType is required" });
  } else if (!options.allowedMimeTypes.includes(fileType)) {
    errors.push({ field: "fileType", message: "fileType is not allowed" });
  }

  const fileSizeBytes = Number(input.fileSizeBytes);
  if (!Number.isInteger(fileSizeBytes) || fileSizeBytes <= 0) {
    errors.push({ field: "fileSizeBytes", message: "fileSizeBytes must be a positive integer" });
  } else if (fileSizeBytes > options.maxUploadBytes) {
    errors.push({ field: "fileSizeBytes", message: "fileSizeBytes exceeds maximum allowed size" });
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      fileName,
      fileType,
      fileSizeBytes,
    },
  };
}

export function generateLicenseDocumentObjectKey(params: {
  uploadPrefix: string;
  officerId: string;
  licenseId: string;
  fileName: string;
  now?: Date;
}) {
  const prefix = sanitizeSegment(params.uploadPrefix) || "licenses";
  const officerId = sanitizeSegment(params.officerId);
  const licenseId = sanitizeSegment(params.licenseId);

  if (!officerId) {
    throw new Error("officerId is required");
  }

  if (!licenseId) {
    throw new Error("licenseId is required");
  }

  const timestamp = (params.now ?? new Date()).toISOString().replace(/[:.]/g, "-");
  const safeName = sanitizeFileName(params.fileName);

  return `${prefix}/${officerId}/${licenseId}/${timestamp}-${randomUUID()}-${safeName}`;
}
