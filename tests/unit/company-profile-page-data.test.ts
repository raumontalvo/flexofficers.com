import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import {
  buildCompanySpecialties,
  companyHasPublicProfile,
  formatDisplayPhone,
  formatTitleCase,
  getCompanyFillRatePercent,
  sanitizeDisplayValue,
  serializeCompanyProfile,
} from "@/lib/company-profile-page-data";

const baseCompany = {
  id: "company-1",
  companyName: "United States Security",
  logoUrl: null,
  description: "Professional security services across Florida.",
  city: "Fort Myers",
  state: "FL",
  website: "https://example.com",
  contactName: "Raul Montalvo",
  phone: "239-555-0100",
  email: "owner@uss.test",
  address: "123 Main St",
  verified: true,
  licenseType: "Class B Security",
  licenseNumber: "B1234567",
  licenseState: "FL",
  createdAt: new Date("2024-03-15T00:00:00.000Z"),
};

describe("company profile page data", () => {
  it("serializes the premium company profile layout from real data", () => {
    const profile = serializeCompanyProfile({
      company: baseCompany,
      userEmail: "owner@uss.test",
      shifts: [{ requirements: ["Armed Security", "Event Security"] }],
      showContactDetails: true,
    });

    expect(profile.displayCompanyName).toBe("United States Security");
    expect(profile.showLicensedInsuredBadge).toBe(true);
    expect(profile.services).toEqual(["Armed Security", "Event Security"]);
    expect(profile.officerBenefits).toEqual([]);
    expect(profile.workEnvironment).toEqual([]);
    expect(profile.details.phone).toBe("(239) 555-0100");
    expect(profile.hasPublicProfile).toBe(true);
    expect(profile.showContactDetails).toBe(true);
    expect(profile.license.hasDocument).toBe(false);
  });

  it("hides contact details in public profile mode", () => {
    const profile = serializeCompanyProfile({
      company: baseCompany,
      userEmail: "owner@uss.test",
      shifts: [],
      showContactDetails: false,
    });

    expect(profile.details.contactEmail).toBeNull();
    expect(profile.details.phone).toBeNull();
    expect(profile.support.email).toBeNull();
    expect(profile.showContactDetails).toBe(false);
  });

  it("formats display helpers and public profile eligibility", () => {
    expect(formatTitleCase("UNITED STATES SECURITY")).toBe("United States Security");
    expect(formatDisplayPhone("2399005653")).toBe("(239) 900-5653");
    expect(formatDisplayPhone("+1 (239) 900-5653")).toBe("(239) 900-5653");
    expect(sanitizeDisplayValue(" none ")).toBeNull();
    expect(
      companyHasPublicProfile({
        companyName: "Acme Security",
        description: null,
        city: "Fort Myers",
        state: "FL",
        website: null,
      })
    ).toBe(true);
    expect(
      companyHasPublicProfile({
        companyName: "Acme Security",
        description: null,
        city: null,
        state: null,
        website: null,
      })
    ).toBe(false);
  });

  it("calculates fill rate from accepted applications and positions needed", () => {
    expect(
      getCompanyFillRatePercent([
        {
          positionsNeeded: 4,
          applications: [
            { status: ApplicationStatus.ACCEPTED },
            { status: ApplicationStatus.ACCEPTED },
          ],
        },
      ])
    ).toBe(50);
  });

  it("builds services from shift requirements only", () => {
    expect(
      buildCompanySpecialties([
        { requirements: ["Retail Security", "Armed Security"] },
        { requirements: ["Armed Security"] },
      ])
    ).toEqual(["Armed Security", "Retail Security"]);
  });
});
