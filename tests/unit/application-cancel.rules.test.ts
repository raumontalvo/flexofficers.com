import { describe, expect, it } from "vitest";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import { validateApplicationCancellation } from "@/app/api/applications/cancel/rules";

describe("validateApplicationCancellation", () => {
  it("allows cancellation for accepted upcoming shifts", () => {
    const result = validateApplicationCancellation({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: "2099-01-01T00:00:00.000Z",
    });

    expect(result.allowed).toBe(true);
  });

  it("blocks cancellation for pending applications", () => {
    const result = validateApplicationCancellation({
      status: ApplicationStatus.PENDING,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: "2099-01-01T00:00:00.000Z",
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("Only accepted assignments can be cancelled.");
  });

  it("blocks cancellation after the shift has ended", () => {
    const result = validateApplicationCancellation({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: "2020-01-01T00:00:00.000Z",
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("This assignment can no longer be cancelled.");
  });

  it("blocks cancellation when the shift was cancelled", () => {
    const result = validateApplicationCancellation({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.CANCELLED,
      shiftEndTime: "2099-01-01T00:00:00.000Z",
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe("This assignment can no longer be cancelled.");
  });

  it("blocks cancellation once the officer has clocked in", () => {
    const result = validateApplicationCancellation({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: "2099-01-01T00:00:00.000Z",
      clockInAt: "2099-01-01T00:00:00.000Z",
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe(
      "You have already clocked in and can no longer cancel this assignment."
    );
  });

  it("blocks cancellation once the officer has completed the shift", () => {
    const result = validateApplicationCancellation({
      status: ApplicationStatus.ACCEPTED,
      shiftStatus: ShiftStatus.OPEN,
      shiftEndTime: "2099-01-01T00:00:00.000Z",
      clockInAt: "2099-01-01T00:00:00.000Z",
      clockOutAt: "2099-01-01T02:00:00.000Z",
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe(
      "This assignment is already completed and can no longer be cancelled."
    );
  });
});
