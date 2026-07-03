"use client";

import { useEffect, useSyncExternalStore } from "react";
import { NOTIFICATIONS_CHANGED_EVENT } from "@/lib/notifications-changed";

const unreadCountListeners = new Set<() => void>();
let unreadCountSnapshot = 0;

function subscribeUnreadCount(onStoreChange: () => void) {
  unreadCountListeners.add(onStoreChange);
  return () => {
    unreadCountListeners.delete(onStoreChange);
  };
}

function getUnreadCountSnapshot() {
  return unreadCountSnapshot;
}

function getUnreadCountServerSnapshot() {
  return 0;
}

function notifyUnreadCountListeners() {
  unreadCountListeners.forEach((listener) => listener());
}

async function refreshUnreadCount() {
  try {
    const response = await fetch("/api/notifications/unread-count", {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { count?: number };
    unreadCountSnapshot = typeof data.count === "number" ? data.count : 0;
    notifyUnreadCountListeners();
  } catch {
    // Ignore transient network errors.
  }
}

export function useUnreadNotificationCount() {
  const count = useSyncExternalStore(
    subscribeUnreadCount,
    getUnreadCountSnapshot,
    getUnreadCountServerSnapshot
  );

  useEffect(() => {
    void refreshUnreadCount();

    function handleFocus() {
      void refreshUnreadCount();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshUnreadCount();
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, handleFocus);

    const interval = window.setInterval(() => {
      void refreshUnreadCount();
    }, 60_000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, handleFocus);
      window.clearInterval(interval);
    };
  }, []);

  return count;
}
