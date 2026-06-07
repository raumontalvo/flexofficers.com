import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export async function sendNotificationEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not set. Email was not sent.");
    return;
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "FlexOfficers <notifications@flexofficers.com>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${subject}</h2>
        <p>${message}</p>
        <p>
          <a href="https://www.flexofficers.com/notifications">
            View your notifications
          </a>
        </p>
      </div>
    `,
  });
}