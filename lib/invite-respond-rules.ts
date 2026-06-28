import type { InviteStatus } from "@/app/generated/prisma/enums";
import { ApplicationStatus } from "@/app/generated/prisma/enums";

export type InviteResponse = "accept" | "decline";

export function validateInviteResponseTransition(input: {
  currentStatus: InviteStatus;
  response: InviteResponse;
}) {
  if (input.currentStatus !== "PENDING") {
    return {
      allowed: false,
      message: "Only pending invites can be updated.",
    };
  }

  if (input.response !== "accept" && input.response !== "decline") {
    return {
      allowed: false,
      message: "Invalid response. Allowed values: accept, decline.",
    };
  }

  return {
    allowed: true,
  };
}

export function inviteStatusForResponse(response: InviteResponse): InviteStatus {
  return response === "accept" ? "ACCEPTED" : "DECLINED";
}

export function canAcceptInvite(input: {
  acceptedCount: number;
  positionsNeeded: number;
  existingApplicationStatus: ApplicationStatus | null;
}) {
  if (
    input.existingApplicationStatus === ApplicationStatus.ACCEPTED
  ) {
    return {
      allowed: true,
      message: null,
    };
  }

  if (input.acceptedCount >= input.positionsNeeded) {
    return {
      allowed: false,
      message: "This shift is already filled.",
    };
  }

  return {
    allowed: true,
    message: null,
  };
}
