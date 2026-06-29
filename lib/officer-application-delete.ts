import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";

export type OfficerApplicationDeletionInput = {
  status: ApplicationStatus;
  shiftStatus: ShiftStatus;
  shiftEndTime: Date | string;
  now?: Date;
};

export function isAcceptedShiftPastOrClosed(
  shiftStatus: ShiftStatus,
  shiftEndTime: Date | string,
  now: Date = new Date()
) {
  if (
    shiftStatus === ShiftStatus.CANCELLED ||
    shiftStatus === ShiftStatus.COMPLETED
  ) {
    return true;
  }

  return new Date(shiftEndTime).getTime() < now.getTime();
}

export function validateApplicationDeletion({
  status,
  shiftStatus,
  shiftEndTime,
  now = new Date(),
}: OfficerApplicationDeletionInput) {
  if (
    status === ApplicationStatus.PENDING ||
    status === ApplicationStatus.REJECTED ||
    status === ApplicationStatus.WITHDRAWN
  ) {
    return { allowed: true as const };
  }

  if (status === ApplicationStatus.ACCEPTED) {
    if (isAcceptedShiftPastOrClosed(shiftStatus, shiftEndTime, now)) {
      return { allowed: true as const };
    }

    return {
      allowed: false as const,
      message:
        "Active accepted shifts cannot be deleted. Cancel or manage them from Accepted Shifts.",
    };
  }

  return { allowed: true as const };
}

export function canOfficerDeleteApplication(
  input: OfficerApplicationDeletionInput
) {
  return validateApplicationDeletion(input).allowed;
}
