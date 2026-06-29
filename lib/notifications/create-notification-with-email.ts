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

function logNotificationEmailDelivery(
  level: "log" | "warn" | "error",
  message: string,
  details: Record<string, unknown>
) {
  const payload = {
    ...getNotificationEmailConfigStatus(),
    ...details,
  };

  if (level === "warn") {
    console.warn(`[notification-email] ${message}`, payload);
    return;
  }

  if (level === "error") {
    console.error(`[notification-email] ${message}`, payload);
    return;
  }

  console.log(`[notification-email] ${message}`, payload);
}

async function deliverNotificationEmail(
  db: NotificationDb,
  input: CreateNotificationWithEmailInput,
  sendEmail: SendNotificationEmailFn
) {
  const deliveryContext = {
    recipientUserId: input.userId,
    notificationType: input.type,
  };

  try {
    logNotificationEmailDelivery(
      "log",
      "Starting notification email delivery",
      deliveryContext
    );

    if (!isNotificationEmailConfigured()) {
      logNotificationEmailDelivery(
        "warn",
        "Skipped email delivery because Resend is not configured",
        deliveryContext
      );
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
    const emailNotificationsEnabled = user?.emailNotificationsEnabled !== false;

    logNotificationEmailDelivery("log", "Resolved notification recipient", {
      ...deliveryContext,
      recipientEmailExists: Boolean(recipientEmail),
      emailNotificationsEnabled,
    });

    if (!recipientEmail) {
      logNotificationEmailDelivery(
        "warn",
        "Skipped email delivery because user.email is missing (account email is used for notifications, not company profile email)",
        deliveryContext
      );
      return;
    }

    if (!emailNotificationsEnabled) {
      logNotificationEmailDelivery(
        "warn",
        "Skipped email delivery because emailNotificationsEnabled is false",
        {
          ...deliveryContext,
          recipientEmailExists: true,
          emailNotificationsEnabled: false,
        }
      );
      return;
    }

    const result = await sendEmail({
      to: recipientEmail,
      subject: getNotificationEmailSubject(input.type),
      title: input.title,
      message: input.message,
      linkUrl: getNotificationLinkUrl(input.type, input.linkUrl),
    });

    if (result?.error) {
      logNotificationEmailDelivery("error", "Resend returned an error", {
        ...deliveryContext,
        recipientEmailExists: true,
        emailNotificationsEnabled: true,
        resendError: result.error,
      });
      return;
    }

    logNotificationEmailDelivery("log", "Resend email sent successfully", {
      ...deliveryContext,
      recipientEmailExists: true,
      emailNotificationsEnabled: true,
      resendEmailId: result?.data?.id ?? null,
    });
  } catch (error) {
    logNotificationEmailDelivery("error", "Notification email delivery failed", {
      ...deliveryContext,
      error,
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
