import { describe, expect, it } from "vitest";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import { validateCompanyApplicationRemoval } from "@/lib/company-application-remove";

describe("validateCompanyApplicationRemoval", () => {
  it("allows removing an accepted officer from an upcoming shift", () => {
    const result = validateCompanyApplicationRemoval({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.PARTIALLY_FILLED,
      shiftEndTime: new Date("2026-12-01T12:00:00.000Z"),
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(result.allowed).toBe(true);
  });

  it("blocks removing non-accepted applications", () => {
    const result = validateCompanyApplicationRemoval({
      status: ApplicationStatus.PENDING,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: new Date("2026-12-01T12:00:00.000Z"),
    });

    expect(result).toEqual({
      allowed: false,
      message: "Only accepted officers can be removed from a shift.",
    });
  });

  it("blocks removing officers from completed or cancelled shifts", () => {
    const completed = validateCompanyApplicationRemoval({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.COMPLETED,
      shiftEndTime: new Date("2026-12-01T12:00:00.000Z"),
    });

    expect(completed).toEqual({
      allowed: false,
      message: "This assignment can no longer be removed.",
    });

    const past = validateCompanyApplicationRemoval({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.FILLED,
      shiftEndTime: new Date("2026-01-01T12:00:00.000Z"),
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(past).toEqual({
      allowed: false,
      message: "This assignment can no longer be removed.",
    });
  });
});
