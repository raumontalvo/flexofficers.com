import { ApplicationStatus } from "@/app/generated/prisma/enums";

type ValidateWithdrawalInput = {
  currentStatus: ApplicationStatus;
};

export function validateApplicationWithdrawal({
  currentStatus,
}: ValidateWithdrawalInput) {
  if (currentStatus !== ApplicationStatus.PENDING) {
    return {
      allowed: false,
      message: "Only pending applications can be withdrawn.",
    };
  }

  return {
    allowed: true,
  };
}
