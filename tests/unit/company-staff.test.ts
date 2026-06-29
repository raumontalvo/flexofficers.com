import { describe, expect, it } from "vitest";
import { ShiftStatus, ShiftVisibility } from "@/app/generated/prisma/enums";
import {
  buildOfficerBrowseShiftsWhere,
  getShiftVisibilityLabel,
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
});
