import { describe, expect, it } from "vitest";
import { ShiftStatus, ShiftVisibility } from "@/app/generated/prisma/enums";
import {
  buildOfficerBrowseShiftsWhere,
  getShiftVisibilityLabel,
  searchCompanyStaff,
} from "@/lib/company-staff";

describe("company staff helpers", () => {
  it("limits officer browse to public open shifts", () => {
    expect(buildOfficerBrowseShiftsWhere(null)).toEqual({
      status: ShiftStatus.OPEN,
      visibility: ShiftVisibility.PUBLIC,
    });

    expect(buildOfficerBrowseShiftsWhere("officer-1")).toEqual({
      status: ShiftStatus.OPEN,
      visibility: ShiftVisibility.PUBLIC,
    });
  });

  it("labels shift visibility for companies", () => {
    expect(getShiftVisibilityLabel(ShiftVisibility.PUBLIC)).toBe("Public post");
    expect(getShiftVisibilityLabel(ShiftVisibility.STAFF_ONLY)).toBe(
      "Private — Staff only"
    );
  });

  it("searches staff roster by officer name", () => {
    const staff = [
      {
        id: "staff-1",
        officerId: "officer-1",
        addedAt: "2026-01-01T00:00:00.000Z",
        officer: {
          id: "officer-1",
          firstName: "Maria",
          lastName: "Lopez",
          fullName: "Maria Lopez",
          profilePhotoUrl: null,
          city: "Tampa",
          state: "FL",
          cityStateLabel: "Tampa, FL",
          armedStatusLabel: "Armed",
          statusBadgeLabel: "Armed",
          armedStatuses: [],
          experienceYears: 3,
          experienceYearsLabel: "3 years",
          backgroundCategories: [],
          experienceCategories: [],
          licenseTypeLabels: [],
          certifications: [],
          availabilityLabels: [],
          introduction: null,
          email: null,
          phone: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          licenses: [],
        },
      },
      {
        id: "staff-2",
        officerId: "officer-2",
        addedAt: "2026-01-02T00:00:00.000Z",
        officer: {
          id: "officer-2",
          firstName: "James",
          lastName: "Carter",
          fullName: "James Carter",
          profilePhotoUrl: null,
          city: "Orlando",
          state: "FL",
          cityStateLabel: "Orlando, FL",
          armedStatusLabel: "Unarmed",
          statusBadgeLabel: "Unarmed",
          armedStatuses: [],
          experienceYears: 1,
          experienceYearsLabel: "1 years",
          backgroundCategories: [],
          experienceCategories: [],
          licenseTypeLabels: [],
          certifications: [],
          availabilityLabels: [],
          introduction: null,
          email: null,
          phone: null,
          createdAt: "2026-01-02T00:00:00.000Z",
          licenses: [],
        },
      },
    ] as const;

    expect(searchCompanyStaff([...staff], "maria")).toHaveLength(1);
    expect(searchCompanyStaff([...staff], "carter").map((member) => member.officerId)).toEqual([
      "officer-2",
    ]);
    expect(searchCompanyStaff([...staff], "")).toHaveLength(2);
  });
});
