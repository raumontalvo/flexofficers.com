import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import { isAcceptedShiftPastOrClosed } from "@/lib/officer-application-delete";

export type CompanyApplicationRemovalInput = {
  status: ApplicationStatus;
  shiftStatus: ShiftStatus;
  shiftEndTime: Date | string;
  now?: Date;
};

export function validateCompanyApplicationRemoval({
  status,
  shiftStatus,
  shiftEndTime,
  now = new Date(),
}: CompanyApplicationRemovalInput) {
  if (status !== ApplicationStatus.ACCEPTED) {
    return {
      allowed: false as const,
      message: "Only accepted officers can be removed from a shift.",
    };
  }

  if (isAcceptedShiftPastOrClosed(shiftStatus, shiftEndTime, now)) {
    return {
      allowed: false as const,
      message: "This assignment can no longer be removed.",
    };
  }

  return { allowed: true as const };
}
