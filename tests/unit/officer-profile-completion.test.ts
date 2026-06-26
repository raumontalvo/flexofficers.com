import { describe, expect, it } from "vitest";
import {
  getIncompleteProfileLabels,
  getProfileCompletionPercent,
} from "@/lib/officer-profile-completion";

describe("officer profile completion", () => {
  it("tracks the required officer profile fields", () => {
    const labels = getIncompleteProfileLabels({
      phone: "555-0100",
      armedStatuses: [],
      experienceCategories: [],
      experienceYears: null,
      licenseExpirationDate: null,
    });

    expect(labels).toEqual([
      "Select armed and/or unarmed",
      "Add experience categories",
      "Add your years of experience",
      "Add your license expiration date",
    ]);
  });

  it("returns 100% when all fields are complete", () => {
    expect(
      getProfileCompletionPercent({
        phone: "555-0100",
        armedStatuses: ["ARMED"],
        experienceCategories: ["Retail security"],
        experienceYears: 4,
        licenseExpirationDate: new Date("2027-01-01"),
      })
    ).toBe(100);
  });
});
