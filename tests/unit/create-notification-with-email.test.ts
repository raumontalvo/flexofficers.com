import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createNotificationWithEmail,
  getNotificationEmailSubject,
  getNotificationLinkUrl,
} from "@/lib/notifications/create-notification-with-email";
import { isNotificationEmailConfigured } from "@/lib/notifications/send-notification-email";

async function flushAsyncWork() {
  await new Promise((resolve) => setImmediate(resolve));
}

describe("createNotificationWithEmail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("creates the in-app notification and sends email when enabled", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const sendEmail = vi.fn().mockResolvedValue(undefined);
    const notification = {
      id: "notification-1",
      userId: "user-1",
      title: "Application accepted",
      message: "Your application for Night Patrol was accepted.",
      read: false,
      createdAt: new Date("2026-06-01T12:00:00.000Z"),
    };

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue(notification),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "officer@example.com",
          emailNotificationsEnabled: true,
        }),
      },
    };

    const result = await createNotificationWithEmail(
      db,
      {
        userId: "user-1",
        title: notification.title,
        message: notification.message,
        type: "application_accepted",
      },
      { sendEmail }
    );

    expect(result).toEqual(notification);
    expect(db.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        title: notification.title,
        message: notification.message,
      },
    });

    await flushAsyncWork();

    expect(sendEmail).toHaveBeenCalledWith({
      to: "officer@example.com",
      subject: "Application accepted",
      title: notification.title,
      message: notification.message,
      linkUrl: getNotificationLinkUrl("application_accepted"),
    });
  });

  it("skips email when notifications are disabled or email is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const sendEmail = vi.fn().mockResolvedValue(undefined);
    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-2",
          userId: "user-2",
          title: "Shift updated",
          message: "The shift was updated.",
          read: false,
          createdAt: new Date(),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "",
          emailNotificationsEnabled: true,
        }),
      },
    };

    await createNotificationWithEmail(
      db,
      {
        userId: "user-2",
        title: "Shift updated",
        message: "The shift was updated.",
        type: "shift_update",
      },
      { sendEmail }
    );

    await flushAsyncWork();
    expect(sendEmail).not.toHaveBeenCalled();

    db.user.findUnique.mockResolvedValue({
      email: "company@example.com",
      emailNotificationsEnabled: false,
    });

    await createNotificationWithEmail(
      db,
      {
        userId: "user-2",
        title: "New application received",
        message: "Alex applied to Warehouse Security.",
        type: "new_application",
      },
      { sendEmail }
    );

    await flushAsyncWork();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("skips email when Resend env vars are missing", async () => {
    const sendEmail = vi.fn().mockResolvedValue(undefined);
    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-4",
          userId: "user-4",
          title: "New Company Invite",
          message: "Acme Security invited you to Night Patrol.",
          read: false,
          createdAt: new Date(),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "officer@example.com",
          emailNotificationsEnabled: true,
        }),
      },
    };

    expect(isNotificationEmailConfigured()).toBe(false);

    await createNotificationWithEmail(
      db,
      {
        userId: "user-4",
        title: "New Company Invite",
        message: "Acme Security invited you to Night Patrol.",
        type: "new_company_invite",
      },
      { sendEmail }
    );

    await flushAsyncWork();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(db.user.findUnique).not.toHaveBeenCalled();
  });

  it("does not fail when Resend errors", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const sendEmail = vi.fn().mockRejectedValue(new Error("Resend unavailable"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-3",
          userId: "user-3",
          title: "New Company Invite",
          message: "Acme Security invited you to Night Patrol.",
          read: false,
          createdAt: new Date(),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "officer@example.com",
          emailNotificationsEnabled: true,
        }),
      },
    };

    await expect(
      createNotificationWithEmail(
        db,
        {
          userId: "user-3",
          title: "New Company Invite",
          message: "Acme Security invited you to Night Patrol.",
          type: "new_company_invite",
        },
        { sendEmail }
      )
    ).resolves.toMatchObject({ id: "notification-3" });

    await flushAsyncWork();

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to send notification email:",
      expect.any(Error)
    );
  });
});

describe("notification email metadata", () => {
  it("maps notification types to subjects and links", () => {
    expect(getNotificationEmailSubject("invite_declined")).toBe("Invite declined");
    expect(getNotificationEmailSubject("new_company_invite")).toBe(
      "New company invite"
    );
    expect(getNotificationLinkUrl("new_company_invite")).toContain(
      "/officer/invites"
    );
    expect(getNotificationLinkUrl("new_application")).toContain(
      "/company/applications"
    );
  });
});
