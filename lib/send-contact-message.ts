import { Resend } from "resend";

const CONTACT_INBOX =
  process.env.CONTACT_TO_EMAIL?.trim() || "flexofficers@gmail.com";

export function isContactEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim()
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type ContactMessageInput = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(input: ContactMessageInput) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const emailFrom = process.env.EMAIL_FROM?.trim();

  const safeName = escapeHtml(input.fullName);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");

  const text = [
    "New FlexOfficers contact form submission",
    "",
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    "",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 560px;">
      <h2 style="margin: 0 0 16px; font-size: 20px;">New contact form submission</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
      <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${safeSubject}</p>
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0;">${safeMessage}</p>
    </div>
  `;

  if (!resendApiKey || !emailFrom) {
    return {
      ok: false as const,
      error: "Contact email is not configured.",
    };
  }

  const resend = new Resend(resendApiKey);
  const result = await resend.emails.send({
    from: emailFrom,
    to: CONTACT_INBOX,
    replyTo: input.email,
    subject: `[FlexOfficers Contact] ${input.subject}`,
    html,
    text,
  });

  if (result.error) {
    return { ok: false as const, error: result.error.message };
  }

  return { ok: true as const, delivered: true };
}
