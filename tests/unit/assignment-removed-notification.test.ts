import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createNotificationWithEmail,
  getNotificationEmailSubject,
  getNotificationLinkUrl,
} from "@/lib/notifications/create-notification-with-email";

describe("assignment removed officer notification", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("creates an officer notification and email when removed from a shift", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const officerUserId = "officer-user-1";
    const sendEmail = vi.fn().mockResolvedValue({
      data: { id: "email-remove-1" },
      error: null,
    });

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-remove-1",
          userId: officerUserId,
          title: "Removed from shift",
          message: "You were removed from Warehouse Security.",
          read: false,
          createdAt: new Date("2026-06-01T12:00:00.000Z"),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "officer@example.test",
          emailNotificationsEnabled: true,
        }),
      },
    };

    await createNotificationWithEmail(
      db,
      {
        userId: officerUserId,
        title: "Removed from shift",
        message: "You were removed from Warehouse Security.",
        type: "assignment_removed",
        linkUrl: "/officer/applications",
      },
      { sendEmail }
    );

    expect(db.notification.create).toHaveBeenCalledWith({
      data: {
        userId: officerUserId,
        title: "Removed from shift",
        message: "You were removed from Warehouse Security.",
      },
    });
    expect(sendEmail).toHaveBeenCalledWith({
      to: "officer@example.test",
      subject: getNotificationEmailSubject("assignment_removed"),
      title: "Removed from shift",
      message: "You were removed from Warehouse Security.",
      linkUrl: getNotificationLinkUrl(
        "assignment_removed",
        "/officer/applications"
      ),
    });
  });
});
