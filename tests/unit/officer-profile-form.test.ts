import { describe, expect, it } from "vitest";
import { getProfileCompletionFromForm } from "@/lib/officer-profile-form";

describe("officer profile form completion", () => {
  it("derives completion percent from in-progress form values", () => {
    expect(
      getProfileCompletionFromForm({
        phone: "555-0100",
        armedStatuses: ["ARMED"],
        experienceCategories: ["Retail security"],
        experienceYears: "4",
        licenses: [
          {
            licenseType: "Unarmed Security",
            licenseNumber: "D1234567",
            issuingState: "FL",
            expirationDate: "2027-01-01",
          },
        ],
      })
    ).toBe(100);
  });

  it("ignores incomplete licenses when calculating completion", () => {
    expect(
      getProfileCompletionFromForm({
        phone: "555-0100",
        armedStatuses: ["ARMED"],
        experienceCategories: ["Retail security"],
        experienceYears: "4",
        licenses: [
          {
            licenseType: "",
            licenseNumber: "",
            issuingState: "",
            expirationDate: "",
          },
        ],
      })
    ).toBe(80);
  });
});
