import { describe, expect, it } from "vitest";
import { generateLicenseDocumentObjectKey } from "@/lib/license-documents";

describe("generateLicenseDocumentObjectKey", () => {
  it("builds a safe structured key", () => {
    const key = generateLicenseDocumentObjectKey({
      uploadPrefix: "licenses",
      officerId: "officer_123",
      licenseId: "license_456",
      fileName: "../My License 2026.pdf",
      now: new Date("2026-06-08T00:00:00.000Z"),
    });

    expect(key.startsWith("licenses/officer_123/license_456/")).toBe(true);
    expect(key.includes("../")).toBe(false);
    expect(key.includes("\\")).toBe(false);
    expect(key).toContain("my-license-2026.pdf");
  });
});
