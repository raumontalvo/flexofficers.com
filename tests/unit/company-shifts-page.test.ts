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
      status: ShiftStatus.PARTIALLY_FILLED,
      positionsNeeded: 3,
      filledCount: 1,
      applicantCount: 2,
      isRecurring: false,
    });
  });

  it("resolves display status when positions are reduced below stored status", () => {
    expect(
      serializeCompanyShiftRow({
        ...baseShift,
        status: ShiftStatus.PARTIALLY_FILLED,
        positionsNeeded: 1,
        applications: [{ status: ApplicationStatus.ACCEPTED }],
      }).status
    ).toBe(ShiftStatus.FILLED);
  });

  it("marks recurring shifts during serialization", () => {
    expect(
      serializeCompanyShiftRow({
        ...baseShift,
        recurringScheduleId: "schedule-1",
      }).isRecurring
    ).toBe(true);
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
        applications: [
          { status: ApplicationStatus.ACCEPTED },
          { status: ApplicationStatus.ACCEPTED },
          { status: ApplicationStatus.ACCEPTED },
        ],
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
      completed: 0,
      cancelled: 1,
    });
  });

  function completedAttendance(offsetMinutes: number) {
    return {
      status: ApplicationStatus.ACCEPTED,
      clockInAt: new Date("2026-07-01T09:00:00.000Z"),
      clockOutAt: new Date(
        `2026-07-01T17:${String(offsetMinutes).padStart(2, "0")}:00.000Z`
      ),
    };
  }

  it("marks a shift completed once every accepted officer has clocked out", () => {
    const row = serializeCompanyShiftRow({
      ...baseShift,
      id: "shift-completed",
      status: ShiftStatus.FILLED,
      positionsNeeded: 2,
      applications: [
        completedAttendance(5),
        completedAttendance(10),
        { status: ApplicationStatus.PENDING },
      ],
    });

    expect(row.status).toBe(ShiftStatus.COMPLETED);
  });

  it("keeps a shift filled while any accepted officer has not clocked out", () => {
    const row = serializeCompanyShiftRow({
      ...baseShift,
      id: "shift-partial-clockout",
      status: ShiftStatus.FILLED,
      positionsNeeded: 2,
      applications: [
        completedAttendance(5),
        {
          status: ApplicationStatus.ACCEPTED,
          clockInAt: new Date("2026-07-01T09:00:00.000Z"),
          clockOutAt: null,
        },
      ],
    });

    expect(row.status).toBe(ShiftStatus.FILLED);
  });

  it("only completes a 4-officer shift when all four accepted officers clock out", () => {
    function buildFourOfficerShift(completedCount: number) {
      const applications = Array.from({ length: 4 }, (_, index) =>
        index < completedCount
          ? completedAttendance(10 + index)
          : {
              status: ApplicationStatus.ACCEPTED,
              clockInAt: new Date("2026-07-01T09:00:00.000Z"),
              clockOutAt: null,
            }
      );

      return serializeCompanyShiftRow({
        ...baseShift,
        id: `four-officer-${completedCount}`,
        status: ShiftStatus.FILLED,
        positionsNeeded: 4,
        applications,
      });
    }

    expect(buildFourOfficerShift(1).status).toBe(ShiftStatus.FILLED);
    expect(buildFourOfficerShift(3).status).toBe(ShiftStatus.FILLED);
    expect(buildFourOfficerShift(4).status).toBe(ShiftStatus.COMPLETED);
  });

  it("does not complete a shift when an officer clocked out without clocking in", () => {
    const row = serializeCompanyShiftRow({
      ...baseShift,
      id: "shift-clockout-only",
      status: ShiftStatus.FILLED,
      positionsNeeded: 1,
      applications: [
        {
          status: ApplicationStatus.ACCEPTED,
          clockInAt: null,
          clockOutAt: new Date("2026-07-01T17:05:00.000Z"),
        },
      ],
    });

    expect(row.status).toBe(ShiftStatus.FILLED);
  });

  it("does not mark cancelled shifts as completed even after clock-out", () => {
    const row = serializeCompanyShiftRow({
      ...baseShift,
      id: "shift-cancelled-clockout",
      status: ShiftStatus.CANCELLED,
      applications: [completedAttendance(5)],
    });

    expect(row.status).toBe(ShiftStatus.CANCELLED);
  });

  it("separates completed shifts from the filled tab", () => {
    const rows = [
      serializeCompanyShiftRow({
        ...baseShift,
        id: "filled-shift",
        status: ShiftStatus.FILLED,
        positionsNeeded: 1,
        applications: [{ status: ApplicationStatus.ACCEPTED }],
      }),
      serializeCompanyShiftRow({
        ...baseShift,
        id: "completed-shift",
        status: ShiftStatus.FILLED,
        positionsNeeded: 1,
        applications: [completedAttendance(5)],
      }),
    ];

    expect(filterCompanyShiftsByTab(rows, "filled")).toHaveLength(1);
    expect(filterCompanyShiftsByTab(rows, "filled")[0].id).toBe("filled-shift");
    expect(filterCompanyShiftsByTab(rows, "completed")).toHaveLength(1);
    expect(filterCompanyShiftsByTab(rows, "completed")[0].id).toBe(
      "completed-shift"
    );
    expect(filterCompanyShiftsByTab(rows, "all")).toHaveLength(2);
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
