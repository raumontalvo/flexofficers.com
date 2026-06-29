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

export function getInviteStateForShift(
  officerId: string,
  shiftId: string,
  invites: readonly CompanyOfficerInviteRecord[]
): OfficerInviteButtonState {
  const invite = invites.find(
    (entry) => entry.officerId === officerId && entry.shiftId === shiftId
  );

  if (!invite || invite.status === "DECLINED") {
    return { kind: "invite" };
  }

  if (invite.status === "PENDING") {
    return { kind: "pending", label: "Invitation Sent" };
  }

  return { kind: "accepted", label: "Invite Accepted" };
}

export function getInviteableShiftIdsForOfficer(
  officerId: string,
  openShiftIds: readonly string[],
  invites: readonly CompanyOfficerInviteRecord[]
) {
  return openShiftIds.filter(
    (shiftId) =>
      getInviteStateForShift(officerId, shiftId, invites).kind === "invite"
  );
}

export function getOfficerInviteButtonState(
  officerId: string,
  invites: readonly CompanyOfficerInviteRecord[],
  openShiftIds: readonly string[] = []
): OfficerInviteButtonState {
  if (openShiftIds.length === 0) {
    return { kind: "invite" };
  }

  if (
    getInviteableShiftIdsForOfficer(officerId, openShiftIds, invites).length > 0
  ) {
    return { kind: "invite" };
  }

  const officerShiftInvites = invites.filter(
    (invite) =>
      invite.officerId === officerId && openShiftIds.includes(invite.shiftId)
  );

  if (officerShiftInvites.some((invite) => invite.status === "PENDING")) {
    return { kind: "pending", label: "Invitation Sent" };
  }

  if (officerShiftInvites.some((invite) => invite.status === "ACCEPTED")) {
    return { kind: "accepted", label: "Invite Accepted" };
  }

  return { kind: "invite" };
}

export function hasPendingInviteForShift(
  officerId: string,
  shiftId: string,
  invites: readonly CompanyOfficerInviteRecord[]
) {
  return (
    getInviteStateForShift(officerId, shiftId, invites).kind === "pending"
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
