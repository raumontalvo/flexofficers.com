import {
  formatHourlyRate,
  formatShiftDateRange,
  formatShiftDateTime,
} from "@/lib/format-shift";
import type { NotificationEmailType } from "@/lib/notifications/create-notification-with-email";

export type ShiftReminderKind = "24h" | "2h";

export type ShiftReminderShift = {
  title: string;
  location: string;
  city?: string | null;
  state?: string | null;
  hourlyRate: { toString: () => string };
  startTime: Date;
  endTime: Date;
};

export type ShiftReminderCompany = {
  companyName: string;
};

export const SHIFT_REMINDER_LINK_PATH = "/officer/accepted-shifts";

const REMINDER_CONFIG: Record<
  ShiftReminderKind,
  {
    type: NotificationEmailType;
    title: string;
    buildMessage: (shiftTitle: string, startTime: Date) => string;
    buildEmailSubject: (shiftTitle: string) => string;
  }
> = {
  "24h": {
    type: "shift_reminder_24h",
    title: "Upcoming Shift Tomorrow",
    buildMessage: (shiftTitle, startTime) =>
      `Reminder: Your shift "${shiftTitle}" starts tomorrow at ${formatShiftDateTime(startTime)}.`,
    buildEmailSubject: (shiftTitle) => `Tomorrow: ${shiftTitle} Reminder`,
  },
  "2h": {
    type: "shift_reminder_2h",
    title: "Shift Starts Soon",
    buildMessage: (shiftTitle) =>
      `Your shift "${shiftTitle}" begins in about 2 hours.`,
    buildEmailSubject: () => "Shift Starts in 2 Hours",
  },
};

function formatShiftAddress(shift: ShiftReminderShift) {
  const city = shift.city?.trim();
  const state = shift.state?.trim();

  if (city && state) {
    return `${shift.location}, ${city}, ${state}`;
  }

  if (city) {
    return `${shift.location}, ${city}`;
  }

  if (state) {
    return `${shift.location}, ${state}`;
  }

  return shift.location;
}

export function buildShiftReminderEmailMessage(
  shift: ShiftReminderShift,
  company: ShiftReminderCompany
) {
  return [
    `Shift: ${shift.title}`,
    `Company: ${company.companyName}`,
    `Address: ${formatShiftAddress(shift)}`,
    `Start: ${formatShiftDateTime(shift.startTime)}`,
    `End: ${formatShiftDateTime(shift.endTime)}`,
    `Hourly rate: ${formatHourlyRate(shift.hourlyRate)}/hr`,
    `Schedule: ${formatShiftDateRange(shift.startTime, shift.endTime)}`,
  ].join("\n");
}

export function buildShiftReminderNotification(input: {
  kind: ShiftReminderKind;
  shift: ShiftReminderShift;
  company: ShiftReminderCompany;
}) {
  const config = REMINDER_CONFIG[input.kind];

  return {
    type: config.type,
    title: config.title,
    message: config.buildMessage(input.shift.title, input.shift.startTime),
    emailSubject: config.buildEmailSubject(input.shift.title),
    emailMessage: buildShiftReminderEmailMessage(input.shift, input.company),
    linkUrl: SHIFT_REMINDER_LINK_PATH,
  };
}

export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
export const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
export const REMINDER_WINDOW_MS = 30 * 60 * 1000;

export function isShiftReminderDue(
  shiftStartTime: Date,
  now: Date,
  leadTimeMs: number,
  windowMs: number = REMINDER_WINDOW_MS
) {
  const targetTime = shiftStartTime.getTime() - leadTimeMs;
  const windowStart = now.getTime();
  const windowEnd = now.getTime() + windowMs;

  return targetTime >= windowStart && targetTime <= windowEnd;
}
