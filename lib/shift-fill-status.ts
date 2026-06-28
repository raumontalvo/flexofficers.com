import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import type { Prisma } from "@/app/generated/prisma/client";

type ComputeShiftFillStatusInput = {
  acceptedCount: number;
  pendingInviteCount: number;
  positionsNeeded: number;
  currentStatus: ShiftStatus;
};

export const INVITEABLE_SHIFT_STATUSES: ShiftStatus[] = [
  ShiftStatus.OPEN,
  ShiftStatus.INVITED,
  ShiftStatus.PARTIALLY_FILLED,
];

export function isInviteableShiftStatus(status: ShiftStatus) {
  return INVITEABLE_SHIFT_STATUSES.includes(status);
}

export function computeShiftFillStatus({
  acceptedCount,
  pendingInviteCount,
  positionsNeeded,
  currentStatus,
}: ComputeShiftFillStatusInput): ShiftStatus {
  if (
    currentStatus === ShiftStatus.CANCELLED ||
    currentStatus === ShiftStatus.COMPLETED
  ) {
    return currentStatus;
  }

  if (acceptedCount >= positionsNeeded) {
    return ShiftStatus.FILLED;
  }

  if (acceptedCount > 0) {
    return ShiftStatus.PARTIALLY_FILLED;
  }

  if (pendingInviteCount > 0) {
    return ShiftStatus.INVITED;
  }

  return ShiftStatus.OPEN;
}

export async function syncShiftFillStatus(
  tx: Prisma.TransactionClient,
  shiftId: string
) {
  const shift = await tx.shift.findUnique({
    where: {
      id: shiftId,
    },
    select: {
      id: true,
      status: true,
      positionsNeeded: true,
    },
  });

  if (!shift) {
    return null;
  }

  const [acceptedCount, pendingInviteCount] = await Promise.all([
    tx.application.count({
      where: {
        shiftId,
        status: ApplicationStatus.ACCEPTED,
      },
    }),
    tx.shiftInvite.count({
      where: {
        shiftId,
        status: "PENDING",
      },
    }),
  ]);

  const nextStatus = computeShiftFillStatus({
    acceptedCount,
    pendingInviteCount,
    positionsNeeded: shift.positionsNeeded,
    currentStatus: shift.status,
  });

  if (nextStatus === shift.status) {
    return shift.status;
  }

  await tx.shift.update({
    where: {
      id: shiftId,
    },
    data: {
      status: nextStatus,
    },
  });

  return nextStatus;
}
