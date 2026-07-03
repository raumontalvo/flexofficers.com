import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import type { PrismaClient } from "@/app/generated/prisma/client";
import { CLOCK_IN_OPEN_WINDOW_MS } from "@/lib/attendance";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";
import { buildClockInAvailableNotification } from "@/lib/reminders/clock-in-notification-content";

export type ProcessClockInNotificationsResult = {
  processedAt: string;
  sent: number;
  skipped: number;
};

const applicationInclude = {
  shift: true,
  officer: {
    include: {
      user: true,
    },
  },
} as const;

type ClockInNotificationApplication = {
  id: string;
  officer: {
    firstName: string;
    lastName: string;
    user: { id: string };
  };
  shift: {
    title: string;
    location: string;
    city: string | null;
    state: string | null;
    startTime: Date;
    endTime: Date;
  };
};

async function sendClockInNotification(
  db: PrismaClient,
  application: ClockInNotificationApplication,
  processedAt: Date,
  options?: {
    createNotification?: typeof createNotificationWithEmail;
  }
) {
  const createNotification =
    options?.createNotification ?? createNotificationWithEmail;

  const officerName =
    `${application.officer.firstName} ${application.officer.lastName}`.trim();
  const notification = buildClockInAvailableNotification({
    officerName,
    shift: application.shift,
  });

  return db.$transaction(async (tx) => {
    // Atomically claim the notification so concurrent job runs never send twice.
    const claim = await tx.application.updateMany({
      where: {
        id: application.id,
        status: ApplicationStatus.ACCEPTED,
        clockInAt: null,
        clockInNotificationSentAt: null,
        shift: {
          status: {
            notIn: [ShiftStatus.CANCELLED, ShiftStatus.COMPLETED],
          },
        },
      },
      data: {
        clockInNotificationSentAt: processedAt,
      },
    });

    if (claim.count === 0) {
      return false;
    }

    await createNotification(tx, {
      userId: application.officer.user.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      linkUrl: notification.linkUrl,
      emailSubject: notification.emailSubject,
      emailMessage: notification.emailMessage,
    });

    return true;
  });
}

export async function processClockInNotifications(
  db: PrismaClient,
  options?: {
    now?: Date;
    createNotification?: typeof createNotificationWithEmail;
  }
): Promise<ProcessClockInNotificationsResult> {
  const now = options?.now ?? new Date();
  const windowOpensBy = new Date(now.getTime() + CLOCK_IN_OPEN_WINDOW_MS);

  const applications = await db.application.findMany({
    where: {
      status: ApplicationStatus.ACCEPTED,
      clockInAt: null,
      clockInNotificationSentAt: null,
      shift: {
        status: {
          notIn: [ShiftStatus.CANCELLED, ShiftStatus.COMPLETED],
        },
        // Clock-in opens one hour before start: startTime - 1h <= now.
        startTime: {
          lte: windowOpensBy,
        },
        // Only notify shifts that have not ended, so historical shifts that
        // predate this feature never trigger a backfill of stale notifications.
        endTime: {
          gte: now,
        },
      },
    },
    include: applicationInclude,
  });

  let sent = 0;
  let skipped = 0;

  for (const application of applications) {
    const wasSent = await sendClockInNotification(db, application, now, options);

    if (wasSent) {
      sent += 1;
    } else {
      skipped += 1;
    }
  }

  return {
    processedAt: now.toISOString(),
    sent,
    skipped,
  };
}

export function isClockInNotificationJobAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${cronSecret}`;
}
