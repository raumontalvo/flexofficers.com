import { describe, expect, it } from "vitest";
import { validateLicenseUploadInput } from "@/lib/license-documents";

describe("validateLicenseUploadInput", () => {
  const options = {
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxUploadBytes: 5 * 1024 * 1024,
  };

  it("rejects disallowed MIME type", () => {
    const result = validateLicenseUploadInput(
      {
        fileName: "license.exe",
        fileType: "application/octet-stream",
        fileSizeBytes: 100,
      },
      options
    );

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "fileType", message: "fileType is not allowed" }),
        ])
      );
    }
  });

  it("rejects file size above max", () => {
    const result = validateLicenseUploadInput(
      {
        fileName: "license.pdf",
        fileType: "application/pdf",
        fileSizeBytes: options.maxUploadBytes + 1,
      },
      options
    );

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "fileSizeBytes",
            message: "fileSizeBytes exceeds maximum allowed size",
          }),
        ])
      );
    }
  });
});
