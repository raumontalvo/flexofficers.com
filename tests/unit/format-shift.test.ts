import { describe, expect, it } from "vitest";
import {
  calculateEstimatedShiftPay,
  formatEstimatedShiftPay,
  formatShiftCityState,
  formatShiftDateRange,
} from "@/lib/format-shift";

describe("format-shift helpers", () => {
  it("formats a same-day shift range compactly", () => {
    const start = new Date("2026-06-26T18:00:00");
    const end = new Date("2026-06-26T22:00:00");

    expect(formatShiftDateRange(start, end)).toContain("Jun 26");
    expect(formatShiftDateRange(start, end)).toContain("–");
  });

  it("calculates estimated pay from real start and end times", () => {
    const start = new Date("2026-06-26T18:00:00");
    const end = new Date("2026-06-26T22:00:00");

    expect(calculateEstimatedShiftPay({ toString: () => "25" }, start, end)).toBe(
      100
    );
    expect(formatEstimatedShiftPay({ toString: () => "25" }, start, end)).toBe(
      "$100.00"
    );
  });

  it("returns null when shift duration is invalid", () => {
    const start = new Date("2026-06-26T22:00:00");
    const end = new Date("2026-06-26T18:00:00");

    expect(
      calculateEstimatedShiftPay({ toString: () => "25" }, start, end)
    ).toBeNull();
  });

  it("formats city and state from shift location fields", () => {
    expect(
      formatShiftCityState({
        city: "Miami",
        state: "FL",
        location: "123 Main St, Miami, FL",
      })
    ).toBe("Miami, FL");

    expect(
      formatShiftCityState({
        city: null,
        state: null,
        location: "Orlando Convention Center",
      })
    ).toBe("Orlando Convention Center");
  });
});
