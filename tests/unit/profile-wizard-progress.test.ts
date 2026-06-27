import { describe, expect, it } from "vitest";
import {
  getWizardSectionProgress,
  isWizardStepComplete,
} from "@/app/officer/profile/profile-wizard-progress";

const partialForm = {
  firstName: "Jane",
  lastName: "Doe",
  phone: "555-0100",
  email: "jane@example.com",
  city: "Miami",
  armedStatuses: ["ARMED"],
  experienceYears: "4",
  experienceCategories: ["Retail Security"],
  licenses: [
    {
      licenseType: "",
      licenseNumber: "",
      issuingState: "",
      expirationDate: "",
    },
  ],
  licenseCertificationAccepted: false,
  certifications: [],
  availability: [],
};

describe("profile wizard progress", () => {
  it("tracks completed wizard sections from form values", () => {
    expect(isWizardStepComplete("basic", partialForm)).toBe(true);
    expect(isWizardStepComplete("experience", partialForm)).toBe(true);
    expect(isWizardStepComplete("licenses", partialForm)).toBe(false);

    const progress = getWizardSectionProgress(partialForm);
    expect(progress.completedCount).toBe(2);
    expect(progress.totalCount).toBe(5);
    expect(progress.nextStepLabel).toBe("Professional Licenses");
  });

  it("marks optional sections complete when selections exist", () => {
    const form = {
      ...partialForm,
      licenses: [
        {
          licenseType: "Unarmed Security",
          licenseNumber: "3341714",
          issuingState: "FL",
          expirationDate: "2026-06-26",
        },
      ],
      licenseCertificationAccepted: true,
      certifications: ["CPR / First Aid"],
      availability: ["Weekdays"],
    };

    expect(getWizardSectionProgress(form).completedCount).toBe(5);
    expect(getWizardSectionProgress(form).allComplete).toBe(true);
  });
});
