import { describe, expect, it } from "vitest";
import { formatShiftScheduleParts } from "@/lib/format-shift";
import { parseShiftRequirementChips } from "@/lib/shift-requirements";

describe("shift browse helpers", () => {
  it("formats stacked schedule parts", () => {
    const start = new Date("2026-06-09T14:00:00");
    const end = new Date("2026-06-09T21:00:00");

    expect(formatShiftScheduleParts(start, end)).toEqual({
      weekday: "Tue",
      monthDay: "Jun 9",
      timeRange: expect.stringContaining("–"),
    });
  });

  it("parses requirement text into compact chips", () => {
    expect(
      parseShiftRequirementChips("D License, G License, Armed Required, Age 21+", 4)
    ).toEqual(["D License", "G License", "Armed Required", "Age 21+"]);
  });

  it("deduplicates requirement chips", () => {
    expect(parseShiftRequirementChips("D License; D License; Armed")).toEqual([
      "D License",
      "Armed",
    ]);
  });
});
