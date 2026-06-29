import { describe, expect, it } from "vitest";
import {
  buildCertificationRequirementsText,
  buildLicenseRequirementsText,
  buildShiftApiPayload,
  buildShiftDateTimes,
  buildShiftLocation,
  buildShiftUpdatePayload,
  calculateEstimatedShiftTotal,
  deriveShiftTimeType,
  emptyPostShiftForm,
  formatPostShiftDateTime,
  getShiftSummaryFields,
  mapCertificationRequirements,
  mapLicenseRequirements,
  parseCertificationRequirementsFromShift,
  parseFreeformOtherRequirements,
  parseLicenseRequirementsFromShift,
  parseShiftLocationFields,
  shiftToPostShiftFormValues,
  splitShiftDateTimes,
} from "@/lib/shift-create-form";

describe("shift create form helpers", () => {
  const baseForm = {
    ...emptyPostShiftForm,
    title: "Mall Security Officer",
    workType: "Gig",
    description: "Monitor entrances and patrol parking areas.",
    startDate: "2026-07-01",
    startTime: "09:00",
    endTime: "17:00",
    locationName: "Gulf Coast Town Center",
    address: "9903 Gulf Coast Main St",
    city: "Fort Myers",
    state: "FL",
    zipCode: "33913",
    hourlyRate: "28",
    licenseRequirements: ["Unarmed Security", "K9 Security"] as const,
    certificationRequirements: [
      "CPR / First Aid",
      "Taser",
    ] as const,
    otherRequirements: "Customer service experience preferred",
    positionsNeeded: 2,
  };

  it("combines start and end times on the same day", () => {
    const { startTime, endTime } = buildShiftDateTimes(baseForm);

    expect(startTime?.getHours()).toBe(9);
    expect(endTime?.getHours()).toBe(17);
  });

  it("builds a location string from name, address, and zip", () => {
    expect(buildShiftLocation(baseForm)).toBe(
      "Gulf Coast Town Center | 9903 Gulf Coast Main St, 33913"
    );
  });

  it("derives day shift time type from daytime hours", () => {
    const { startTime, endTime } = buildShiftDateTimes(baseForm);

    expect(deriveShiftTimeType(startTime!, endTime!)).toBe("Day Shift");
  });

  it("maps multiple license requirements to backend fields", () => {
    expect(mapLicenseRequirements(["Unarmed Security", "K9 Security"])).toEqual({
      requirementChips: ["K9"],
      licenseLabels: ["Unarmed Security", "K9 Security"],
      armedRequirement: "Unarmed",
    });
  });

  it("maps certification requirements to backend chips and text", () => {
    expect(
      mapCertificationRequirements(["CPR / First Aid", "Taser", "AED"])
    ).toEqual({
      requirementChips: ["CPR", "AED"],
      unmappedLabels: ["Taser"],
    });
  });

  it("builds license requirement summary text", () => {
    expect(
      buildLicenseRequirementsText(["Armed Security", "Executive Protection"])
    ).toBe("License requirements: Armed Security, Executive Protection");
  });

  it("builds certification requirement summary text", () => {
    expect(buildCertificationRequirementsText(["Taser", "Baton Certification"])).toBe(
      "Certification requirements: Taser, Baton Certification"
    );
  });

  it("builds an API payload from the post shift form", () => {
    const result = buildShiftApiPayload({
      ...baseForm,
      licenseRequirements: [...baseForm.licenseRequirements],
      certificationRequirements: [...baseForm.certificationRequirements],
    });

    expect("payload" in result).toBe(true);
    if ("payload" in result) {
      expect(result.payload.title).toBe("Mall Security Officer");
      expect(result.payload.workType).toBe("Gig");
      expect(result.payload.shiftTimeType).toBe("Day Shift");
      expect(result.payload.city).toBe("Fort Myers");
      expect(result.payload.state).toBe("FL");
      expect(result.payload.requirements).toEqual(["K9", "CPR"]);
      expect(result.payload.otherRequirements).toContain(
        "License requirements: Unarmed Security, K9 Security"
      );
      expect(result.payload.otherRequirements).toContain(
        "Certification requirements: Taser"
      );
      expect(result.payload.otherRequirements).toContain(
        "Customer service experience preferred"
      );
      expect(result.payload.positionsNeeded).toBe("2");
    }
  });

  it("requires at least one license requirement", () => {
    const result = buildShiftApiPayload({
      ...baseForm,
      licenseRequirements: [],
      certificationRequirements: ["CPR / First Aid"],
    });

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Select at least one license requirement.");
    }
  });

  it("calculates estimated total pay", () => {
    expect(
      calculateEstimatedShiftTotal({
        ...baseForm,
        licenseRequirements: [...baseForm.licenseRequirements],
        certificationRequirements: [...baseForm.certificationRequirements],
      })
    ).toBe(448);
  });

  it("formats summary fields for the sticky panel", () => {
    const summary = getShiftSummaryFields({
      ...baseForm,
      licenseRequirements: [...baseForm.licenseRequirements],
      certificationRequirements: [...baseForm.certificationRequirements],
    });

    expect(summary.typeOfPost).toBe("Gig");
    expect(summary.licenseRequirements).toEqual([
      "Unarmed Security",
      "K9 Security",
    ]);
    expect(summary.certificationRequirements).toEqual([
      "CPR / First Aid",
      "Taser",
    ]);
    expect(summary.openPositions).toBe("2");
    expect(summary.visibility).toBe("Public post shift");
    expect(formatPostShiftDateTime(baseForm)).toContain("Jul");
  });

  it("labels private staff posts in the summary", () => {
    const summary = getShiftSummaryFields({
      ...baseForm,
      licenseRequirements: [...baseForm.licenseRequirements],
      certificationRequirements: [...baseForm.certificationRequirements],
      visibility: "STAFF_ONLY",
    });

    expect(summary.visibility).toBe("Private post for staff");
  });

  it("shows no requirements in summary when none selected", () => {
    const summary = getShiftSummaryFields({
      ...baseForm,
      licenseRequirements: [],
      certificationRequirements: [],
    });

    expect(summary.licenseRequirements).toEqual([]);
    expect(summary.certificationRequirements).toEqual([]);
  });

  it("parses stored shift data into post shift form values", () => {
    const startTime = new Date("2026-07-01T09:00:00");
    const endTime = new Date("2026-07-01T17:00:00");

    const form = shiftToPostShiftFormValues({
      title: "Mall Security Officer",
      description: "Monitor entrances.",
      location: "Gulf Coast Town Center | 9903 Gulf Coast Main St, 33913",
      city: "Fort Myers",
      state: "FL",
      startTime,
      endTime,
      hourlyRate: { toString: () => "28" },
      workType: "Gig",
      requirements: ["K9", "CPR"],
      otherRequirements:
        "License requirements: Unarmed Security, K9 Security; Certification requirements: Taser; Customer service preferred",
      armedRequirement: "Unarmed",
      positionsNeeded: 2,
    });

    expect(form.locationName).toBe("Gulf Coast Town Center");
    expect(form.address).toBe("9903 Gulf Coast Main St");
    expect(form.zipCode).toBe("33913");
    expect(splitShiftDateTimes(startTime, endTime)).toEqual({
      startDate: "2026-07-01",
      startTime: "09:00",
      endTime: "17:00",
    });
    expect(form.licenseRequirements).toEqual(["Unarmed Security", "K9 Security"]);
    expect(form.certificationRequirements).toEqual([
      "CPR / First Aid",
      "Taser",
    ]);
    expect(form.otherRequirements).toBe("Customer service preferred");
    expect(form.positionsNeeded).toBe(2);
  });

  it("parses location, license, and certification helpers", () => {
    expect(
      parseShiftLocationFields("Gulf Coast Town Center | 123 Main St, 33913")
    ).toEqual({
      locationName: "Gulf Coast Town Center",
      address: "123 Main St",
      zipCode: "33913",
    });

    expect(
      parseLicenseRequirementsFromShift({
        requirements: ["K9"],
        otherRequirements: "License requirements: Armed Security",
        armedRequirement: "Either",
      })
    ).toEqual(["Armed Security", "K9 Security"]);

    expect(
      parseCertificationRequirementsFromShift({
        requirements: ["CPR", "Firearms"],
        otherRequirements: "Certification requirements: Taser",
      })
    ).toEqual(["CPR / First Aid", "Firearms Qualification", "Taser"]);

    expect(
      parseFreeformOtherRequirements(
        "License requirements: Armed Security; Customer service preferred"
      )
    ).toBe("Customer service preferred");
  });

  it("builds an update payload with shift id and reporting instructions", () => {
    const result = buildShiftUpdatePayload(
      {
        ...baseForm,
        licenseRequirements: [...baseForm.licenseRequirements],
        certificationRequirements: [...baseForm.certificationRequirements],
      },
      {
        shiftId: "shift-123",
        reportingInstructions: "Check in at the front desk.",
      }
    );

    expect("payload" in result).toBe(true);
    if ("payload" in result) {
      expect(result.payload.shiftId).toBe("shift-123");
      expect(result.payload.reportingInstructions).toBe(
        "Check in at the front desk."
      );
      expect(result.payload.title).toBe("Mall Security Officer");
    }
  });
});
