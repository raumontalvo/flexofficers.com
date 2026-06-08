import { describe, expect, it } from "vitest";
import { UserRole } from "@/app/generated/prisma/enums";
import { canAccessLicenseDocument } from "@/app/api/uploads/license/download/rules";

describe("canAccessLicenseDocument", () => {
  it("allows admin", () => {
    const allowed = canAccessLicenseDocument({
      actor: {
        role: UserRole.ADMIN,
      },
      licenseOfficerId: "officer_1",
    });

    expect(allowed).toBe(true);
  });

  it("allows officer owner and denies non-owner", () => {
    expect(
      canAccessLicenseDocument({
        actor: {
          role: UserRole.OFFICER,
          officerId: "officer_1",
        },
        licenseOfficerId: "officer_1",
      })
    ).toBe(true);

    expect(
      canAccessLicenseDocument({
        actor: {
          role: UserRole.OFFICER,
          officerId: "officer_2",
        },
        licenseOfficerId: "officer_1",
      })
    ).toBe(false);
  });
});
