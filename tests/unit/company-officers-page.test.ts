import { describe, expect, it } from "vitest";
import {
  getOfficerBackgroundCategories,
  getOfficerLicenseChipDisplay,
  getOfficerLicenseChipTone,
  getOfficerStatusBadge,
  mapAvailabilityFilterToStoredValue,
  mapStoredAvailabilityToDisplayLabel,
  serializeOfficerSearchResult,
  sortOfficerSearchResults,
} from "@/lib/company-officers-page";

const baseOfficer = {
  id: "officer-1",
  firstName: "Raul",
  lastName: "Martinez",
  profilePhotoUrl: null,
  city: "Fort Myers",
  state: "FL",
  armedStatuses: ["UNARMED"],
  experienceYears: 5,
  certifications: ["CPR / First Aid"],
  availability: ["Weekdays", "Day Shift"],
  experienceCategories: ["Military", "Retail Security"],
  introduction: "Dedicated officer.",
  phone: "239-555-0100",
  createdAt: new Date("2026-01-15T00:00:00.000Z"),
  licenses: [
    {
      id: "license-1",
      licenseType: "Armed Security",
      licenseNumber: "D1234567",
      issuingState: "FL",
      expirationDate: new Date("2027-01-01T00:00:00.000Z"),
    },
  ],
  user: {
    email: "raul@example.com",
  },
};

describe("company officers page helpers", () => {
  it("serializes officer search results", () => {
    const serialized = serializeOfficerSearchResult(baseOfficer);

    expect(serialized.fullName).toBe("Raul Martinez");
    expect(serialized.cityStateLabel).toBe("Fort Myers, FL");
    expect(serialized.backgroundCategories).toEqual(["Military"]);
    expect(serialized.licenseTypeLabels).toEqual(["Armed Security"]);
    expect(serialized.statusBadgeLabel).toBe("Armed Security");
    expect(serialized.availabilityLabels).toEqual(["Weekdays", "Days"]);
    expect(serialized.email).toBe("raul@example.com");
  });

  it("maps availability labels between UI and stored values", () => {
    expect(mapAvailabilityFilterToStoredValue("Days")).toBe("Day Shift");
    expect(mapStoredAvailabilityToDisplayLabel("Night Shift")).toBe("Nights");
  });

  it("extracts background categories from experience", () => {
    expect(
      getOfficerBackgroundCategories([
        "Military",
        "Retail Security",
        "K9 Security",
      ])
    ).toEqual(["Military", "K9 Security"]);
  });

  it("derives status badge from licenses or armed status", () => {
    expect(
      getOfficerStatusBadge({
        licenseTypeLabels: ["Class D Security"],
        armedStatuses: ["ARMED"],
      })
    ).toBe("Class D Security");

    expect(
      getOfficerStatusBadge({
        licenseTypeLabels: [],
        armedStatuses: ["ARMED", "UNARMED"],
      })
    ).toBe("Armed & Unarmed Security");

    expect(
      getOfficerStatusBadge({
        licenseTypeLabels: [],
        armedStatuses: ["UNARMED"],
      })
    ).toBe("Unarmed Security");
  });

  it("builds license chip display with overflow", () => {
    expect(getOfficerLicenseChipDisplay([])).toEqual({
      chips: [],
      overflowCount: 0,
    });

    expect(
      getOfficerLicenseChipDisplay(["Unarmed Security", "Armed Security"])
    ).toEqual({
      chips: ["Unarmed Security", "Armed Security"],
      overflowCount: 0,
    });

    expect(
      getOfficerLicenseChipDisplay([
        "Unarmed Security",
        "Armed Security",
        "K9 Security",
        "Executive Protection",
        "Security Guard",
      ])
    ).toEqual({
      chips: ["Unarmed Security", "Armed Security"],
      overflowCount: 3,
    });
  });

  it("assigns license chip tones", () => {
    expect(getOfficerLicenseChipTone("Unarmed Security")).toBe("blue");
    expect(getOfficerLicenseChipTone("Armed Security")).toBe("green");
    expect(getOfficerLicenseChipTone("K9 Security")).toBe("neutral");
  });

  it("sorts officers by experience and alphabetically", () => {
    const officers = [
      serializeOfficerSearchResult({
        ...baseOfficer,
        id: "a",
        firstName: "Zoe",
        lastName: "Adams",
        experienceYears: 2,
      }),
      serializeOfficerSearchResult({
        ...baseOfficer,
        id: "b",
        firstName: "Amy",
        lastName: "Brown",
        experienceYears: 8,
      }),
    ];

    expect(
      sortOfficerSearchResults(officers, "experience").map(
        (officer) => officer.fullName
      )
    ).toEqual(["Amy Brown", "Zoe Adams"]);
  });
});
