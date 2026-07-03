import { ApplicationStatus, type InviteStatus } from "@/app/generated/prisma/enums";
import {
  getAttendanceStatus,
  getAttendanceStatusLabel,
  type AttendanceStatus,
} from "@/lib/attendance";
import { getRemainingOpenPositions } from "@/lib/shift-fill-status";

export type ShiftAssignmentSource = "invitation" | "application";

export type ShiftWorkforceAttendance = {
  applicationId: string;
  status: AttendanceStatus;
  statusLabel: string;
  clockInAt: string | null;
  clockOutAt: string | null;
  clockInLatitude: number | null;
  clockInLongitude: number | null;
  clockOutLatitude: number | null;
  clockOutLongitude: number | null;
};

export type ShiftWorkforceMember = {
  officerId: string;
  fullName: string;
  source: ShiftAssignmentSource;
  detailLabel: string;
  attendance: ShiftWorkforceAttendance;
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
    id: string;
    status: ApplicationStatus;
    clockInAt: Date | null;
    clockOutAt: Date | null;
    clockInLatitude: number | null;
    clockInLongitude: number | null;
    clockOutLatitude: number | null;
    clockOutLongitude: number | null;
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
      const attendanceStatus = getAttendanceStatus(application);

      return {
        officerId: application.officer.id,
        fullName: formatOfficerName(application.officer),
        source: viaInvitation ? ("invitation" as const) : ("application" as const),
        detailLabel: viaInvitation
          ? "Accepted by Invitation"
          : "Accepted by Application",
        attendance: {
          applicationId: application.id,
          status: attendanceStatus,
          statusLabel: getAttendanceStatusLabel(attendanceStatus),
          clockInAt: application.clockInAt?.toISOString() ?? null,
          clockOutAt: application.clockOutAt?.toISOString() ?? null,
          clockInLatitude: application.clockInLatitude,
          clockInLongitude: application.clockInLongitude,
          clockOutLatitude: application.clockOutLatitude,
          clockOutLongitude: application.clockOutLongitude,
        },
      };
    });

  const pendingInvites = shift.shiftInvites
    .filter((invite) => invite.status === "PENDING")
    .map((invite) => ({
      officerId: invite.officer.id,
      fullName: formatOfficerName(invite.officer),
      detailLabel: "Pending Response",
    }));

  const openPositionsRemaining = getRemainingOpenPositions(
    shift.positionsNeeded,
    acceptedOfficers.length
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
