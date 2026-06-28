import { describe, expect, it } from "vitest";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import {
  filterSerializedShiftsByTab,
  getApplicationDisplayStatus,
  getCompanyApplicationStats,
  getCompanyShiftStats,
  getFilledShiftsThisMonth,
  getUpcomingConfirmedShifts,
  isPastShift,
} from "@/lib/company-dashboard-data";

const now = new Date("2026-06-25T12:00:00.000Z");

const baseShift = {
  id: "shift-1",
  title: "Night Patrol",
  location: "123 Main St",
  city: "Miami",
  state: "FL",
  startTime: new Date("2026-07-01T08:00:00.000Z"),
  endTime: new Date("2026-07-01T16:00:00.000Z"),
  status: ShiftStatus.OPEN,
  positionsNeeded: 2,
  applications: [{ status: ApplicationStatus.PENDING }],
};

describe("company dashboard data helpers", () => {
  it("summarizes shift counts", () => {
    const stats = getCompanyShiftStats(
      [
        baseShift,
        {
          ...baseShift,
          id: "shift-2",
          status: ShiftStatus.FILLED,
        },
        {
          ...baseShift,
          id: "shift-3",
          status: ShiftStatus.COMPLETED,
        },
      ],
      now
    );

    expect(stats).toEqual({
      total: 3,
      open: 1,
      filled: 1,
      past: 1,
    });
  });

  it("identifies past shifts", () => {
    expect(
      isPastShift(
        {
          status: ShiftStatus.COMPLETED,
          endTime: new Date("2026-06-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe(true);

    expect(
      isPastShift(
        {
          status: ShiftStatus.OPEN,
          endTime: new Date("2026-06-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe(true);
  });

  it("summarizes application counts", () => {
    expect(
      getCompanyApplicationStats([
        { status: ApplicationStatus.PENDING },
        { status: ApplicationStatus.ACCEPTED },
        { status: ApplicationStatus.REJECTED },
        { status: ApplicationStatus.WITHDRAWN },
      ])
    ).toEqual({
      total: 4,
      new: 1,
      reviewed: 2,
      withdrawn: 1,
      accepted: 1,
      rejected: 1,
    });
  });

  it("counts filled shifts in the current month", () => {
    expect(
      getFilledShiftsThisMonth(
        [
          {
            ...baseShift,
            status: ShiftStatus.FILLED,
            startTime: new Date("2026-06-10T08:00:00.000Z"),
          },
        ],
        now
      )
    ).toBe(1);
  });

  it("finds upcoming confirmed shifts within 7 days", () => {
    const upcoming = getUpcomingConfirmedShifts(
      [
        {
          ...baseShift,
          startTime: new Date("2026-06-27T08:00:00.000Z"),
          applications: [{ status: ApplicationStatus.ACCEPTED }],
        },
      ],
      now,
      7
    );

    expect(upcoming).toHaveLength(1);
    expect(upcoming[0]?.title).toBe("Night Patrol");
  });

  it("maps application display statuses", () => {
    expect(getApplicationDisplayStatus(ApplicationStatus.PENDING)).toBe("NEW");
    expect(getApplicationDisplayStatus(ApplicationStatus.ACCEPTED)).toBe(
      "ACCEPTED"
    );
  });

  it("filters serialized shifts by tab", () => {
    const shifts = [
      {
        id: "1",
        title: "Open",
        startTime: baseShift.startTime.toISOString(),
        endTime: baseShift.endTime.toISOString(),
        city: "Miami",
        state: "FL",
        location: "123 Main",
        status: ShiftStatus.OPEN,
        applicantCount: 1,
        openPositions: 1,
      },
      {
        id: "2",
        title: "Cancelled",
        startTime: baseShift.startTime.toISOString(),
        endTime: baseShift.endTime.toISOString(),
        city: "Miami",
        state: "FL",
        location: "123 Main",
        status: ShiftStatus.CANCELLED,
        applicantCount: 0,
        openPositions: 2,
      },
    ];

    expect(filterSerializedShiftsByTab(shifts, "open", now)).toHaveLength(1);
    expect(filterSerializedShiftsByTab(shifts, "cancelled", now)).toHaveLength(1);
  });
});
