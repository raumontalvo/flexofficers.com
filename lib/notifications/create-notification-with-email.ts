import type { PrismaClient } from "@/app/generated/prisma/client";
import {
  isNotificationEmailConfigured,
  sendNotificationEmail,
} from "@/lib/notifications/send-notification-email";

export type NotificationEmailType =
  | "new_application"
  | "application_accepted"
  | "application_rejected"
  | "new_company_invite"
  | "invite_accepted"
  | "invite_declined"
  | "shift_update"
  | "shift_canceled";

export const NOTIFICATION_EMAIL_SUBJECTS: Record<NotificationEmailType, string> = {
  new_application: "New application",
  application_accepted: "Application accepted",
  application_rejected: "Application rejected",
  new_company_invite: "New company invite",
  invite_accepted: "Invite accepted",
  invite_declined: "Invite declined",
  shift_update: "Shift update",
  shift_canceled: "Shift canceled",
};

const NOTIFICATION_LINK_PATHS: Record<NotificationEmailType, string> = {
  new_application: "/company/applications",
  application_accepted: "/officer/applications",
  application_rejected: "/officer/applications",
  new_company_invite: "/officer/invites",
  invite_accepted: "/company/applications",
  invite_declined: "/company/applications",
  shift_update: "/officer/upcoming-shifts",
  shift_canceled: "/officer/upcoming-shifts",
};

type NotificationDb = Pick<PrismaClient, "notification" | "user">;

export type CreateNotificationWithEmailInput = {
  userId: string;
  title: string;
  message: string;
  type: NotificationEmailType;
  linkUrl?: string;
};

type SendNotificationEmailFn = typeof sendNotificationEmail;

function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://flexofficers.com"
  );
}

export function getNotificationEmailSubject(type: NotificationEmailType) {
  return NOTIFICATION_EMAIL_SUBJECTS[type];
}

export function getNotificationLinkUrl(
  type: NotificationEmailType,
  linkUrl?: string
) {
  if (linkUrl) {
    return linkUrl.startsWith("http")
      ? linkUrl
      : `${getAppBaseUrl()}${linkUrl.startsWith("/") ? linkUrl : `/${linkUrl}`}`;
  }

  return `${getAppBaseUrl()}${NOTIFICATION_LINK_PATHS[type]}`;
}

async function deliverNotificationEmail(
  db: NotificationDb,
  input: CreateNotificationWithEmailInput,
  sendEmail: SendNotificationEmailFn
) {
  try {
    if (!isNotificationEmailConfigured()) {
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        email: true,
        emailNotificationsEnabled: true,
      },
    });

    const recipientEmail = user?.email?.trim();

    if (!recipientEmail || user?.emailNotificationsEnabled === false) {
      return;
    }

    await sendEmail({
      to: recipientEmail,
      subject: getNotificationEmailSubject(input.type),
      title: input.title,
      message: input.message,
      linkUrl: getNotificationLinkUrl(input.type, input.linkUrl),
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}

export async function createNotificationWithEmail(
  db: NotificationDb,
  input: CreateNotificationWithEmailInput,
  options?: {
    sendEmail?: SendNotificationEmailFn;
  }
) {
  const notification = await db.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
    },
  });

  const sendEmail = options?.sendEmail ?? sendNotificationEmail;
  void deliverNotificationEmail(db, input, sendEmail);

  return notification;
}

export async function createNotificationsWithEmail(
  db: NotificationDb,
  inputs: CreateNotificationWithEmailInput[],
  options?: {
    sendEmail?: SendNotificationEmailFn;
  }
) {
  return Promise.all(
    inputs.map((input) => createNotificationWithEmail(db, input, options))
  );
}
