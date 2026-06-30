import type { PrismaClient } from "@/app/generated/prisma/client";
import {
  getNotificationEmailConfigStatus,
  isNotificationEmailConfigured,
  sendNotificationEmail,
} from "@/lib/notifications/send-notification-email";

export type NotificationEmailType =
  | "new_application"
  | "application_accepted"
  | "application_rejected"
  | "application_withdrawn"
  | "new_company_invite"
  | "invite_accepted"
  | "invite_declined"
  | "shift_update"
  | "shift_canceled"
  | "shift_reminder_24h"
  | "shift_reminder_2h";

export const NOTIFICATION_EMAIL_SUBJECTS: Record<NotificationEmailType, string> = {
  new_application: "New application",
  application_accepted: "Application accepted",
  application_rejected: "Application rejected",
  application_withdrawn: "Application withdrawn",
  new_company_invite: "Company invite to apply",
  invite_accepted: "Invite accepted",
  invite_declined: "Invite declined",
  shift_update: "Shift update",
  shift_canceled: "Shift canceled",
  shift_reminder_24h: "Upcoming shift reminder",
  shift_reminder_2h: "Shift starts soon",
};

const NOTIFICATION_LINK_PATHS: Record<NotificationEmailType, string> = {
  new_application: "/company/applications",
  application_accepted: "/officer/applications",
  application_rejected: "/officer/applications",
  application_withdrawn: "/company/applications",
  new_company_invite: "/officer/invites",
  invite_accepted: "/company/applications",
  invite_declined: "/company/applications",
  shift_update: "/officer/upcoming-shifts",
  shift_canceled: "/officer/upcoming-shifts",
  shift_reminder_24h: "/officer/accepted-shifts",
  shift_reminder_2h: "/officer/accepted-shifts",
};

type NotificationDb = Pick<PrismaClient, "notification" | "user">;

export type CreateNotificationWithEmailInput = {
  userId: string;
  title: string;
  message: string;
  type: NotificationEmailType;
  linkUrl?: string;
  emailSubject?: string;
  emailMessage?: string;
  recipientEmail?: string;
};

type SendNotificationEmailFn = typeof sendNotificationEmail;

type NotificationEmailLog = {
  notificationType: NotificationEmailType;
  recipientUserId: string;
  recipientEmail?: string | null;
  resendEmailId?: string | null;
  resendError?: unknown;
  resendApiKeyConfigured?: boolean;
  emailFromConfigured?: boolean;
  emailNotificationsEnabled?: boolean;
  reason?: string;
};

function logNotificationEmail(details: NotificationEmailLog) {
  const payload = {
    ...getNotificationEmailConfigStatus(),
    ...details,
  };

  if (details.resendError || details.reason) {
    console.error("[notification-email]", payload);
    return;
  }

  console.log("[notification-email]", payload);
}

function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://flexofficers.com"
  );
}

function normalizeEmail(email: string | null | undefined) {
  const trimmed = email?.trim();
  return trimmed || null;
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
  const baseLog: NotificationEmailLog = {
    notificationType: input.type,
    recipientUserId: input.userId,
  };

  try {
    if (!isNotificationEmailConfigured()) {
      logNotificationEmail({
        ...baseLog,
        reason: "Resend is not configured (missing RESEND_API_KEY or EMAIL_FROM)",
      });
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

    const recipientEmail =
      normalizeEmail(input.recipientEmail) ?? normalizeEmail(user?.email);
    const emailNotificationsEnabled = user?.emailNotificationsEnabled !== false;

    if (!recipientEmail) {
      logNotificationEmail({
        ...baseLog,
        recipientEmail: null,
        reason: "Recipient user.email is missing",
      });
      return;
    }

    if (!emailNotificationsEnabled) {
      logNotificationEmail({
        ...baseLog,
        recipientEmail,
        emailNotificationsEnabled: false,
        reason: "emailNotificationsEnabled is false",
      });
      return;
    }

    const result = await sendEmail({
      to: recipientEmail,
      subject: input.emailSubject ?? getNotificationEmailSubject(input.type),
      title: input.title,
      message: input.emailMessage ?? input.message,
      linkUrl: getNotificationLinkUrl(input.type, input.linkUrl),
    });

    if (result?.error) {
      logNotificationEmail({
        ...baseLog,
        recipientEmail,
        emailNotificationsEnabled: true,
        resendError: result.error,
      });
      return;
    }

    logNotificationEmail({
      ...baseLog,
      recipientEmail,
      emailNotificationsEnabled: true,
      resendEmailId: result?.data?.id ?? null,
    });
  } catch (error) {
    logNotificationEmail({
      ...baseLog,
      resendError: error,
    });
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
  await deliverNotificationEmail(db, input, sendEmail);

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
