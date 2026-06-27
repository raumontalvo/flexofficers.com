"use client";

const STORAGE_KEY = "flexofficers-hidden-notifications";

export function getHiddenNotificationIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

export function hideNotificationFromList(notificationId: string) {
  const hidden = new Set(getHiddenNotificationIds());
  hidden.add(notificationId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden]));
}
