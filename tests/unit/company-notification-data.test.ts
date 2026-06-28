import { describe, expect, it } from "vitest";
import {
  filterCompanyNotifications,
  mapCompanyNotification,
} from "@/lib/company-notification-data";

describe("company notification data helpers", () => {
  it("maps invite response notifications with applicant actions", () => {
    const accepted = mapCompanyNotification({
      id: "n-1",
      title: "Invitation Accepted",
      message: "John Smith accepted your invitation to Warehouse Security.",
      read: false,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(accepted.category).toBe("applicants");
    expect(accepted.kind).toBe("invite_accepted");
    expect(accepted.tone).toBe("success");
    expect(accepted.primaryAction).toEqual({
      label: "View Applicants",
      href: "/company/applications",
    });

    const declined = mapCompanyNotification({
      id: "n-2",
      title: "Invitation Declined",
      message: "Jane Doe declined your invitation to Event Security.",
      read: true,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(declined.kind).toBe("invite_declined");
    expect(declined.tone).toBe("danger");
  });

  it("filters notifications by tab", () => {
    const notifications = [
      mapCompanyNotification({
        id: "n-1",
        title: "Invitation Accepted",
        message: "Accepted invite.",
        read: false,
        createdAt: new Date("2026-06-01T12:00:00.000Z"),
      }),
      mapCompanyNotification({
        id: "n-2",
        title: "Platform update",
        message: "A new FlexOfficers announcement is available.",
        read: true,
        createdAt: new Date("2026-06-02T12:00:00.000Z"),
      }),
    ];

    expect(filterCompanyNotifications(notifications, "unread")).toHaveLength(1);
    expect(filterCompanyNotifications(notifications, "applicants")).toHaveLength(1);
    expect(filterCompanyNotifications(notifications, "system")).toHaveLength(1);
  });
});
