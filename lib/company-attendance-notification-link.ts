const ROSTER_LINK_PATTERN = /<!--fo-roster:([^>]+)-->/;

export function buildCompanyShiftsHref(shiftId: string, officerId?: string) {
  const params = new URLSearchParams({
    shiftId,
  });

  if (officerId) {
    params.set("officerId", officerId);
  }

  return `/company/shifts?${params.toString()}`;
}

export function buildCompanyAttendanceRosterHref(
  shiftId: string,
  officerId: string
) {
  return buildCompanyShiftsHref(shiftId, officerId);
}

export function appendCompanyShiftNotificationLink(
  message: string,
  shiftId: string,
  officerId?: string
) {
  const href = buildCompanyShiftsHref(shiftId, officerId);
  return `${message}<!--fo-roster:${href}-->`;
}

export function appendAttendanceNotificationLink(
  message: string,
  shiftId: string,
  officerId: string
) {
  return appendCompanyShiftNotificationLink(message, shiftId, officerId);
}

export function parseAttendanceNotificationLink(message: string) {
  const match = message.match(ROSTER_LINK_PATTERN);
  return match?.[1] ?? null;
}

export function stripAttendanceNotificationLink(message: string) {
  return message.replace(ROSTER_LINK_PATTERN, "").trim();
}
