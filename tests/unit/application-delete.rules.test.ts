import { describe, expect, it } from "vitest";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  isAcceptedShiftPastOrClosed,
  validateApplicationDeletion,
} from "@/lib/officer-application-delete";

const now = new Date("2026-06-15T12:00:00.000Z");

describe("officer application deletion", () => {
  it("allows deletion for pending, rejected, and withdrawn applications", () => {
    for (const status of [
      ApplicationStatus.PENDING,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ]) {
      expect(
        validateApplicationDeletion({
          status,
          shiftStatus: ShiftStatus.OPEN,
          shiftEndTime: "2026-07-01T12:00:00.000Z",
          now,
        }).allowed
      ).toBe(true);
    }
  });

  it("blocks deletion for active accepted applications", () => {
    const result = validateApplicationDeletion({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: "2026-06-20T12:00:00.000Z",
      now,
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toContain("Accepted Shifts");
  });

  it("allows deletion for completed or past accepted applications", () => {
    expect(
      validateApplicationDeletion({
        status: ApplicationStatus.ACCEPTED,
        shiftStatus: ShiftStatus.COMPLETED,
        shiftEndTime: "2026-06-20T12:00:00.000Z",
        now,
      }).allowed
    ).toBe(true);

    expect(
      validateApplicationDeletion({
        status: ApplicationStatus.ACCEPTED,
        shiftStatus: ShiftStatus.OPEN,
        shiftEndTime: "2026-06-10T12:00:00.000Z",
        now,
      }).allowed
    ).toBe(true);

    expect(
      validateApplicationDeletion({
        status: ApplicationStatus.ACCEPTED,
        shiftStatus: ShiftStatus.CANCELLED,
        shiftEndTime: "2026-06-20T12:00:00.000Z",
        now,
      }).allowed
    ).toBe(true);
  });

  it("detects past or closed accepted shifts", () => {
    expect(
      isAcceptedShiftPastOrClosed(
        ShiftStatus.COMPLETED,
        "2026-07-01T12:00:00.000Z",
        now
      )
    ).toBe(true);

    expect(
      isAcceptedShiftPastOrClosed(
        ShiftStatus.OPEN,
        "2026-06-10T12:00:00.000Z",
        now
      )
    ).toBe(true);

    expect(
      isAcceptedShiftPastOrClosed(
        ShiftStatus.OPEN,
        "2026-06-20T12:00:00.000Z",
        now
      )
    ).toBe(false);
  });
});
