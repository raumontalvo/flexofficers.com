import { describe, expect, it } from "vitest";
import {
  buildShiftWorkforceGroups,
  getStaffingProgress,
  getWorkforceShiftTiming,
  officerMatchesSearch,
} from "@/lib/company-workforce-data";

describe("company workforce data helpers", () => {
  it("groups accepted applications by shift", () => {
    const groups = buildShiftWorkforceGroups([
      {
        id: "app-1",
        officer: {
          id: "officer-1",
          firstName: "Alex",
          lastName: "Rivera",
          profilePhotoUrl: null,
          city: "Tampa",
          state: "FL",
          phone: "555-0100",
          armedStatuses: ["ARMED"],
          experienceYears: 5,
          certifications: ["CPR"],
          experienceCategories: ["Retail Security"],
          introduction: null,
          licenses: [],
          user: { email: "alex@example.com" },
        },
        shift: {
          id: "shift-1",
          title: "Warehouse Security",
          location: "Tampa, FL",
          city: "Tampa",
          state: "FL",
          startTime: new Date("2026-06-11T18:00:00.000Z"),
          endTime: new Date("2026-06-12T02:00:00.000Z"),
          positionsNeeded: 4,
          status: "OPEN",
          hourlyRate: { toString: () => "20" },
        },
      },
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].officers).toHaveLength(1);
    expect(getStaffingProgress(1, 4).remainingLabel).toBe("3 Positions Remaining");
  });

  it("categorizes shift timing and matches officer search", () => {
    expect(getWorkforceShiftTiming("CANCELLED", "2099-01-01T00:00:00.000Z")).toBe(
      "cancelled"
    );
    expect(getWorkforceShiftTiming("OPEN", "2099-01-01T00:00:00.000Z")).toBe(
      "upcoming"
    );
    expect(
      officerMatchesSearch(
        {
          applicationId: "app-1",
          officer: {
            id: "officer-1",
            firstName: "Alex",
            lastName: "Rivera",
            profilePhotoUrl: null,
            city: "Tampa",
            state: "FL",
            phone: null,
            armedStatuses: [],
            experienceYears: null,
            certifications: [],
            experienceCategories: [],
            introduction: null,
            licenses: [],
            email: "alex@example.com",
          },
        },
        "alex"
      )
    ).toBe(true);
  });
});
