import { Resend } from "resend";

const FOOTER_ACCOUNT_NOTICE =
  "You're receiving this because you have a FlexOfficers account.";
const FOOTER_PREFERENCES_NOTICE =
  "Manage notification preferences in your FlexOfficers account.";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMessageHtml(message: string) {
  return escapeHtml(message).replaceAll("\n", "<br />");
}

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://flexofficers.com"
  );
}

export function getSupportEmail() {
  return process.env.SUPPORT_EMAIL?.trim() || null;
}

export function normalizeEmailSubject(subject: string) {
  const trimmed = subject.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return "FlexOfficers notification";
  }

  if (trimmed === trimmed.toUpperCase()) {
    return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
  }

  return trimmed;
}

export function buildNotificationEmailContent({
  title,
  message,
  linkUrl,
}: {
  title: string;
  message: string;
  linkUrl: string;
}) {
  const appUrl = getAppUrl();
  const safeTitle = escapeHtml(title);
  const safeMessage = formatMessageHtml(message);
  const safeLinkUrl = escapeHtml(linkUrl);
  const safeAppUrl = escapeHtml(appUrl);

  const text = [
    "FlexOfficers",
    "",
    title,
    "",
    message,
    "",
    `View details: ${linkUrl}`,
    "",
    "— The FlexOfficers Team",
    appUrl,
    "",
    FOOTER_ACCOUNT_NOTICE,
    FOOTER_PREFERENCES_NOTICE,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 560px;">
      <p style="margin: 0 0 20px; font-size: 16px; font-weight: 600; color: #1d4ed8;">
        FlexOfficers
      </p>
      <p style="margin: 0 0 8px; font-size: 18px; font-weight: 600;">
        ${safeTitle}
      </p>
      <p style="margin: 0 0 20px; font-size: 15px;">
        ${safeMessage}
      </p>
      <p style="margin: 0 0 24px; font-size: 15px;">
        <a href="${safeLinkUrl}" style="color: #1d4ed8; text-decoration: underline;">
          View details in FlexOfficers
        </a>
      </p>
      <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">
        — The FlexOfficers Team<br />
        <a href="${safeAppUrl}" style="color: #1d4ed8; text-decoration: underline;">
          flexofficers.com
        </a>
      </p>
      <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8;">
        ${escapeHtml(FOOTER_ACCOUNT_NOTICE)}
      </p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        ${escapeHtml(FOOTER_PREFERENCES_NOTICE)}
      </p>
    </div>
  `.trim();

  return { html, text };
}

export function isNotificationEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim()
  );
}

export function getNotificationEmailConfigStatus() {
  return {
    resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    emailFromConfigured: Boolean(process.env.EMAIL_FROM?.trim()),
    supportEmailConfigured: Boolean(getSupportEmail()),
  };
}

export async function sendNotificationEmail({
  to,
  subject,
  title,
  message,
  linkUrl,
}: {
  to: string;
  subject: string;
  title: string;
  message: string;
  linkUrl: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const emailFrom = process.env.EMAIL_FROM?.trim();

  if (!resendApiKey || !emailFrom) {
    return {
      data: null,
      error: {
        message: "Resend is not configured (missing RESEND_API_KEY or EMAIL_FROM).",
      },
    };
  }

  const resend = new Resend(resendApiKey);
  const normalizedSubject = normalizeEmailSubject(subject);
  const { html, text } = buildNotificationEmailContent({
    title,
    message,
    linkUrl,
  });
  const supportEmail = getSupportEmail();

  return resend.emails.send({
    from: emailFrom,
    to,
    subject: normalizedSubject,
    html,
    text,
    ...(supportEmail ? { replyTo: supportEmail } : {}),
  });
}
