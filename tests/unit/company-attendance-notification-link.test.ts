import { describe, expect, it } from "vitest";
import {
  appendAttendanceNotificationLink,
  appendCompanyShiftNotificationLink,
  buildCompanyAttendanceRosterHref,
  parseAttendanceNotificationLink,
  stripAttendanceNotificationLink,
} from "@/lib/company-attendance-notification-link";
import { mapCompanyNotification } from "@/lib/company-notification-data";

describe("company attendance notification links", () => {
  it("builds roster hrefs with shift and officer ids", () => {
    expect(
      buildCompanyAttendanceRosterHref("shift-1", "officer-1")
    ).toBe("/company/shifts?shiftId=shift-1&officerId=officer-1");
  });

  it("embeds and parses roster links from notification messages", () => {
    const message = appendAttendanceNotificationLink(
      "Alex clocked in for Warehouse Security at 8:00 PM.",
      "shift-1",
      "officer-1"
    );

    expect(parseAttendanceNotificationLink(message)).toBe(
      "/company/shifts?shiftId=shift-1&officerId=officer-1"
    );
    expect(stripAttendanceNotificationLink(message)).toBe(
      "Alex clocked in for Warehouse Security at 8:00 PM."
    );
  });

  it("maps attendance notifications to roster View Details actions", () => {
    const clockedIn = mapCompanyNotification({
      id: "n-1",
      title: "Officer Clocked In",
      message: appendAttendanceNotificationLink(
        "Alex clocked in for Warehouse Security at 8:00 PM.",
        "shift-1",
        "officer-1"
      ),
      read: false,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(clockedIn.kind).toBe("officer_clocked_in");
    expect(clockedIn.category).toBe("shifts");
    expect(clockedIn.message).toBe(
      "Alex clocked in for Warehouse Security at 8:00 PM."
    );
    expect(clockedIn.primaryAction).toEqual({
      label: "View Details",
      href: "/company/shifts?shiftId=shift-1&officerId=officer-1",
    });

    const clockedOut = mapCompanyNotification({
      id: "n-2",
      title: "Officer Clocked Out",
      message: appendAttendanceNotificationLink(
        "Alex clocked out of Warehouse Security. Clock in: 8:00 PM. Clock out: 4:00 AM.",
        "shift-2",
        "officer-2"
      ),
      read: true,
      createdAt: new Date("2026-06-02T12:00:00.000Z"),
    });

    expect(clockedOut.kind).toBe("officer_clocked_out");
    expect(clockedOut.primaryAction).toEqual({
      label: "View Details",
      href: "/company/shifts?shiftId=shift-2&officerId=officer-2",
    });
  });

  it("maps officer cancelled assignment notifications to company My Shifts", () => {
    const cancelledAssignment = mapCompanyNotification({
      id: "n-3",
      title: "Officer cancelled assignment",
      message: appendCompanyShiftNotificationLink(
        "Alex cancelled their assignment for Warehouse Security.",
        "shift-3"
      ),
      read: false,
      createdAt: new Date("2026-06-03T12:00:00.000Z"),
    });

    expect(cancelledAssignment.kind).toBe("officer_cancelled_assignment");
    expect(cancelledAssignment.category).toBe("shifts");
    expect(cancelledAssignment.message).toBe(
      "Alex cancelled their assignment for Warehouse Security."
    );
    expect(cancelledAssignment.primaryAction).toEqual({
      label: "View Details",
      href: "/company/shifts?shiftId=shift-3",
    });
  });
});
