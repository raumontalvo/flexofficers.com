import { afterEach, describe, expect, it } from "vitest";
import { parseLicenseUploadPayload } from "@/app/api/uploads/license/validation";

const originalEnv = { ...process.env };

function applyStorageEnv() {
  process.env.STORAGE_PROVIDER = "s3";
  process.env.STORAGE_BUCKET = "flexofficers-docs";
  process.env.STORAGE_REGION = "us-east-1";
  process.env.STORAGE_ACCESS_KEY_ID = "key";
  process.env.STORAGE_SECRET_ACCESS_KEY = "secret";
  process.env.LICENSE_UPLOAD_PREFIX = "licenses";
}

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("parseLicenseUploadPayload", () => {
  it("returns validation errors for missing licenseId", () => {
    applyStorageEnv();

    const result = parseLicenseUploadPayload({
      fileName: "license.pdf",
      fileType: "application/pdf",
      fileSizeBytes: 100,
    });

    expect("errors" in result).toBe(true);

    if ("errors" in result) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "licenseId",
            message: "licenseId is required",
          }),
        ])
      );
    }
  });

  it("parses valid payload and creates scoped object keys", () => {
    applyStorageEnv();

    const result = parseLicenseUploadPayload({
      licenseId: "license_123",
      fileName: "My License.pdf",
      fileType: "application/pdf",
      fileSizeBytes: 1024,
    });

    expect("data" in result).toBe(true);

    if ("data" in result) {
      const objectKey = result.data.createObjectKey(
        "officer_123",
        new Date("2026-06-08T00:00:00.000Z")
      );

      expect(objectKey.startsWith("licenses/officer_123/license_123/")).toBe(true);
      expect(objectKey).toContain("my-license.pdf");
    }
  });
});
