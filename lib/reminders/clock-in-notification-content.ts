import { formatShiftCityState, formatShiftDateTime } from "@/lib/format-shift";
import type { NotificationEmailType } from "@/lib/notifications/create-notification-with-email";

export const CLOCK_IN_NOTIFICATION_TYPE: NotificationEmailType =
  "clock_in_available";
export const CLOCK_IN_NOTIFICATION_LINK_PATH = "/officer/upcoming-shifts";

export type ClockInNotificationShift = {
  title: string;
  location: string;
  city?: string | null;
  state?: string | null;
  startTime: Date;
  endTime: Date;
};

function formatShiftAddress(shift: ClockInNotificationShift) {
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

export function buildClockInAvailableNotification(input: {
  officerName: string;
  shift: ClockInNotificationShift;
}) {
  const { officerName, shift } = input;
  const locationLabel = formatShiftCityState(shift);
  const officerGreetingName = officerName.trim() || "there";

  const emailMessage = [
    `Hi ${officerGreetingName},`,
    "",
    "Clock-in is now available for your upcoming shift:",
    "",
    `Shift: ${shift.title}`,
    `Location: ${formatShiftAddress(shift)}`,
    `Time: ${formatShiftDateTime(shift.startTime)} - ${formatShiftDateTime(shift.endTime)}`,
    "",
    "Please go to your Upcoming Shift page and clock in when you arrive on site.",
  ].join("\n");

  return {
    type: CLOCK_IN_NOTIFICATION_TYPE,
    title: "Clock In Available",
    message: `Your clock-in is now open for your shift at ${locationLabel}. Please clock in from your Upcoming Shift page.`,
    emailSubject: "Clock In Available for Your Shift",
    emailMessage,
    linkUrl: CLOCK_IN_NOTIFICATION_LINK_PATH,
  };
}
