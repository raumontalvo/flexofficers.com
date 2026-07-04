import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import { isAcceptedShiftPastOrClosed } from "@/lib/officer-application-delete";

export type OfficerApplicationCancellationInput = {
  status: ApplicationStatus;
  shiftStatus: ShiftStatus;
  shiftEndTime: Date | string;
  clockInAt?: Date | string | null;
  clockOutAt?: Date | string | null;
  now?: Date;
};

export function validateApplicationCancellation({
  status,
  shiftStatus,
  shiftEndTime,
  clockInAt = null,
  clockOutAt = null,
  now = new Date(),
}: OfficerApplicationCancellationInput) {
  if (status !== ApplicationStatus.ACCEPTED) {
    return {
      allowed: false as const,
      message: "Only accepted assignments can be cancelled.",
    };
  }

  // Once the officer has completed the shift (clocked out) it can never be
  // cancelled.
  if (clockOutAt) {
    return {
      allowed: false as const,
      message: "This assignment is already completed and can no longer be cancelled.",
    };
  }

  // Once the officer has clocked in they are on the shift and can no longer
  // cancel the assignment.
  if (clockInAt) {
    return {
      allowed: false as const,
      message: "You have already clocked in and can no longer cancel this assignment.",
    };
  }

  if (isAcceptedShiftPastOrClosed(shiftStatus, shiftEndTime, now)) {
    return {
      allowed: false as const,
      message: "This assignment can no longer be cancelled.",
    };
  }

  return { allowed: true as const };
}
