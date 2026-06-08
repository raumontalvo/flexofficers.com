import { describe, expect, it } from "vitest";
import { LicenseVerificationStatus } from "@/app/generated/prisma/enums";
import {
  buildLicenseDocumentReplacementData,
  validateLicenseDocumentObjectKeyScope,
} from "@/app/api/uploads/license/complete/rules";

describe("license upload complete rules", () => {
  it("validates object key scope by uploadPrefix/officerId/licenseId", () => {
    expect(
      validateLicenseDocumentObjectKeyScope({
        uploadPrefix: "licenses",
        officerId: "officer_1",
        licenseId: "license_1",
        objectKey: "licenses/officer_1/license_1/2026-file.pdf",
      })
    ).toBe(true);

    expect(
      validateLicenseDocumentObjectKeyScope({
        uploadPrefix: "licenses",
        officerId: "officer_1",
        licenseId: "license_1",
        objectKey: "licenses/officer_2/license_1/2026-file.pdf",
      })
    ).toBe(false);
  });

  it("resets verification state to pending when document is replaced", () => {
    const now = new Date("2026-06-08T00:00:00.000Z");
    const data = buildLicenseDocumentReplacementData(
      {
        objectKey: "licenses/officer_1/license_1/new-doc.pdf",
        fileName: "new-doc.pdf",
        fileType: "application/pdf",
        fileSizeBytes: 1024,
      },
      now
    );

    expect(data.verificationStatus).toBe(LicenseVerificationStatus.PENDING);
    expect(data.verified).toBe(false);
    expect(data.verifiedAt).toBeNull();
    expect(data.verifiedByUserId).toBeNull();
    expect(data.verificationNotes).toBeNull();
    expect(data.documentUploadedAt).toEqual(now);
  });
});
