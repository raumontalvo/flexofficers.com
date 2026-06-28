import { describe, expect, it } from "vitest";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import {
  filterCompanyApplicantsByShift,
  filterCompanyApplicantsByTab,
  getCompanyApplicantsTabCounts,
  getShiftApplicantOverview,
  searchCompanyApplicants,
  serializeCompanyApplicant,
} from "@/lib/company-applications-page";

const baseApplication = {
  id: "app-1",
  status: ApplicationStatus.PENDING,
  appliedAt: new Date("2026-07-01T14:30:00.000Z"),
  shift: {
    id: "shift-1",
    title: "Mall Security Officer",
    location: "Gulf Coast Town Center | 9903 Gulf Coast Main St, 33913",
    city: "Fort Myers",
    state: "FL",
    startTime: new Date("2026-07-10T09:00:00.000Z"),
    endTime: new Date("2026-07-10T17:00:00.000Z"),
    status: ShiftStatus.OPEN,
    hourlyRate: { toString: () => "20" },
    positionsNeeded: 2,
    workType: "GIG" as const,
    requirements: ["K9", "CPR"],
    otherRequirements:
      "License requirements: Unarmed Security; Certification requirements: Taser; Customer service preferred",
    armedRequirement: "UNARMED" as const,
  },
  officer: {
    firstName: "Alex",
    lastName: "Rivera",
    profilePhotoUrl: null,
    city: "Fort Myers",
    state: "FL",
    phone: "239-555-0100",
    armedStatuses: ["UNARMED"],
    experienceYears: 3,
    certifications: ["CPR / First Aid"],
    experienceCategories: ["Retail Security"],
    introduction: "Experienced officer.",
    availability: ["Weekdays", "Day Shift"],
    user: {
      email: "alex@example.com",
    },
    licenses: [
      {
        id: "license-1",
        licenseType: "D License",
        licenseNumber: "D1234567",
        issuingState: "FL",
        expirationDate: new Date("2027-01-01T00:00:00.000Z"),
      },
    ],
  },
};

describe("company applications page helpers", () => {
  it("serializes applicant rows with officer and shift details", () => {
    const serialized = serializeCompanyApplicant(baseApplication);

    expect(serialized.officerName).toBe("Alex Rivera");
    expect(serialized.licenseNumbers).toEqual(["D1234567"]);
    expect(serialized.phone).toBe("239-555-0100");
    expect(serialized.shiftTitle).toBe("Mall Security Officer");
    expect(serialized.shiftLocationLabel).toBe("Gulf Coast Town Center");
    expect(serialized.appliedDateLabel).toContain("2026");
    expect(serialized.officerProfile.email).toBe("alex@example.com");
    expect(serialized.officerProfile.availability).toEqual([
      "Weekdays",
      "Day Shift",
    ]);
    expect(serialized.appliedShift.workTypeLabel).toBe("Gig");
    expect(serialized.appliedShift.requiredLicenses).toEqual([
      "Unarmed Security",
      "K9 Security",
    ]);
    expect(serialized.appliedShift.requiredCertifications).toEqual([
      "CPR / First Aid",
      "Taser",
    ]);
    expect(serialized.appliedShift.otherRequirements).toBe(
      "Customer service preferred"
    );
  });

  it("counts applicants by tab", () => {
    const rows = [
      serializeCompanyApplicant(baseApplication),
      serializeCompanyApplicant({
        ...baseApplication,
        id: "app-2",
        status: ApplicationStatus.ACCEPTED,
      }),
      serializeCompanyApplicant({
        ...baseApplication,
        id: "app-3",
        status: ApplicationStatus.REJECTED,
      }),
    ];

    expect(getCompanyApplicantsTabCounts(rows)).toEqual({
      all: 3,
      pending: 1,
      accepted: 1,
      rejected: 1,
    });
  });

  it("filters and searches applicants", () => {
    const rows = [
      serializeCompanyApplicant(baseApplication),
      serializeCompanyApplicant({
        ...baseApplication,
        id: "app-2",
        officer: {
          ...baseApplication.officer,
          firstName: "Maria",
          lastName: "Santos",
        },
      }),
    ];

    expect(filterCompanyApplicantsByTab(rows, "pending")).toHaveLength(2);
    expect(searchCompanyApplicants(rows, "maria")).toHaveLength(1);
    expect(filterCompanyApplicantsByShift(rows, "shift-1")).toHaveLength(2);
  });

  it("summarizes applicants for a shift", () => {
    const rows = [
      serializeCompanyApplicant(baseApplication),
      serializeCompanyApplicant({
        ...baseApplication,
        id: "app-2",
        status: ApplicationStatus.ACCEPTED,
      }),
      serializeCompanyApplicant({
        ...baseApplication,
        id: "app-3",
        status: ApplicationStatus.REJECTED,
        shift: {
          ...baseApplication.shift,
          id: "shift-2",
        },
      }),
    ];

    expect(getShiftApplicantOverview(rows, "shift-1")).toEqual({
      total: 2,
      pending: 1,
      accepted: 1,
      rejected: 0,
    });
  });
});
