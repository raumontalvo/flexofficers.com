import { ApplicationStatus } from "@/app/generated/prisma/enums";

type ValidateTransitionInput = {
  currentStatus: ApplicationStatus;
  nextStatus: ApplicationStatus;
  acceptedCount: number;
  positionsNeeded: number;
};

export function validateApplicationDecisionTransition({
  currentStatus,
  nextStatus,
  acceptedCount,
  positionsNeeded,
}: ValidateTransitionInput) {
  if (currentStatus !== ApplicationStatus.PENDING) {
    return {
      allowed: false,
      message: "Only pending applications can be updated.",
    };
  }

  if (
    nextStatus === ApplicationStatus.ACCEPTED &&
    acceptedCount >= positionsNeeded
  ) {
    return {
      allowed: false,
      message: "This shift is already filled.",
    };
  }

  return {
    allowed: true,
  };
}
