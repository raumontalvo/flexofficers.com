import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import type { PrismaClient } from "@/app/generated/prisma/client";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";
import {
  buildShiftReminderNotification,
  REMINDER_WINDOW_MS,
  TWENTY_FOUR_HOURS_MS,
  TWO_HOURS_MS,
  type ShiftReminderKind,
} from "@/lib/reminders/shift-reminder-content";

export type ProcessShiftRemindersResult = {
  processedAt: string;
  sent24Hour: number;
  sent2Hour: number;
  skipped24Hour: number;
  skipped2Hour: number;
};

const applicationInclude = {
  shift: {
    include: {
      company: true,
    },
  },
  officer: {
    include: {
      user: true,
    },
  },
} as const;

type ShiftReminderApplication = {
  id: string;
  officer: { user: { id: string } };
  shift: {
    title: string;
    location: string;
    city: string | null;
    state: string | null;
    hourlyRate: { toString: () => string };
    startTime: Date;
    endTime: Date;
    company: { companyName: string };
  };
};

function getShiftStartWindow(now: Date, leadTimeMs: number) {
  return {
    gte: new Date(now.getTime() + leadTimeMs),
    lte: new Date(now.getTime() + leadTimeMs + REMINDER_WINDOW_MS),
  };
}

async function sendShiftReminder(
  db: PrismaClient,
  application: ShiftReminderApplication,
  kind: ShiftReminderKind,
  processedAt: Date,
  options?: {
    createNotification?: typeof createNotificationWithEmail;
  }
) {
  const createNotification = options?.createNotification ?? createNotificationWithEmail;
  const reminder = buildShiftReminderNotification({
    kind,
    shift: application.shift,
    company: application.shift.company,
  });

  const sentAtField =
    kind === "24h" ? "shift24HourReminderSentAt" : "shift2HourReminderSentAt";

  return db.$transaction(async (tx) => {
    const claim = await tx.application.updateMany({
      where: {
        id: application.id,
        status: ApplicationStatus.ACCEPTED,
        [sentAtField]: null,
        shift: {
          status: {
            not: ShiftStatus.CANCELLED,
          },
        },
      },
      data: {
        [sentAtField]: processedAt,
      },
    });

    if (claim.count === 0) {
      return false;
    }

    await createNotification(tx, {
      userId: application.officer.user.id,
      title: reminder.title,
      message: reminder.message,
      type: reminder.type,
      linkUrl: reminder.linkUrl,
      emailSubject: reminder.emailSubject,
      emailMessage: reminder.emailMessage,
    });

    return true;
  });
}

async function processReminderKind(
  db: PrismaClient,
  kind: ShiftReminderKind,
  now: Date,
  options?: {
    createNotification?: typeof createNotificationWithEmail;
  }
) {
  const leadTimeMs = kind === "24h" ? TWENTY_FOUR_HOURS_MS : TWO_HOURS_MS;
  const sentAtField =
    kind === "24h" ? "shift24HourReminderSentAt" : "shift2HourReminderSentAt";

  const applications = await db.application.findMany({
    where: {
      status: ApplicationStatus.ACCEPTED,
      [sentAtField]: null,
      shift: {
        status: {
          not: ShiftStatus.CANCELLED,
        },
        startTime: getShiftStartWindow(now, leadTimeMs),
      },
    },
    include: applicationInclude,
  });

  let sent = 0;
  let skipped = 0;

  for (const application of applications) {
    const wasSent = await sendShiftReminder(
      db,
      application,
      kind,
      now,
      options
    );

    if (wasSent) {
      sent += 1;
    } else {
      skipped += 1;
    }
  }

  return { sent, skipped };
}

export async function processShiftReminders(
  db: PrismaClient,
  options?: {
    now?: Date;
    createNotification?: typeof createNotificationWithEmail;
  }
): Promise<ProcessShiftRemindersResult> {
  const now = options?.now ?? new Date();

  const twentyFourHour = await processReminderKind(db, "24h", now, options);
  const twoHour = await processReminderKind(db, "2h", now, options);

  return {
    processedAt: now.toISOString(),
    sent24Hour: twentyFourHour.sent,
    sent2Hour: twoHour.sent,
    skipped24Hour: twentyFourHour.skipped,
    skipped2Hour: twoHour.skipped,
  };
}

export function isShiftReminderJobAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${cronSecret}`;
}
