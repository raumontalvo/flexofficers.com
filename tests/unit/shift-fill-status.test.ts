import { describe, expect, it } from "vitest";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import { computeShiftFillStatus } from "@/lib/shift-fill-status";

describe("shift fill status", () => {
  it("returns filled when accepted count reaches positions needed", () => {
    expect(
      computeShiftFillStatus({
        acceptedCount: 3,
        pendingInviteCount: 1,
        positionsNeeded: 3,
        currentStatus: ShiftStatus.PARTIALLY_FILLED,
      })
    ).toBe(ShiftStatus.FILLED);
  });

  it("returns partially filled when some officers are accepted", () => {
    expect(
      computeShiftFillStatus({
        acceptedCount: 2,
        pendingInviteCount: 1,
        positionsNeeded: 3,
        currentStatus: ShiftStatus.OPEN,
      })
    ).toBe(ShiftStatus.PARTIALLY_FILLED);
  });

  it("returns invited when only pending invites exist", () => {
    expect(
      computeShiftFillStatus({
        acceptedCount: 0,
        pendingInviteCount: 2,
        positionsNeeded: 3,
        currentStatus: ShiftStatus.OPEN,
      })
    ).toBe(ShiftStatus.INVITED);
  });

  it("returns open when there are no accepts or pending invites", () => {
    expect(
      computeShiftFillStatus({
        acceptedCount: 0,
        pendingInviteCount: 0,
        positionsNeeded: 3,
        currentStatus: ShiftStatus.INVITED,
      })
    ).toBe(ShiftStatus.OPEN);
  });
});
