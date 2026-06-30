import { describe, expect, it } from "vitest";
import {
  ShiftStatus,
  ShiftVisibility,
} from "@/app/generated/prisma/enums";
import {
  buildJobPageSlug,
  getShiftIdSuffixFromUuid,
  parseShiftIdPrefixFromJobSlug,
} from "@/lib/job-page-slug";
import {
  getPublicJobShiftOpenPositions,
  isShiftEligibleForPublicJobPage,
} from "@/lib/public-job-shift";

describe("job page slug", () => {
  it("builds a readable slug with the shift id suffix", () => {
    expect(
      buildJobPageSlug({
        id: "e186c480-2f4a-4b1d-9c3e-8a7f6d5e4c3b",
        title: "Security Officer",
        city: "Lehigh Acres",
        state: "FL",
        location: "123 Main St, Lehigh Acres, FL",
      })
    ).toBe("security-officer-lehigh-acres-fl-e186c480");
  });

  it("parses the shift id prefix from a job slug", () => {
    expect(
      parseShiftIdPrefixFromJobSlug("security-officer-lehigh-acres-fl-e186c480")
    ).toBe("e186c480");
  });

  it("extracts the uuid prefix for lookups", () => {
    expect(getShiftIdSuffixFromUuid("E186C480-2F4A-4B1D-9C3E-8A7F6D5E4C3B")).toBe(
      "e186c480"
    );
  });
});

describe("public job page eligibility", () => {
  const now = new Date("2026-06-26T12:00:00.000Z");

  it("accepts public open future shifts", () => {
    expect(
      isShiftEligibleForPublicJobPage(
        {
          visibility: ShiftVisibility.PUBLIC,
          status: ShiftStatus.OPEN,
          startTime: new Date("2026-07-01T08:00:00.000Z"),
        },
        now
      )
    ).toBe(true);
  });

  it("rejects staff-only, closed, and past shifts", () => {
    const futureStart = new Date("2026-07-01T08:00:00.000Z");

    expect(
      isShiftEligibleForPublicJobPage(
        {
          visibility: ShiftVisibility.STAFF_ONLY,
          status: ShiftStatus.OPEN,
          startTime: futureStart,
        },
        now
      )
    ).toBe(false);

    expect(
      isShiftEligibleForPublicJobPage(
        {
          visibility: ShiftVisibility.PUBLIC,
          status: ShiftStatus.CANCELLED,
          startTime: futureStart,
        },
        now
      )
    ).toBe(false);

    expect(
      isShiftEligibleForPublicJobPage(
        {
          visibility: ShiftVisibility.PUBLIC,
          status: ShiftStatus.OPEN,
          startTime: new Date("2026-06-01T08:00:00.000Z"),
        },
        now
      )
    ).toBe(false);
  });

  it("calculates open positions from accepted applications", () => {
    expect(
      getPublicJobShiftOpenPositions({
        positionsNeeded: 3,
        applications: [{ id: "app-1" }, { id: "app-2" }],
      })
    ).toBe(1);
  });
});
