import { describe, expect, it } from "vitest";
import { getCompanyProfileCompletion } from "@/lib/company-profile-completion";

describe("getCompanyProfileCompletion", () => {
  const completeCompany = {
    companyName: "Acme Security",
    email: "ops@acme.test",
    phone: "555-0100",
    address: "123 Main St",
    city: "Miami",
    state: "FL",
  };

  it("returns complete when all required fields are present", () => {
    const result = getCompanyProfileCompletion(completeCompany, "owner@acme.test");

    expect(result.isComplete).toBe(true);
    expect(result.completionPercent).toBe(100);
    expect(result.missingItems).toEqual([]);
  });

  it("uses the account email when company email is missing", () => {
    const result = getCompanyProfileCompletion(
      {
        ...completeCompany,
        email: null,
      },
      "owner@acme.test"
    );

    expect(result.isComplete).toBe(true);
    expect(result.missingItems).not.toContain("Contact email");
  });

  it("lists missing required fields and calculates completion percent", () => {
    const result = getCompanyProfileCompletion(
      {
        companyName: "Acme Security",
        email: "ops@acme.test",
        phone: null,
        address: "123 Main St",
        city: null,
        state: "FL",
      },
      "owner@acme.test"
    );

    expect(result.isComplete).toBe(false);
    expect(result.missingItems).toEqual(["Phone number", "City"]);
    expect(result.completionPercent).toBe(67);
  });

  it("treats a missing company record as incomplete", () => {
    const result = getCompanyProfileCompletion(null, "");

    expect(result.isComplete).toBe(false);
    expect(result.missingItems.length).toBeGreaterThan(0);
    expect(result.completionPercent).toBeLessThan(100);
  });
});
