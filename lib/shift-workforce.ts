import { ApplicationStatus, type InviteStatus } from "@/app/generated/prisma/enums";

export type ShiftAssignmentSource = "invitation" | "application";

export type ShiftWorkforceMember = {
  officerId: string;
  fullName: string;
  source: ShiftAssignmentSource;
  detailLabel: string;
};

export type ShiftPendingInviteMember = {
  officerId: string;
  fullName: string;
  detailLabel: string;
};

export type SerializedShiftWorkforce = {
  shiftId: string;
  positionsNeeded: number;
  acceptedOfficers: ShiftWorkforceMember[];
  pendingInvites: ShiftPendingInviteMember[];
  openPositionsRemaining: number;
};

type ShiftWorkforceRecord = {
  id: string;
  positionsNeeded: number;
  applications: {
    status: ApplicationStatus;
    officer: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  shiftInvites: {
    status: InviteStatus;
    officer: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
};

function formatOfficerName(officer: { firstName: string; lastName: string }) {
  return `${officer.firstName} ${officer.lastName}`.trim();
}

export function serializeShiftWorkforce(
  shift: ShiftWorkforceRecord
): SerializedShiftWorkforce {
  const acceptedInvites = new Set(
    shift.shiftInvites
      .filter((invite) => invite.status === "ACCEPTED")
      .map((invite) => invite.officer.id)
  );

  const acceptedOfficers = shift.applications
    .filter((application) => application.status === ApplicationStatus.ACCEPTED)
    .map((application) => {
      const viaInvitation = acceptedInvites.has(application.officer.id);

      return {
        officerId: application.officer.id,
        fullName: formatOfficerName(application.officer),
        source: viaInvitation ? ("invitation" as const) : ("application" as const),
        detailLabel: viaInvitation
          ? "Accepted by Invitation"
          : "Accepted by Application",
      };
    });

  const pendingInvites = shift.shiftInvites
    .filter((invite) => invite.status === "PENDING")
    .map((invite) => ({
      officerId: invite.officer.id,
      fullName: formatOfficerName(invite.officer),
      detailLabel: "Pending Response",
    }));

  const openPositionsRemaining = Math.max(
    shift.positionsNeeded - acceptedOfficers.length,
    0
  );

  return {
    shiftId: shift.id,
    positionsNeeded: shift.positionsNeeded,
    acceptedOfficers,
    pendingInvites,
    openPositionsRemaining,
  };
}

export function getShiftWorkforceMap(
  shifts: ShiftWorkforceRecord[]
): Record<string, SerializedShiftWorkforce> {
  return Object.fromEntries(
    shifts.map((shift) => [shift.id, serializeShiftWorkforce(shift)])
  );
}
