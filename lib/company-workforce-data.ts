import type { ShiftStatus } from "@/app/generated/prisma/enums";
import type { CompanyAcceptedOfficerRecord } from "@/lib/officer-fields";
import { formatShiftScheduleParts } from "@/lib/format-shift";
import { formatShiftCityState } from "@/lib/format-shift";

export type WorkforceShiftFilter = "" | "upcoming" | "completed";

export type CompanyWorkforceOfficer = {
  applicationId: string;
  officer: CompanyAcceptedOfficerRecord & {
    email: string;
  };
};

export type CompanyShiftWorkforceGroup = {
  shift: {
    id: string;
    title: string;
    location: string;
    city: string | null;
    state: string | null;
    startTime: string;
    endTime: string;
    positionsNeeded: number;
    status: ShiftStatus;
    hourlyRate: string;
  };
  officers: CompanyWorkforceOfficer[];
  filledCount: number;
};

export function getWorkforceShiftTiming(
  shiftStatus: ShiftStatus,
  endTime: string
): "upcoming" | "completed" | "cancelled" {
  if (shiftStatus === "CANCELLED") {
    return "cancelled";
  }

  if (shiftStatus === "COMPLETED") {
    return "completed";
  }

  if (new Date(endTime) < new Date()) {
    return "completed";
  }

  return "upcoming";
}

export function mapAcceptedApplication(
  application: {
    id: string;
    officer: CompanyAcceptedOfficerRecord;
    shift: {
      id: string;
      title: string;
      location: string;
      city: string | null;
      state: string | null;
      startTime: Date;
      endTime: Date;
      positionsNeeded: number;
      status: ShiftStatus;
      hourlyRate: { toString: () => string };
    };
  }
): { groupKey: string; group: CompanyShiftWorkforceGroup; officer: CompanyWorkforceOfficer } {
  const officer: CompanyWorkforceOfficer = {
    applicationId: application.id,
    officer: {
      ...application.officer,
      email: application.officer.user.email,
    },
  };

  const shift = {
    id: application.shift.id,
    title: application.shift.title,
    location: application.shift.location,
    city: application.shift.city,
    state: application.shift.state,
    startTime: application.shift.startTime.toISOString(),
    endTime: application.shift.endTime.toISOString(),
    positionsNeeded: application.shift.positionsNeeded,
    status: application.shift.status,
    hourlyRate: application.shift.hourlyRate.toString(),
  };

  return {
    groupKey: shift.id,
    group: {
      shift,
      officers: [officer],
      filledCount: 1,
    },
    officer,
  };
}

export function buildShiftWorkforceGroups(
  applications: Array<{
    id: string;
    officer: CompanyAcceptedOfficerRecord;
    shift: {
      id: string;
      title: string;
      location: string;
      city: string | null;
      state: string | null;
      startTime: Date;
      endTime: Date;
      positionsNeeded: number;
      status: ShiftStatus;
      hourlyRate: { toString: () => string };
    };
  }>
): CompanyShiftWorkforceGroup[] {
  const groups = new Map<string, CompanyShiftWorkforceGroup>();

  for (const application of applications) {
    const mapped = mapAcceptedApplication(application);
    const existing = groups.get(mapped.groupKey);

    if (existing) {
      existing.officers.push(mapped.officer);
      existing.filledCount = existing.officers.length;
      continue;
    }

    groups.set(mapped.groupKey, mapped.group);
  }

  return [...groups.values()].sort(
    (left, right) =>
      new Date(left.shift.startTime).getTime() -
      new Date(right.shift.startTime).getTime()
  );
}

export function formatShiftGroupSchedule(startTime: string, endTime: string) {
  const schedule = formatShiftScheduleParts(new Date(startTime), new Date(endTime));
  return {
    dateLabel: `${schedule.weekday}, ${schedule.monthDay}`,
    timeLabel: schedule.timeRange,
  };
}

export function formatShiftGroupLocation(shift: CompanyShiftWorkforceGroup["shift"]) {
  return formatShiftCityState(shift);
}

export function getStaffingProgress(filledCount: number, positionsNeeded: number) {
  const safeNeeded = Math.max(positionsNeeded, 1);
  const percent = Math.min(100, Math.round((filledCount / safeNeeded) * 100));
  const remaining = Math.max(positionsNeeded - filledCount, 0);
  const fullyStaffed = filledCount >= positionsNeeded;

  return {
    percent,
    remaining,
    fullyStaffed,
    label: fullyStaffed
      ? `${filledCount} / ${positionsNeeded} Filled`
      : `${filledCount} / ${positionsNeeded} Filled`,
    remainingLabel: fullyStaffed
      ? "Fully Staffed"
      : remaining === 1
        ? "1 Position Remaining"
        : `${remaining} Positions Remaining`,
  };
}

export function officerMatchesSearch(
  officer: CompanyWorkforceOfficer,
  query: string
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const fullName = `${officer.officer.firstName} ${officer.officer.lastName}`
    .trim()
    .toLowerCase();

  return fullName.includes(normalized);
}

export function filterWorkforceGroups(
  groups: CompanyShiftWorkforceGroup[],
  shiftFilter: WorkforceShiftFilter,
  officerSearch: string
): CompanyShiftWorkforceGroup[] {
  return groups
    .filter((group) => {
      const timing = getWorkforceShiftTiming(
        group.shift.status,
        group.shift.endTime
      );

      if (timing === "cancelled") {
        return false;
      }

      if (!shiftFilter) {
        return true;
      }

      return timing === shiftFilter;
    })
    .map((group) => ({
      ...group,
      officers: group.officers.filter((officer) =>
        officerMatchesSearch(officer, officerSearch)
      ),
    }))
    .filter((group) => group.officers.length > 0);
}
