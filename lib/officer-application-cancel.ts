import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import { isAcceptedShiftPastOrClosed } from "@/lib/officer-application-delete";

export type OfficerApplicationCancellationInput = {
  status: ApplicationStatus;
  shiftStatus: ShiftStatus;
  shiftEndTime: Date | string;
  now?: Date;
};

export function validateApplicationCancellation({
  status,
  shiftStatus,
  shiftEndTime,
  now = new Date(),
}: OfficerApplicationCancellationInput) {
  if (status !== ApplicationStatus.ACCEPTED) {
    return {
      allowed: false as const,
      message: "Only accepted assignments can be cancelled.",
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
