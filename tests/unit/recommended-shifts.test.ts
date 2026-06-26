import { describe, expect, it } from "vitest";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { rankRecommendedShifts } from "@/lib/recommended-shifts";

const baseShift = {
  id: "shift-1",
  title: "Retail security",
  description: "Armed retail coverage",
  location: "Miami, FL",
  hourlyRate: { toString: () => "30" },
  startTime: new Date("2026-07-01T08:00:00.000Z"),
  endTime: new Date("2026-07-01T16:00:00.000Z"),
  status: ShiftStatus.OPEN,
  specialRequirements: "Armed officer required",
  company: {
    companyName: "Coastal Security Group",
  },
};

describe("rankRecommendedShifts", () => {
  it("ranks shifts with stronger profile matches higher", () => {
    const ranked = rankRecommendedShifts(
      [
        baseShift,
        {
          ...baseShift,
          id: "shift-2",
          title: "Warehouse patrol",
          hourlyRate: { toString: () => "40" },
          specialRequirements: "Unarmed warehouse coverage",
        },
      ],
      {
        armedStatuses: ["ARMED"],
        experienceCategories: ["Retail security"],
      },
      { now: new Date("2026-06-26T12:00:00.000Z") }
    );

    expect(ranked[0]?.id).toBe("shift-1");
  });

  it("returns latest open shifts when no officer profile is available", () => {
    const ranked = rankRecommendedShifts(
      [
        {
          ...baseShift,
          id: "shift-a",
          startTime: new Date("2026-08-01T08:00:00.000Z"),
        },
        {
          ...baseShift,
          id: "shift-b",
          startTime: new Date("2026-07-10T08:00:00.000Z"),
        },
      ],
      null,
      { now: new Date("2026-06-26T12:00:00.000Z") }
    );

    expect(ranked.map((shift) => shift.id)).toEqual(["shift-b", "shift-a"]);
  });
});
