import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";

export type CompanyShiftRecord = {
  id: string;
  title: string;
  location: string;
  city: string | null;
  state: string | null;
  startTime: Date;
  endTime: Date;
  status: ShiftStatus;
  positionsNeeded: number;
  applications: { status: ApplicationStatus }[];
};

export type CompanyApplicationRecord = {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  shift: {
    title: string;
  };
  officer: {
    firstName: string;
    lastName: string;
    armedStatuses: string[];
  };
};

export type CompanyDashboardShiftTab =
  | "all"
  | "open"
  | "filled"
  | "past"
  | "cancelled";

export function isPastShift(
  shift: Pick<CompanyShiftRecord, "status" | "endTime">,
  now: Date = new Date()
) {
  return (
    shift.status === ShiftStatus.COMPLETED ||
    (shift.endTime < now && shift.status !== ShiftStatus.CANCELLED)
  );
}

export function getShiftApplicantCount(shift: CompanyShiftRecord) {
  return shift.applications.length;
}

export function getShiftFilledCount(shift: CompanyShiftRecord) {
  return shift.applications.filter(
    (application) => application.status === ApplicationStatus.ACCEPTED
  ).length;
}

export function getShiftOpenPositions(shift: CompanyShiftRecord) {
  return Math.max(shift.positionsNeeded - getShiftFilledCount(shift), 0);
}

export function filterShiftsByTab(
  shifts: CompanyShiftRecord[],
  tab: CompanyDashboardShiftTab,
  now: Date = new Date()
) {
  switch (tab) {
    case "open":
      return shifts.filter((shift) => isActiveCompanyShiftStatus(shift.status));
    case "filled":
      return shifts.filter((shift) => shift.status === ShiftStatus.FILLED);
    case "past":
      return shifts.filter((shift) => isPastShift(shift, now));
    case "cancelled":
      return shifts.filter((shift) => shift.status === ShiftStatus.CANCELLED);
    case "all":
    default:
      return shifts;
  }
}

export function getCompanyShiftStats(
  shifts: CompanyShiftRecord[],
  now: Date = new Date()
) {
  const open = shifts.filter((shift) => isActiveCompanyShiftStatus(shift.status))
    .length;
  const filled = shifts.filter(
    (shift) => shift.status === ShiftStatus.FILLED
  ).length;
  const past = shifts.filter((shift) => isPastShift(shift, now)).length;

  return {
    total: shifts.length,
    open,
    filled,
    past,
  };
}

export function getCompanyApplicationStats(
  applications: Pick<CompanyApplicationRecord, "status">[]
) {
  const pending = applications.filter(
    (application) => application.status === ApplicationStatus.PENDING
  ).length;
  const reviewed = applications.filter(
    (application) =>
      application.status === ApplicationStatus.ACCEPTED ||
      application.status === ApplicationStatus.REJECTED
  ).length;
  const withdrawn = applications.filter(
    (application) => application.status === ApplicationStatus.WITHDRAWN
  ).length;
  const accepted = applications.filter(
    (application) => application.status === ApplicationStatus.ACCEPTED
  ).length;
  const rejected = applications.filter(
    (application) => application.status === ApplicationStatus.REJECTED
  ).length;

  return {
    total: applications.length,
    new: pending,
    reviewed,
    withdrawn,
    accepted,
    rejected,
    pending,
  };
}

export function getCompanyApplicationsSummary(input: {
  applications: Pick<CompanyApplicationRecord, "status">[];
  invitedCount: number;
}) {
  const applicationStats = getCompanyApplicationStats(input.applications);

  return {
    total:
      applicationStats.pending + input.invitedCount + applicationStats.accepted,
    pending: applicationStats.pending,
    invited: input.invitedCount,
    accepted: applicationStats.accepted,
  };
}

export function isActiveCompanyShiftStatus(status: ShiftStatus) {
  return (
    status === ShiftStatus.OPEN ||
    status === ShiftStatus.INVITED ||
    status === ShiftStatus.PARTIALLY_FILLED
  );
}

export function getFilledShiftsThisMonth(
  shifts: CompanyShiftRecord[],
  now: Date = new Date()
) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return shifts.filter(
    (shift) =>
      shift.status === ShiftStatus.FILLED &&
      shift.startTime >= monthStart &&
      shift.startTime <= monthEnd
  ).length;
}

export function getUpcomingConfirmedShifts(
  shifts: CompanyShiftRecord[],
  now: Date = new Date(),
  days = 7
) {
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + days);

  return shifts
    .filter((shift) => {
      const hasAccepted = shift.applications.some(
        (application) => application.status === ApplicationStatus.ACCEPTED
      );

      return (
        hasAccepted &&
        shift.startTime >= now &&
        shift.startTime <= windowEnd &&
        shift.status !== ShiftStatus.CANCELLED
      );
    })
    .sort((left, right) => left.startTime.getTime() - right.startTime.getTime());
}

export function getApplicationDisplayStatus(
  status: ApplicationStatus
): "NEW" | "REVIEWED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "NEW";
    case ApplicationStatus.ACCEPTED:
      return "ACCEPTED";
    case ApplicationStatus.REJECTED:
      return "REJECTED";
    case ApplicationStatus.WITHDRAWN:
      return "WITHDRAWN";
    default:
      return "REVIEWED";
  }
}

export type SerializedCompanyShift = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  city: string | null;
  state: string | null;
  location: string;
  status: ShiftStatus;
  applicantCount: number;
  openPositions: number;
};

export function filterSerializedShiftsByTab(
  shifts: SerializedCompanyShift[],
  tab: CompanyDashboardShiftTab,
  now: Date = new Date()
) {
  return shifts.filter((shift) => {
    const endTime = new Date(shift.endTime);

    switch (tab) {
      case "open":
        return isActiveCompanyShiftStatus(shift.status);
      case "filled":
        return shift.status === ShiftStatus.FILLED;
      case "past":
        return (
          shift.status === ShiftStatus.COMPLETED ||
          (endTime < now && shift.status !== ShiftStatus.CANCELLED)
        );
      case "cancelled":
        return shift.status === ShiftStatus.CANCELLED;
      case "all":
      default:
        return true;
    }
  });
}

export function serializeCompanyDashboardShift(
  shift: CompanyShiftRecord
): SerializedCompanyShift {
  return {
    id: shift.id,
    title: shift.title,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime.toISOString(),
    city: shift.city,
    state: shift.state,
    location: shift.location,
    status: shift.status,
    applicantCount: getShiftApplicantCount(shift),
    openPositions: getShiftOpenPositions(shift),
  };
}
