import { describe, expect, it } from "vitest";
import {
  getIncompleteProfileLabels,
  getProfileCompletionPercent,
} from "@/lib/officer-profile-completion";

const completeLicense = {
  id: "license-1",
  licenseType: "Unarmed Security",
  licenseNumber: "D1234567",
  issuingState: "FL",
  expirationDate: new Date("2027-01-01"),
};

describe("officer profile completion", () => {
  it("tracks the required officer profile fields", () => {
    const labels = getIncompleteProfileLabels({
      phone: "555-0100",
      armedStatuses: [],
      experienceCategories: [],
      experienceYears: null,
      licenses: [],
    });

    expect(labels).toEqual([
      "Select armed and/or unarmed",
      "Add experience categories",
      "Add your years of experience",
      "Add at least one license",
    ]);
  });

  it("returns 100% when all fields are complete", () => {
    expect(
      getProfileCompletionPercent({
        phone: "555-0100",
        armedStatuses: ["ARMED"],
        experienceCategories: ["Retail Security"],
        experienceYears: 4,
        licenses: [completeLicense],
      })
    ).toBe(100);
  });
});
