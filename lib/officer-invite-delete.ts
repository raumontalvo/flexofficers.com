import { InviteStatus } from "@/app/generated/prisma/enums";

export type OfficerInviteDeletionInput = {
  status: InviteStatus;
};

export function validateInviteDeletion({ status }: OfficerInviteDeletionInput) {
  if (status === InviteStatus.DECLINED) {
    return { allowed: true as const };
  }

  if (status === InviteStatus.PENDING) {
    return {
      allowed: false as const,
      message: "Pending invites must be declined before they can be deleted.",
    };
  }

  return {
    allowed: false as const,
    message: "Accepted invites cannot be deleted from this list.",
  };
}

export function canOfficerDeleteInvite(input: OfficerInviteDeletionInput) {
  return validateInviteDeletion(input).allowed;
}
