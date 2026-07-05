import type { AcceptedShiftTab } from "@/lib/officer-accepted-shift-data";

const MY_SHIFTS_LINK_PATTERN = /<!--fo-my-shifts:([^>]+)-->/;

export function buildOfficerMyShiftsHref(options?: {
  tab?: AcceptedShiftTab;
  shiftId?: string;
}) {
  const params = new URLSearchParams();

  if (options?.tab) {
    params.set("tab", options.tab);
  }

  if (options?.shiftId) {
    params.set("shiftId", options.shiftId);
  }

  const query = params.toString();
  return query ? `/officer/accepted-shifts?${query}` : "/officer/accepted-shifts";
}

export function appendOfficerShiftNotificationLink(
  message: string,
  options?: { tab?: AcceptedShiftTab; shiftId?: string }
) {
  const href = buildOfficerMyShiftsHref(options);
  return `${message}<!--fo-my-shifts:${href}-->`;
}

export function parseOfficerShiftNotificationLink(message: string) {
  const match = message.match(MY_SHIFTS_LINK_PATTERN);
  return match?.[1] ?? null;
}

export function stripOfficerShiftNotificationLink(message: string) {
  return message.replace(MY_SHIFTS_LINK_PATTERN, "").trim();
}
