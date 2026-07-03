import { describe, expect, it } from "vitest";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  canClockIn,
  canClockOut,
  formatGoogleMapsUrl,
  getAttendanceStatus,
  getAttendanceStatusLabel,
  isClockInTooEarly,
} from "@/lib/attendance";

function createClockableApplication(
  overrides: {
    clockInAt?: Date | null;
    clockOutAt?: Date | null;
    startTime?: Date;
    endTime?: Date;
    status?: ApplicationStatus;
    shiftStatus?: ShiftStatus;
  } = {}
) {
  const startTime = overrides.startTime ?? new Date("2099-06-11T18:00:00.000Z");
  const endTime = overrides.endTime ?? new Date("2099-06-12T02:00:00.000Z");

  return {
    clockInAt: overrides.clockInAt ?? null,
    clockOutAt: overrides.clockOutAt ?? null,
    status: overrides.status ?? ApplicationStatus.ACCEPTED,
    shift: {
      status: overrides.shiftStatus ?? ShiftStatus.OPEN,
      startTime,
      endTime,
      location: "Tampa, FL",
    },
  };
}

describe("attendance helpers", () => {
  it("derives attendance status from clock timestamps", () => {
    expect(getAttendanceStatus({ clockInAt: null, clockOutAt: null })).toBe(
      "NOT_STARTED"
    );
    expect(
      getAttendanceStatus({
        clockInAt: new Date("2099-06-11T18:05:00.000Z"),
        clockOutAt: null,
      })
    ).toBe("CLOCKED_IN");
    expect(
      getAttendanceStatus({
        clockInAt: new Date("2099-06-11T18:05:00.000Z"),
        clockOutAt: new Date("2099-06-12T02:00:00.000Z"),
      })
    ).toBe("COMPLETED");
  });

  it("labels attendance status for company display", () => {
    expect(getAttendanceStatusLabel("NOT_STARTED")).toBe("Not Started");
    expect(getAttendanceStatusLabel("CLOCKED_IN")).toBe("Clocked In");
    expect(getAttendanceStatusLabel("COMPLETED")).toBe("Completed");
  });

  it("blocks clock in more than one hour before shift start", () => {
    const now = new Date("2099-06-11T16:30:00.000Z");
    const application = createClockableApplication({
      startTime: new Date("2099-06-11T18:00:00.000Z"),
    });

    expect(isClockInTooEarly(application.shift.startTime, now)).toBe(true);
    expect(canClockIn(application, now)).toBe(false);
  });

  it("allows clock in within one hour of shift start", () => {
    const now = new Date("2099-06-11T17:30:00.000Z");
    const application = createClockableApplication({
      startTime: new Date("2099-06-11T18:00:00.000Z"),
    });

    expect(isClockInTooEarly(application.shift.startTime, now)).toBe(false);
    expect(canClockIn(application, now)).toBe(true);
  });

  it("prevents duplicate clock in and clock out", () => {
    const now = new Date("2099-06-11T17:30:00.000Z");
    const clockedIn = createClockableApplication({
      clockInAt: new Date("2099-06-11T17:45:00.000Z"),
    });
    const completed = createClockableApplication({
      clockInAt: new Date("2099-06-11T17:45:00.000Z"),
      clockOutAt: new Date("2099-06-12T02:00:00.000Z"),
    });

    expect(canClockIn(clockedIn, now)).toBe(false);
    expect(canClockOut(clockedIn)).toBe(true);
    expect(canClockOut(completed)).toBe(false);
  });

  it("keeps clock in open after shift start until the officer clocks in", () => {
    const now = new Date("2099-06-11T18:30:00.000Z");
    const application = createClockableApplication({
      startTime: new Date("2099-06-11T18:00:00.000Z"),
      endTime: new Date("2099-06-12T02:00:00.000Z"),
    });

    expect(isClockInTooEarly(application.shift.startTime, now)).toBe(false);
    expect(canClockIn(application, now)).toBe(true);
  });

  it("blocks clock in for cancelled or completed shifts", () => {
    const now = new Date("2099-06-11T17:30:00.000Z");
    const cancelled = createClockableApplication({
      startTime: new Date("2099-06-11T18:00:00.000Z"),
      shiftStatus: ShiftStatus.CANCELLED,
    });
    const completed = createClockableApplication({
      startTime: new Date("2099-06-11T18:00:00.000Z"),
      shiftStatus: ShiftStatus.COMPLETED,
    });

    expect(canClockIn(cancelled, now)).toBe(false);
    expect(canClockIn(completed, now)).toBe(false);
  });

  it("allows clock out after shift end when still clocked in", () => {
    const now = new Date("2099-06-12T03:00:00.000Z");
    const application = createClockableApplication({
      clockInAt: new Date("2099-06-11T18:00:00.000Z"),
      startTime: new Date("2099-06-11T18:00:00.000Z"),
      endTime: new Date("2099-06-12T02:00:00.000Z"),
    });

    expect(canClockIn(application, now)).toBe(false);
    expect(canClockOut(application)).toBe(true);
  });

  it("builds google maps links from coordinates", () => {
    expect(formatGoogleMapsUrl(27.9506, -82.4572)).toBe(
      "https://www.google.com/maps?q=27.9506,-82.4572"
    );
  });
});
