import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  canClockIn,
  type ClockableApplication,
} from "@/lib/attendance";

export function validateClockInRequest(application: ClockableApplication) {
  if (application.status !== ApplicationStatus.ACCEPTED) {
    return {
      allowed: false as const,
      message: "Only accepted assignments can be clocked in.",
    };
  }

  if (application.shift.status === ShiftStatus.CANCELLED) {
    return {
      allowed: false as const,
      message: "This shift has been cancelled.",
    };
  }

  if (application.clockInAt) {
    return {
      allowed: false as const,
      message: "You have already clocked in for this shift.",
    };
  }

  if (!canClockIn(application)) {
    return {
      allowed: false as const,
      message: "Clock in opens one hour before the scheduled shift start.",
    };
  }

  return { allowed: true as const };
}
