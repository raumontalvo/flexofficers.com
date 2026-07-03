import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  canClockOut,
  type ClockableApplication,
} from "@/lib/attendance";

export function validateClockOutRequest(application: ClockableApplication) {
  if (application.status !== ApplicationStatus.ACCEPTED) {
    return {
      allowed: false as const,
      message: "Only accepted assignments can be clocked out.",
    };
  }

  if (application.shift.status === ShiftStatus.CANCELLED) {
    return {
      allowed: false as const,
      message: "This shift has been cancelled.",
    };
  }

  if (!application.clockInAt) {
    return {
      allowed: false as const,
      message: "You must clock in before clocking out.",
    };
  }

  if (application.clockOutAt) {
    return {
      allowed: false as const,
      message: "You have already clocked out for this shift.",
    };
  }

  if (!canClockOut(application)) {
    return {
      allowed: false as const,
      message: "Clock out is not available for this shift.",
    };
  }

  return { allowed: true as const };
}
