import { describe, expect, it } from "vitest";
import {
  countUnreadNotifications,
  filterNotifications,
  formatNotificationTimeAgo,
  formatNotificationsPaginationRange,
  mapOfficerNotification,
} from "@/lib/officer-notification-data";

describe("officer notification data helpers", () => {
  it("maps application and shift notifications with actions", () => {
    const accepted = mapOfficerNotification({
      id: "n-1",
      title: "Application accepted",
      message: "Your application was accepted for Warehouse Security.",
      read: false,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(accepted.category).toBe("applications");
    expect(accepted.kind).toBe("application_accepted");
    expect(accepted.tone).toBe("success");
    expect(accepted.iconVariant).toBe("check");
    expect(accepted.typeLabel).toBe("APPLICATION ACCEPTED");
    expect(accepted.primaryAction.label).toBe("View Details");

    const shift = mapOfficerNotification({
      id: "n-2",
      title: "Shift starts tomorrow",
      message: "Your upcoming shift begins tomorrow at 6:00 PM.",
      read: true,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(shift.category).toBe("shifts");
    expect(shift.kind).toBe("shift_starts_tomorrow");
    expect(shift.iconVariant).toBe("bell");
    expect(shift.primaryAction.label).toBe("View Shift");
    expect(shift.primaryAction.href).toBe("/officer/upcoming-shifts");

    const cancelled = mapOfficerNotification({
      id: "n-3",
      title: "Shift cancelled",
      message:
        'The shift "Warehouse Security" was cancelled by the company.<!--fo-my-shifts:/officer/accepted-shifts?tab=cancelled&shiftId=shift-1-->',
      read: false,
      createdAt: new Date("2026-06-02T12:00:00.000Z"),
    });

    expect(cancelled.kind).toBe("shift_cancelled");
    expect(cancelled.message).toBe(
      'The shift "Warehouse Security" was cancelled by the company.'
    );
    expect(cancelled.primaryAction).toEqual({
      label: "View Shift",
      href: "/officer/accepted-shifts?tab=cancelled&shiftId=shift-1",
    });
  });

  it("filters tabs and formats time ago", () => {
    const notifications = [
      mapOfficerNotification({
        id: "n-1",
        title: "Welcome",
        message: "Welcome to FlexOfficers.",
        read: false,
        createdAt: new Date("2026-06-01T12:00:00.000Z"),
      }),
      mapOfficerNotification({
        id: "n-2",
        title: "Application rejected",
        message: "Your application was rejected.",
        read: true,
        createdAt: new Date("2026-06-01T10:00:00.000Z"),
      }),
    ];

    expect(countUnreadNotifications(notifications)).toBe(1);
    expect(filterNotifications(notifications, "unread")).toHaveLength(1);
    expect(filterNotifications(notifications, "system")).toHaveLength(1);
    expect(
      formatNotificationTimeAgo(
        "2026-06-01T11:30:00.000Z",
        new Date("2026-06-01T12:00:00.000Z")
      )
    ).toBe("30 minutes ago");
    expect(formatNotificationsPaginationRange(1, 10, 12)).toBe(
      "Showing 1–10 of 12 notifications"
    );
  });
});
