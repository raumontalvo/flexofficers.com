import { describe, expect, it } from "vitest";
import type { ShiftCardData } from "@/lib/shift-card-data";
import {
  clearPrimaryShiftFilters,
  emptyShiftBrowseFilters,
  filterBrowseShifts,
  formatOpenShiftCount,
  formatPaginationRange,
  hasActiveShiftFilters,
  sortBrowseShifts,
} from "@/lib/shift-browse-filters";

const sampleShift: ShiftCardData = {
  id: "shift-1",
  title: "Casino Security Gig",
  hourlyRate: "22",
  companyName: "Elite Protection",
  location: "Miami, FL",
  city: "Miami",
  state: "FL",
  startTime: "2026-06-09T14:00:00.000Z",
  endTime: "2026-06-09T21:00:00.000Z",
  createdAt: "2026-06-01T10:00:00.000Z",
  positionsNeeded: 2,
  filledCount: 0,
  workType: "GIG",
  shiftTimeType: "DAY_SHIFT",
  armedRequirement: "ARMED",
  requirements: ["D License", "Armed"],
  specialRequirements: "D License, Armed",
  status: "OPEN",
};

const laterShift: ShiftCardData = {
  ...sampleShift,
  id: "shift-2",
  title: "Warehouse Patrol",
  hourlyRate: "28",
  startTime: "2026-06-08T14:00:00.000Z",
  createdAt: "2026-06-02T10:00:00.000Z",
};

describe("shift browse filters", () => {
  it("detects active filters", () => {
    expect(hasActiveShiftFilters({ ...emptyShiftBrowseFilters, city: "Miami" })).toBe(
      true
    );
    expect(hasActiveShiftFilters(emptyShiftBrowseFilters)).toBe(false);
  });

  it("clears primary filters but keeps more filters", () => {
    expect(
      clearPrimaryShiftFilters({
        ...emptyShiftBrowseFilters,
        city: "Miami",
        state: "FL",
        workType: "Gig",
        minHourlyRate: "25",
        armed: true,
        dayShift: true,
      })
    ).toEqual({
      ...emptyShiftBrowseFilters,
      armed: true,
      dayShift: true,
    });
  });

  it("formats open shift counts and pagination", () => {
    expect(formatOpenShiftCount(0)).toBe("0 Open Shifts");
    expect(formatOpenShiftCount(1)).toBe("1 Open Shift");
    expect(formatOpenShiftCount(27)).toBe("27 Open Shifts");
    expect(formatPaginationRange(1, 12, 27)).toBe("Showing 1–12 of 27 open shifts");
  });

  it("filters by city, state, and minimum pay", () => {
    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        city: "Miami",
      })
    ).toHaveLength(1);

    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        state: "FL",
      })
    ).toHaveLength(1);

    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        state: "CA",
      })
    ).toHaveLength(0);

    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        minHourlyRate: "25",
      })
    ).toHaveLength(0);

    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        minHourlyRate: "20",
      })
    ).toHaveLength(1);
  });

  it("filters by structured work type and armed status", () => {
    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        workType: "Gig",
      })
    ).toHaveLength(1);

    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        armed: true,
      })
    ).toHaveLength(1);

    expect(
      filterBrowseShifts([sampleShift], {
        ...emptyShiftBrowseFilters,
        unarmed: true,
      })
    ).toHaveLength(0);
  });

  it("sorts by highest pay and earliest start", () => {
    expect(
      sortBrowseShifts([sampleShift, laterShift], "highest-pay")[0].id
    ).toBe("shift-2");

    expect(
      sortBrowseShifts([sampleShift, laterShift], "earliest-start")[0].id
    ).toBe("shift-2");
  });
});
