import { describe, expect, it } from "vitest";
import { serializePublicCompanyProfile } from "@/lib/public-company-profile";

const baseCompany = {
  id: "company-1",
  companyName: "UNITED STATES SECURITY",
  logoUrl: null,
  description: "Professional security services across Florida.",
  city: "Fort Myers",
  state: "FL",
  website: "https://example.com",
  address: "123 Main St",
  verified: true,
  licenseType: "Class B Security",
  licenseNumber: "B1234567",
  licenseState: "FL",
  contactName: "Private Contact",
  phone: "2399005653",
  email: "private@example.com",
  createdAt: new Date("2024-03-15T00:00:00.000Z"),
};

describe("public company profile", () => {
  it("serializes the public profile layout without private contact fields", () => {
    const profile = serializePublicCompanyProfile(baseCompany, [
      { requirements: ["Armed Security"] },
    ]);

    expect(profile?.displayCompanyName).toBe("United States Security");
    expect(profile?.services).toEqual(["Armed Security"]);
    expect(profile?.showContactDetails).toBe(false);
    expect(profile?.details.contactEmail).toBeNull();
    expect(profile?.support.phone).toBeNull();
  });

  it("returns null when the company has no publishable profile", () => {
    expect(
      serializePublicCompanyProfile({
        ...baseCompany,
        companyName: "Hidden Co",
        description: null,
        city: null,
        state: null,
        website: null,
      })
    ).toBeNull();
  });
});
