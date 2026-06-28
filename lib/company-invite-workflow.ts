import type { InviteStatus } from "@/app/generated/prisma/enums";

export type CompanyOfficerInviteRecord = {
  id: string;
  officerId: string;
  shiftId: string;
  status: InviteStatus;
};

export type OfficerInviteButtonState =
  | { kind: "invite" }
  | { kind: "pending"; label: "Invitation Sent" }
  | { kind: "accepted"; label: "Invite Accepted" };

export function getOfficerInviteButtonState(
  officerId: string,
  invites: readonly CompanyOfficerInviteRecord[]
): OfficerInviteButtonState {
  const officerInvites = invites.filter((invite) => invite.officerId === officerId);

  if (officerInvites.some((invite) => invite.status === "PENDING")) {
    return { kind: "pending", label: "Invitation Sent" };
  }

  if (officerInvites.some((invite) => invite.status === "ACCEPTED")) {
    return { kind: "accepted", label: "Invite Accepted" };
  }

  return { kind: "invite" };
}

export function hasPendingInviteForShift(
  officerId: string,
  shiftId: string,
  invites: readonly CompanyOfficerInviteRecord[]
) {
  return invites.some(
    (invite) =>
      invite.officerId === officerId &&
      invite.shiftId === shiftId &&
      invite.status === "PENDING"
  );
}

export function buildOfficerInviteNotificationMessage(input: {
  companyName: string;
  shiftTitle: string;
  message?: string | null;
}) {
  const base = `${input.companyName} invited you to: ${input.shiftTitle}`;
  const trimmedMessage = input.message?.trim();

  if (!trimmedMessage) {
    return base;
  }

  return `${base}\n\n${trimmedMessage}`;
}

export function buildCompanyInviteResponseNotification(input: {
  officerName: string;
  shiftTitle: string;
  response: "accept" | "decline";
}) {
  if (input.response === "accept") {
    return {
      title: "Invitation Accepted",
      message: `${input.officerName} accepted your invitation to ${input.shiftTitle}.`,
    };
  }

  return {
    title: "Invitation Declined",
    message: `${input.officerName} declined your invitation to ${input.shiftTitle}.`,
  };
}
