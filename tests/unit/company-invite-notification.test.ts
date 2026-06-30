import { afterEach, describe, expect, it, vi } from "vitest";
import { buildOfficerInviteNotificationPayload } from "@/lib/company-invite-workflow";
import {
  createNotificationWithEmail,
  getNotificationLinkUrl,
} from "@/lib/notifications/create-notification-with-email";

describe("company invite officer notification", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("emails the officer when a company sends an invite to apply", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const payload = buildOfficerInviteNotificationPayload({
      companyName: "Acme Security",
      shiftTitle: "Night Patrol",
      message: "We need reliable coverage.",
    });
    const sendEmail = vi.fn().mockResolvedValue({
      data: { id: "email-invite-1" },
      error: null,
    });
    const officerUserId = "officer-user-1";

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-invite-1",
          userId: officerUserId,
          title: payload.title,
          message: payload.message,
          read: false,
          createdAt: new Date("2026-06-01T12:00:00.000Z"),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "officer@example.com",
          emailNotificationsEnabled: true,
        }),
      },
    };

    await createNotificationWithEmail(
      db,
      {
        userId: officerUserId,
        type: "new_company_invite",
        linkUrl: "/officer/invites",
        ...payload,
      },
      { sendEmail }
    );

    expect(sendEmail).toHaveBeenCalledWith({
      to: "officer@example.com",
      subject: "Acme Security sent you an invite to apply",
      title: "Company Invite to Apply",
      message: payload.emailMessage,
      linkUrl: getNotificationLinkUrl("new_company_invite", "/officer/invites"),
    });
  });

  it("uses the explicit profile email when provided", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "FlexOfficers <notifications@flexofficers.com>");

    const sendEmail = vi.fn().mockResolvedValue({
      data: { id: "email-invite-2" },
      error: null,
    });

    const db = {
      notification: {
        create: vi.fn().mockResolvedValue({
          id: "notification-invite-2",
          userId: "officer-user-2",
          title: "Company Invite to Apply",
          message: "Acme Security invited you to: Night Patrol",
          read: false,
          createdAt: new Date("2026-06-01T12:00:00.000Z"),
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          email: "old@example.com",
          emailNotificationsEnabled: true,
        }),
      },
    };

    await createNotificationWithEmail(
      db,
      {
        userId: "officer-user-2",
        recipientEmail: "officer@profile.test",
        title: "Company Invite to Apply",
        message: "Acme Security invited you to: Night Patrol",
        emailSubject: "Acme Security sent you an invite to apply",
        emailMessage:
          "Acme Security has sent you an invite to apply for Night Patrol.",
        type: "new_company_invite",
        linkUrl: "/officer/invites",
      },
      { sendEmail }
    );

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "officer@profile.test",
      })
    );
  });
});
