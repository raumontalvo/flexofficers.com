import { describe, expect, it } from "vitest";
import { LicenseVerificationStatus } from "@/app/generated/prisma/enums";
import {
  buildAdminLicenseReviewData,
  hasUploadedLicenseDocument,
  isValidAdminLicenseDecision,
} from "@/app/api/admin/licenses/review/rules";

describe("admin license review rules", () => {
  it("accepts only VERIFIED or REJECTED decisions", () => {
    expect(isValidAdminLicenseDecision("VERIFIED")).toBe(true);
    expect(isValidAdminLicenseDecision("REJECTED")).toBe(true);
    expect(isValidAdminLicenseDecision("PENDING")).toBe(false);
    expect(isValidAdminLicenseDecision("foo")).toBe(false);
  });

  it("builds review data with correct verified boolean", () => {
    const now = new Date("2026-06-08T00:00:00.000Z");

    const verifiedData = buildAdminLicenseReviewData({
      decision: "VERIFIED",
      verifiedByUserId: "admin_1",
      verificationNotes: "Looks good",
      now,
    });

    expect(verifiedData.verificationStatus).toBe(LicenseVerificationStatus.VERIFIED);
    expect(verifiedData.verified).toBe(true);
    expect(verifiedData.verifiedByUserId).toBe("admin_1");

    const rejectedData = buildAdminLicenseReviewData({
      decision: "REJECTED",
      verifiedByUserId: "admin_1",
      verificationNotes: "Missing details",
      now,
    });

    expect(rejectedData.verificationStatus).toBe(LicenseVerificationStatus.REJECTED);
    expect(rejectedData.verified).toBe(false);
  });

  it("requires non-empty document key for review eligibility", () => {
    expect(hasUploadedLicenseDocument("licenses/officer/license/file.pdf")).toBe(
      true
    );
    expect(hasUploadedLicenseDocument("   ")).toBe(false);
    expect(hasUploadedLicenseDocument(undefined)).toBe(false);
    expect(hasUploadedLicenseDocument(null)).toBe(false);
  });
});
