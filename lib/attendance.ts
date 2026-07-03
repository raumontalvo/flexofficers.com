import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { formatShiftCityState, formatShiftTime } from "@/lib/format-shift";

export const CLOCK_IN_OPEN_WINDOW_MS = 60 * 60 * 1000;

export type AttendanceStatus = "NOT_STARTED" | "CLOCKED_IN" | "COMPLETED";

export type AttendanceRecord = {
  clockInAt: Date | string | null;
  clockOutAt: Date | string | null;
  clockInLatitude?: number | null;
  clockInLongitude?: number | null;
  clockOutLatitude?: number | null;
  clockOutLongitude?: number | null;
};

export type ClockableApplication = AttendanceRecord & {
  status: ApplicationStatus;
  shift: {
    status: ShiftStatus;
    startTime: Date | string;
    endTime: Date | string;
    city?: string | null;
    state?: string | null;
    location: string;
  };
};

export function getAttendanceStatus(
  attendance: AttendanceRecord
): AttendanceStatus {
  if (attendance.clockInAt && attendance.clockOutAt) {
    return "COMPLETED";
  }

  if (attendance.clockInAt) {
    return "CLOCKED_IN";
  }

  return "NOT_STARTED";
}

export function isClockInTooEarly(
  shiftStartTime: Date | string,
  now = new Date()
) {
  const start = new Date(shiftStartTime);
  return start.getTime() - now.getTime() > CLOCK_IN_OPEN_WINDOW_MS;
}

export function isShiftClockEligible(
  application: Pick<ClockableApplication, "status" | "shift">
) {
  if (application.status !== ApplicationStatus.ACCEPTED) {
    return false;
  }

  if (
    application.shift.status === ShiftStatus.CANCELLED ||
    application.shift.status === ShiftStatus.COMPLETED
  ) {
    return false;
  }

  return true;
}

export function isClockInWindowOpen(
  shiftStartTime: Date | string,
  now = new Date()
) {
  const start = new Date(shiftStartTime);
  return now.getTime() >= start.getTime() - CLOCK_IN_OPEN_WINDOW_MS;
}

/**
 * Clock-in opens one hour before the shift start and stays open until the
 * officer clocks in or the shift is completed/cancelled. It intentionally does
 * NOT close at shift start time so late-arriving officers can still clock in.
 */
export function canClockIn(application: ClockableApplication, now = new Date()) {
  if (!isShiftClockEligible(application)) {
    return false;
  }

  if (getAttendanceStatus(application) !== "NOT_STARTED") {
    return false;
  }

  return isClockInWindowOpen(application.shift.startTime, now);
}

export function canClockOut(application: ClockableApplication) {
  if (application.status !== ApplicationStatus.ACCEPTED) {
    return false;
  }

  if (application.shift.status === ShiftStatus.CANCELLED) {
    return false;
  }

  return getAttendanceStatus(application) === "CLOCKED_IN";
}

export function formatAttendanceTime(value: Date | string) {
  return formatShiftTime(new Date(value));
}

export function formatAttendanceDateTime(value: Date | string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatGoogleMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function formatAttendanceLocationLabel(
  latitude: number | null | undefined,
  longitude: number | null | undefined
) {
  if (latitude === null || latitude === undefined) {
    return null;
  }

  if (longitude === null || longitude === undefined) {
    return null;
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function getAttendanceStatusLabel(status: AttendanceStatus) {
  switch (status) {
    case "CLOCKED_IN":
      return "Clocked In";
    case "COMPLETED":
      return "Completed";
    default:
      return "Not Started";
  }
}

export function getBrowserGeolocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10_000,
      }
    );
  });
}

export function formatShiftLocationLabel(shift: {
  city?: string | null;
  state?: string | null;
  location: string;
}) {
  return formatShiftCityState(shift);
}

export function buildClockInNotificationMessage(input: {
  officerName: string;
  shiftTitle: string;
  clockInAt: Date;
}) {
  return `${input.officerName} clocked in for ${input.shiftTitle} at ${formatAttendanceTime(input.clockInAt)}.`;
}

export function buildClockOutNotificationMessage(input: {
  officerName: string;
  shiftTitle: string;
  clockInAt: Date;
  clockOutAt: Date;
}) {
  return `${input.officerName} clocked out of ${input.shiftTitle}. Clock in: ${formatAttendanceTime(input.clockInAt)}. Clock out: ${formatAttendanceTime(input.clockOutAt)}.`;
}
