import { Resend } from "resend";

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

export function isNotificationEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim()
  );
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
    return;
  }

  const resend = new Resend(resendApiKey);
  const safeTitle = escapeHtml(title);
  const safeMessage = formatMessageHtml(message);
  const safeLinkUrl = escapeHtml(linkUrl);
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://flexofficers.com";

  await resend.emails.send({
    from: emailFrom,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 560px;">
        <p style="margin: 0 0 24px; font-size: 20px; font-weight: 700; color: #1d4ed8;">
          FlexOfficers
        </p>
        <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700;">
          ${safeTitle}
        </h2>
        <p style="margin: 0 0 24px; font-size: 16px;">
          ${safeMessage}
        </p>
        <p style="margin: 0 0 24px;">
          <a
            href="${safeLinkUrl}"
            style="display: inline-block; background: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 600;"
          >
            View in FlexOfficers
          </a>
        </p>
        <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
          — The FlexOfficers Team<br />
          <a href="${escapeHtml(appUrl)}" style="color: #1d4ed8; text-decoration: none;">
            flexofficers.com
          </a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          You&rsquo;re receiving this because you have a FlexOfficers account.
        </p>
      </div>
    `,
  });
}
