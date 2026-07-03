import { describe, expect, it } from "vitest";
import { ShiftStatus } from "@/app/generated/prisma/enums";
import {
  computeShiftFillStatus,
  resolveShiftDisplayStatus,
} from "@/lib/shift-fill-status";

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

  it("returns partially filled for 1 accepted of 4 positions", () => {
    expect(
      resolveShiftDisplayStatus({
        storedStatus: ShiftStatus.PARTIALLY_FILLED,
        acceptedCount: 1,
        positionsNeeded: 4,
      })
    ).toBe(ShiftStatus.PARTIALLY_FILLED);
  });

  it("returns filled after positions reduced to 1 with 1 accepted", () => {
    expect(
      resolveShiftDisplayStatus({
        storedStatus: ShiftStatus.PARTIALLY_FILLED,
        acceptedCount: 1,
        positionsNeeded: 1,
      })
    ).toBe(ShiftStatus.FILLED);
  });

  it("returns partially filled after positions set to 2 with 1 accepted", () => {
    expect(
      resolveShiftDisplayStatus({
        storedStatus: ShiftStatus.PARTIALLY_FILLED,
        acceptedCount: 1,
        positionsNeeded: 2,
      })
    ).toBe(ShiftStatus.PARTIALLY_FILLED);
  });

  it("returns open when no officers are accepted", () => {
    expect(
      resolveShiftDisplayStatus({
        storedStatus: ShiftStatus.PARTIALLY_FILLED,
        acceptedCount: 0,
        positionsNeeded: 4,
      })
    ).toBe(ShiftStatus.OPEN);
  });

  it("returns filled when accepted count exceeds positions needed", () => {
    expect(
      resolveShiftDisplayStatus({
        storedStatus: ShiftStatus.PARTIALLY_FILLED,
        acceptedCount: 2,
        positionsNeeded: 1,
      })
    ).toBe(ShiftStatus.FILLED);
  });
});
