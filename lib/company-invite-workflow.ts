import type { InviteStatus } from "@/app/generated/prisma/enums";

export type CompanyOfficerInviteRecord = {
  id: string;
  officerId: string;
  shiftId: string;
  status: InviteStatus;
};

export type CompanyOfficerShiftAssignment = {
  officerId: string;
  shiftId: string;
};

export type OfficerInviteButtonState =
  | { kind: "invite" }
  | { kind: "pending"; label: "Invitation Sent" }
  | { kind: "accepted"; label: "Invite Accepted" | "Assigned to Shift" };

function isOfficerAssignedToShift(
  officerId: string,
  shiftId: string,
  acceptedAssignments: readonly CompanyOfficerShiftAssignment[]
) {
  return acceptedAssignments.some(
    (assignment) =>
      assignment.officerId === officerId && assignment.shiftId === shiftId
  );
}

export function getInviteStateForShift(
  officerId: string,
  shiftId: string,
  invites: readonly CompanyOfficerInviteRecord[],
  acceptedAssignments: readonly CompanyOfficerShiftAssignment[] = []
): OfficerInviteButtonState {
  if (isOfficerAssignedToShift(officerId, shiftId, acceptedAssignments)) {
    return { kind: "accepted", label: "Assigned to Shift" };
  }

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
  invites: readonly CompanyOfficerInviteRecord[],
  acceptedAssignments: readonly CompanyOfficerShiftAssignment[] = []
) {
  return openShiftIds.filter(
    (shiftId) =>
      getInviteStateForShift(
        officerId,
        shiftId,
        invites,
        acceptedAssignments
      ).kind === "invite"
  );
}

export function getOfficerInviteButtonState(
  officerId: string,
  invites: readonly CompanyOfficerInviteRecord[],
  openShiftIds: readonly string[] = [],
  acceptedAssignments: readonly CompanyOfficerShiftAssignment[] = []
): OfficerInviteButtonState {
  if (openShiftIds.length === 0) {
    return { kind: "invite" };
  }

  if (
    getInviteableShiftIdsForOfficer(
      officerId,
      openShiftIds,
      invites,
      acceptedAssignments
    ).length > 0
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

  if (
    openShiftIds.some((shiftId) =>
      isOfficerAssignedToShift(officerId, shiftId, acceptedAssignments)
    )
  ) {
    return { kind: "accepted", label: "Assigned to Shift" };
  }

  if (officerShiftInvites.some((invite) => invite.status === "ACCEPTED")) {
    return { kind: "accepted", label: "Invite Accepted" };
  }

  return { kind: "invite" };
}
export function hasPendingInviteForShift(
  officerId: string,
  shiftId: string,
  invites: readonly CompanyOfficerInviteRecord[],
  acceptedAssignments: readonly CompanyOfficerShiftAssignment[] = []
) {
  return (
    getInviteStateForShift(
      officerId,
      shiftId,
      invites,
      acceptedAssignments
    ).kind === "pending"
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

export function buildOfficerInviteNotificationPayload(input: {
  companyName: string;
  shiftTitle: string;
  message?: string | null;
}) {
  const message = buildOfficerInviteNotificationMessage(input);
  const emailMessage = `${input.companyName} has sent you an invite to apply for ${input.shiftTitle}. Sign in to FlexOfficers to review the invite and respond.`;
  const trimmedMessage = input.message?.trim();

  return {
    title: "Company Invite to Apply",
    message,
    emailSubject: `${input.companyName} sent you an invite to apply`,
    emailMessage: trimmedMessage
      ? `${emailMessage}\n\nMessage from the company:\n${trimmedMessage}`
      : emailMessage,
  };
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
