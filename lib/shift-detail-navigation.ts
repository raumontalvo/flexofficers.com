export function isSafeInternalReturnPath(path: string): boolean {
  if (!path.startsWith("/")) {
    return false;
  }

  if (path.startsWith("//")) {
    return false;
  }

  if (path.includes("://")) {
    return false;
  }

  // Avoid bouncing between shift detail pages.
  if (/^\/shifts\/[^/?]+/.test(path)) {
    return false;
  }

  return true;
}

export function shiftDetailHref(
  shiftId: string,
  returnTo?: string | null
): string {
  const base = `/shifts/${shiftId}`;

  if (!returnTo || !isSafeInternalReturnPath(returnTo)) {
    return base;
  }

  return `${base}?from=${encodeURIComponent(returnTo)}`;
}

export function getShiftDetailReturnPath(
  from: string | null | undefined
): string | null {
  if (!from || !isSafeInternalReturnPath(from)) {
    return null;
  }

  return from;
}
