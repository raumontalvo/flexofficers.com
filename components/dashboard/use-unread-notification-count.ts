"use client";

import { useCallback, useEffect, useState } from "react";
import { NOTIFICATIONS_CHANGED_EVENT } from "@/lib/notifications-changed";

export function useUnreadNotificationCount() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/unread-count", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { count?: number };
      setCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      // Ignore transient network errors.
    }
  }, []);

  useEffect(() => {
    refresh();

    function handleFocus() {
      refresh();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);

    const interval = window.setInterval(refresh, 60_000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
      window.clearInterval(interval);
    };
  }, [refresh]);

  return count;
}
