const ROSTER_LINK_PATTERN = /<!--fo-roster:([^>]+)-->/;

export function buildCompanyAttendanceRosterHref(
  shiftId: string,
  officerId: string
) {
  const params = new URLSearchParams({
    shiftId,
    officerId,
  });

  return `/company/shifts?${params.toString()}`;
}

export function appendAttendanceNotificationLink(
  message: string,
  shiftId: string,
  officerId: string
) {
  const href = buildCompanyAttendanceRosterHref(shiftId, officerId);
  return `${message}<!--fo-roster:${href}-->`;
}

export function parseAttendanceNotificationLink(message: string) {
  const match = message.match(ROSTER_LINK_PATTERN);
  return match?.[1] ?? null;
}

export function stripAttendanceNotificationLink(message: string) {
  return message.replace(ROSTER_LINK_PATTERN, "").trim();
}
