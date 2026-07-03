import { describe, expect, it } from "vitest";
import type { OfficerAcceptedShiftData } from "@/lib/officer-accepted-shift-data";
import {
  buildUpcomingShiftSummary,
  filterUpcomingShifts,
  formatStartsInLabel,
  getDaysUntilStart,
  getUpcomingUrgencyTone,
  isUpcomingFutureShift,
  sortUpcomingShifts,
} from "@/lib/officer-upcoming-shift-data";

function createShift(
  overrides: Partial<OfficerAcceptedShiftData["shift"]> = {}
): OfficerAcceptedShiftData {
  return {
    id: "app-1",
    attendance: {
      clockInAt: null,
      clockOutAt: null,
      clockInLatitude: null,
      clockInLongitude: null,
      clockOutLatitude: null,
      clockOutLongitude: null,
    },
    shift: {
      id: "shift-1",
      title: "Warehouse Security",
      hourlyRate: "20",
      location: "Tampa, FL",
      city: "Tampa",
      state: "FL",
      startTime: "2099-06-11T18:00:00.000Z",
      endTime: "2099-06-12T02:00:00.000Z",
      shiftTimeType: "NIGHT_SHIFT",
      requirements: ["CPR"],
      otherRequirements: null,
      specialRequirements: "",
      status: "OPEN",
      reportingInstructions: null,
      ...overrides,
    },
    company: {
      companyName: "SecurePro",
      contactName: "Alex",
      phone: "555-0100",
      email: "alex@example.com",
    },
  };
}

describe("officer upcoming shift data helpers", () => {
  it("detects future upcoming shifts and urgency labels", () => {
    const now = new Date("2099-06-11T12:00:00.000Z");
    const shift = createShift({
      startTime: "2099-06-11T18:00:00.000Z",
      endTime: "2099-06-12T02:00:00.000Z",
    });

    expect(isUpcomingFutureShift(shift, now)).toBe(true);
    expect(getDaysUntilStart(shift.shift.startTime, now)).toBe(0);
    expect(formatStartsInLabel(0)).toBe("Starts today");
    expect(getUpcomingUrgencyTone(2)).toBe("urgent");
    expect(getUpcomingUrgencyTone(5)).toBe("soon");
    expect(getUpcomingUrgencyTone(8)).toBe("relaxed");
  });

  it("filters, sorts, and summarizes upcoming shifts", () => {
    const now = new Date("2099-06-01T12:00:00.000Z");
    const soon = createShift({
      id: "shift-soon",
      startTime: "2099-06-03T18:00:00.000Z",
      endTime: "2099-06-04T02:00:00.000Z",
    });
    const later = createShift({
      id: "shift-later",
      startTime: "2099-06-20T18:00:00.000Z",
      endTime: "2099-06-21T02:00:00.000Z",
    });
    const pastStart = createShift({
      id: "shift-past",
      startTime: "2099-06-01T06:00:00.000Z",
      endTime: "2099-06-01T14:00:00.000Z",
    });
    const ended = createShift({
      id: "shift-ended",
      startTime: "2099-05-20T18:00:00.000Z",
      endTime: "2099-05-25T02:00:00.000Z",
    });

    const upcoming = [soon, later, pastStart, ended].filter((application) =>
      isUpcomingFutureShift(application, now)
    );

    expect(upcoming).toHaveLength(3);
    expect(filterUpcomingShifts([soon, later, pastStart, ended], "next7", now)).toHaveLength(2);
    expect(sortUpcomingShifts([later, soon], "soonest")[0].shift.id).toBe(
      "shift-soon"
    );

    const summary = buildUpcomingShiftSummary([soon, later, pastStart, ended], now);
    expect(summary.count).toBe(3);
    expect(summary.expectedEarnings).toBe(480);
    expect(summary.scheduledHours).toBe(24);
    expect(summary.nextShiftStartsIn).toBe("Starts today");
  });
});
