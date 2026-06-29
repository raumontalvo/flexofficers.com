import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createNotificationWithEmail,
  getNotificationEmailSubject,
  getNotificationLinkUrl,
} from "@/lib/notifications/create-notification-with-email";

describe("application withdraw company notification", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("creates a company notification when an officer withdraws", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const companyUserId = "company-user-1";
    const sendEmail = vi.fn().mockResolvedValue({
      data: { id: "email-withdraw-1" },
      error: null,
    });

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-withdraw-1",
          userId: companyUserId,
          title: "Officer withdrew application",
          message: "Alex Officer withdrew their application for Warehouse Security.",
          read: false,
          createdAt: new Date("2026-06-01T12:00:00.000Z"),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "owner@acme.test",
          emailNotificationsEnabled: true,
        }),
      },
    };

    await createNotificationWithEmail(
      db,
      {
        userId: companyUserId,
        title: "Officer withdrew application",
        message: "Alex Officer withdrew their application for Warehouse Security.",
        type: "application_withdrawn",
        linkUrl: "/company/applications",
      },
      { sendEmail }
    );

    expect(db.notification.create).toHaveBeenCalledWith({
      data: {
        userId: companyUserId,
        title: "Officer withdrew application",
        message: "Alex Officer withdrew their application for Warehouse Security.",
      },
    });
    expect(sendEmail).toHaveBeenCalledWith({
      to: "owner@acme.test",
      subject: getNotificationEmailSubject("application_withdrawn"),
      title: "Officer withdrew application",
      message: "Alex Officer withdrew their application for Warehouse Security.",
      linkUrl: getNotificationLinkUrl(
        "application_withdrawn",
        "/company/applications"
      ),
    });
  });

  it("still completes withdrawal when email delivery fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const sendEmail = vi.fn().mockRejectedValue(new Error("Resend unavailable"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-withdraw-2",
          userId: "company-user-2",
          title: "Officer withdrew application",
          message: "Alex Officer withdrew their application for Warehouse Security.",
          read: false,
          createdAt: new Date(),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "owner@acme.test",
          emailNotificationsEnabled: true,
        }),
      },
    };

    const notification = await createNotificationWithEmail(
      db,
      {
        userId: "company-user-2",
        title: "Officer withdrew application",
        message: "Alex Officer withdrew their application for Warehouse Security.",
        type: "application_withdrawn",
        linkUrl: "/company/applications",
      },
      { sendEmail }
    );

    expect(notification).toMatchObject({ id: "notification-withdraw-2" });
    expect(consoleError).toHaveBeenCalledWith(
      "[notification-email] Notification email delivery failed",
      expect.objectContaining({
        recipientUserId: "company-user-2",
        notificationType: "application_withdrawn",
      })
    );
  });
});
