import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildNotificationEmailContent,
  getSupportEmail,
  normalizeEmailSubject,
} from "@/lib/notifications/send-notification-email";

describe("send notification email content", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds html and text versions with preference footer", () => {
    const { html, text } = buildNotificationEmailContent({
      title: "New application received",
      message: "Alex Officer applied to Warehouse Security.",
      linkUrl: "https://flexofficers.com/company/applications",
    });

    expect(text).toContain("New application received");
    expect(text).toContain("Alex Officer applied to Warehouse Security.");
    expect(text).toContain(
      "View details: https://flexofficers.com/company/applications"
    );
    expect(text).toContain(
      "Manage notification preferences in your FlexOfficers account."
    );
    expect(html).toContain("View details in FlexOfficers");
    expect(html).toContain(
      "Manage notification preferences in your FlexOfficers account."
    );
    expect(html).not.toContain("View in FlexOfficers");
  });

  it("normalizes all-caps subjects", () => {
    expect(normalizeEmailSubject("NEW APPLICATION")).toBe("New application");
    expect(normalizeEmailSubject("Application accepted")).toBe(
      "Application accepted"
    );
  });

  it("reads optional support email from env", () => {
    vi.stubEnv("SUPPORT_EMAIL", "support@flexofficers.com");
    expect(getSupportEmail()).toBe("support@flexofficers.com");
  });
});
