import { describe, expect, it } from "vitest";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import {
  filterCompanyShiftsByTab,
  formatShiftDateBadgeParts,
  formatShiftDurationLabel,
  getCompanyShiftsTabCounts,
  getFillProgressVariant,
  getShiftLocationParts,
  paginateCompanyShifts,
  searchCompanyShifts,
  serializeCompanyShiftRow,
} from "@/lib/company-shifts-page";

const baseShift = {
  id: "shift-1",
  title: "Mall Security Officer",
  location: "Gulf Coast Town Center | 9903 Gulf Coast Main St, 33913",
  city: "Fort Myers",
  state: "FL",
  startTime: new Date("2026-07-01T09:00:00.000Z"),
  endTime: new Date("2026-07-01T17:00:00.000Z"),
  hourlyRate: { toString: () => "20" },
  status: ShiftStatus.OPEN,
  positionsNeeded: 3,
  applications: [
    { status: ApplicationStatus.PENDING },
    { status: ApplicationStatus.ACCEPTED },
  ],
};

describe("company shifts page helpers", () => {
  it("serializes shift rows with filled and applicant counts", () => {
    expect(serializeCompanyShiftRow(baseShift)).toEqual({
      id: "shift-1",
      title: "Mall Security Officer",
      location: baseShift.location,
      locationLabel: "Gulf Coast Town Center",
      locationSubtext: "Fort Myers, FL",
      city: "Fort Myers",
      state: "FL",
      startTime: baseShift.startTime.toISOString(),
      endTime: baseShift.endTime.toISOString(),
      hourlyRate: "20",
      status: ShiftStatus.OPEN,
      positionsNeeded: 3,
      filledCount: 1,
      applicantCount: 2,
    });
  });

  it("builds location labels from city/state when no pipe separator exists", () => {
    expect(
      getShiftLocationParts({
        location: "123 Main St",
        city: "Miami",
        state: "FL",
      })
    ).toEqual({
      locationLabel: "Miami, FL",
      locationSubtext: "",
    });
  });

  it("counts shifts by tab", () => {
    const rows = [
      serializeCompanyShiftRow(baseShift),
      serializeCompanyShiftRow({
        ...baseShift,
        id: "shift-2",
        status: ShiftStatus.FILLED,
      }),
      serializeCompanyShiftRow({
        ...baseShift,
        id: "shift-3",
        status: ShiftStatus.CANCELLED,
      }),
    ];

    expect(getCompanyShiftsTabCounts(rows)).toEqual({
      all: 3,
      open: 1,
      filled: 1,
      cancelled: 1,
    });
  });

  it("filters and searches shifts", () => {
    const rows = [
      serializeCompanyShiftRow(baseShift),
      serializeCompanyShiftRow({
        ...baseShift,
        id: "shift-2",
        title: "Event Security",
        city: "Tampa",
        state: "FL",
      }),
    ];

    expect(filterCompanyShiftsByTab(rows, "open")).toHaveLength(2);
    expect(searchCompanyShifts(rows, "event")).toHaveLength(1);
  });

  it("paginates shift rows", () => {
    const items = Array.from({ length: 8 }, (_, index) => `item-${index + 1}`);

    expect(paginateCompanyShifts(items, 1, 7)).toEqual({
      items: items.slice(0, 7),
      page: 1,
      pageSize: 7,
      totalItems: 8,
      totalPages: 2,
      startIndex: 1,
      endIndex: 7,
    });
  });

  it("formats shift duration labels", () => {
    expect(
      formatShiftDurationLabel(
        new Date("2026-07-01T09:00:00.000Z"),
        new Date("2026-07-01T17:00:00.000Z")
      )
    ).toBe("(8h)");
  });

  it("derives fill progress variants", () => {
    expect(getFillProgressVariant(0, 3)).toBe("empty");
    expect(getFillProgressVariant(1, 3)).toBe("partial");
    expect(getFillProgressVariant(3, 3)).toBe("full");
  });

  it("formats shift date badge parts", () => {
    expect(
      formatShiftDateBadgeParts(new Date("2026-06-30T08:00:00.000Z"))
    ).toEqual({
      weekday: "TUE",
      month: "JUN",
      day: "30",
    });
  });
});
