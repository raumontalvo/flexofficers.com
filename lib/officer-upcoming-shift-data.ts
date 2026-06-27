import {
  calculateEstimatedShiftPay,
  formatHourlyRate,
} from "@/lib/format-shift";
import {
  getAcceptedShiftTab,
  type OfficerAcceptedShiftData,
} from "@/lib/officer-accepted-shift-data";

export type UpcomingShiftFilter = "" | "next7" | "thisMonth";
export type UpcomingShiftSort = "soonest" | "latest";
export type UpcomingUrgencyTone = "urgent" | "soon" | "relaxed";

export type UpcomingShiftSummary = {
  count: number;
  expectedEarnings: number | null;
  scheduledHours: number;
  nextShiftDate: string | null;
  nextShiftStartsIn: string | null;
};

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function isUpcomingFutureShift(
  application: OfficerAcceptedShiftData,
  now = new Date()
) {
  if (
    getAcceptedShiftTab(application.shift.status, application.shift.endTime) !==
    "upcoming"
  ) {
    return false;
  }

  return new Date(application.shift.startTime) > now;
}

export function getDaysUntilStart(startTime: string, now = new Date()) {
  const start = startOfDay(new Date(startTime));
  const today = startOfDay(now);
  return Math.round(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function formatStartsInLabel(daysUntilStart: number) {
  if (daysUntilStart <= 0) {
    return "Starts today";
  }

  if (daysUntilStart === 1) {
    return "Starts tomorrow";
  }

  return `Starts in ${daysUntilStart} days`;
}

export function getUpcomingUrgencyTone(daysUntilStart: number): UpcomingUrgencyTone {
  if (daysUntilStart <= 2) {
    return "urgent";
  }

  if (daysUntilStart <= 6) {
    return "soon";
  }

  return "relaxed";
}

export function getShiftDurationHours(startTime: string, endTime: string) {
  const durationMs =
    new Date(endTime).getTime() - new Date(startTime).getTime();
  const hours = durationMs / (1000 * 60 * 60);

  if (!Number.isFinite(hours) || hours <= 0) {
    return 0;
  }

  return hours;
}

export function formatScheduledHours(totalHours: number) {
  if (totalHours <= 0) {
    return "0 hrs";
  }

  const rounded = Math.round(totalHours * 10) / 10;
  return `${rounded} hrs`;
}

export function formatNextShiftDate(startTime: string) {
  return new Date(startTime).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function filterUpcomingShifts(
  applications: OfficerAcceptedShiftData[],
  filter: UpcomingShiftFilter,
  now = new Date()
) {
  const upcoming = applications.filter((application) =>
    isUpcomingFutureShift(application, now)
  );

  if (!filter) {
    return upcoming;
  }

  if (filter === "next7") {
    return upcoming.filter((application) => {
      const days = getDaysUntilStart(application.shift.startTime, now);
      return days >= 0 && days <= 7;
    });
  }

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return upcoming.filter((application) => {
    const start = new Date(application.shift.startTime);
    return (
      start.getMonth() === currentMonth && start.getFullYear() === currentYear
    );
  });
}

export function sortUpcomingShifts(
  applications: OfficerAcceptedShiftData[],
  sort: UpcomingShiftSort
) {
  const sorted = [...applications].sort((left, right) => {
    const leftStart = new Date(left.shift.startTime).getTime();
    const rightStart = new Date(right.shift.startTime).getTime();

    return sort === "soonest" ? leftStart - rightStart : rightStart - leftStart;
  });

  return sorted;
}

export function buildUpcomingShiftSummary(
  applications: OfficerAcceptedShiftData[],
  now = new Date()
): UpcomingShiftSummary {
  const upcoming = applications.filter((application) =>
    isUpcomingFutureShift(application, now)
  );

  let expectedEarnings = 0;
  let hasEarnings = false;
  let scheduledHours = 0;

  for (const application of upcoming) {
    const { shift } = application;
    const startTime = new Date(shift.startTime);
    const endTime = new Date(shift.endTime);
    const hourlyRate = { toString: () => shift.hourlyRate };
    const pay = calculateEstimatedShiftPay(hourlyRate, startTime, endTime);

    if (pay !== null) {
      expectedEarnings += pay;
      hasEarnings = true;
    }

    scheduledHours += getShiftDurationHours(shift.startTime, shift.endTime);
  }

  const nextShift = sortUpcomingShifts(upcoming, "soonest")[0];

  return {
    count: upcoming.length,
    expectedEarnings: hasEarnings ? expectedEarnings : null,
    scheduledHours,
    nextShiftDate: nextShift
      ? formatNextShiftDate(nextShift.shift.startTime)
      : null,
    nextShiftStartsIn: nextShift
      ? formatStartsInLabel(getDaysUntilStart(nextShift.shift.startTime, now))
      : null,
  };
}

export function formatExpectedEarnings(total: number | null) {
  if (total === null) {
    return "—";
  }

  return formatHourlyRate(total);
}
