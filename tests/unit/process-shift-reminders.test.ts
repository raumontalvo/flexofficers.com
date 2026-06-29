import { afterEach, describe, expect, it, vi } from "vitest";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  buildShiftReminderNotification,
  isShiftReminderDue,
  REMINDER_WINDOW_MS,
  TWENTY_FOUR_HOURS_MS,
  TWO_HOURS_MS,
} from "@/lib/reminders/shift-reminder-content";
import {
  isShiftReminderJobAuthorized,
  processShiftReminders,
} from "@/lib/reminders/process-shift-reminders";

function buildAcceptedApplication(overrides?: {
  id?: string;
  userId?: string;
  shiftStartTime?: Date;
  shiftStatus?: ShiftStatus;
  applicationStatus?: ApplicationStatus;
  shift24HourReminderSentAt?: Date | null;
  shift2HourReminderSentAt?: Date | null;
}) {
  const shiftStartTime =
    overrides?.shiftStartTime ?? new Date("2026-07-02T18:00:00.000Z");

  return {
    id: overrides?.id ?? "application-1",
    status: overrides?.applicationStatus ?? ApplicationStatus.ACCEPTED,
    shift24HourReminderSentAt: overrides?.shift24HourReminderSentAt ?? null,
    shift2HourReminderSentAt: overrides?.shift2HourReminderSentAt ?? null,
    officer: {
      user: {
        id: overrides?.userId ?? "officer-user-1",
      },
    },
    shift: {
      title: "Casino Shift",
      location: "100 Main St",
      city: "Las Vegas",
      state: "NV",
      hourlyRate: { toString: () => "35" },
      startTime: shiftStartTime,
      endTime: new Date(shiftStartTime.getTime() + 8 * 60 * 60 * 1000),
      status: overrides?.shiftStatus ?? ShiftStatus.FILLED,
      company: {
        companyName: "Acme Security",
      },
    },
  };
}

function createMockDb(applications: ReturnType<typeof buildAcceptedApplication>[]) {
  const applicationState = new Map(
    applications.map((application) => [application.id, { ...application }])
  );

  const notificationCreates: Array<Record<string, unknown>> = [];

  const applicationModel = {
    findMany: vi.fn(async ({ where }: { where: Record<string, unknown> }) => {
      const is24Hour = "shift24HourReminderSentAt" in where;
      const sentAtField = is24Hour
        ? "shift24HourReminderSentAt"
        : "shift2HourReminderSentAt";
      const startWindow = (
        where.shift as { startTime: { gte: Date; lte: Date } }
      ).startTime;

      return [...applicationState.values()].filter((application) => {
        if (application.status !== ApplicationStatus.ACCEPTED) {
          return false;
        }

        if (application[sentAtField] !== null) {
          return false;
        }

        if (application.shift.status === ShiftStatus.CANCELLED) {
          return false;
        }

        const startTime = application.shift.startTime.getTime();
        return (
          startTime >= startWindow.gte.getTime() &&
          startTime <= startWindow.lte.getTime()
        );
      });
    }),
    updateMany: vi.fn(
      async ({
        where,
        data,
      }: {
        where: Record<string, unknown>;
        data: Record<string, Date>;
      }) => {
        const application = applicationState.get(where.id as string);

        if (!application) {
          return { count: 0 };
        }

        if (application.status !== ApplicationStatus.ACCEPTED) {
          return { count: 0 };
        }

        if (application.shift.status === ShiftStatus.CANCELLED) {
          return { count: 0 };
        }

        const sentAtField = Object.keys(data)[0] as
          | "shift24HourReminderSentAt"
          | "shift2HourReminderSentAt";

        if (application[sentAtField] !== null) {
          return { count: 0 };
        }

        application[sentAtField] = data[sentAtField];
        return { count: 1 };
      }
    ),
  };

  const db = {
    application: applicationModel,
    notification: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        notificationCreates.push(data);
        return {
          id: `notification-${notificationCreates.length}`,
          ...data,
          read: false,
          createdAt: new Date(),
        };
      }),
    },
    user: {
      findUnique: vi.fn(async () => ({
        email: "officer@example.com",
        emailNotificationsEnabled: true,
      })),
    },
    $transaction: vi.fn(async (callback: (tx: typeof db) => Promise<unknown>) =>
      callback(db)
    ),
  };

  return { db, notificationCreates };
}

describe("shift reminder content", () => {
  it("builds 24-hour reminder copy and email subject", () => {
    const reminder = buildShiftReminderNotification({
      kind: "24h",
      shift: buildAcceptedApplication().shift,
      company: { companyName: "Acme Security" },
    });

    expect(reminder.title).toBe("Upcoming Shift Tomorrow");
    expect(reminder.message).toContain('Casino Shift');
    expect(reminder.message).toContain("starts tomorrow");
    expect(reminder.emailSubject).toBe("Tomorrow: Casino Shift Reminder");
    expect(reminder.emailMessage).toContain("Company: Acme Security");
    expect(reminder.linkUrl).toBe("/officer/accepted-shifts");
  });

  it("detects reminder windows", () => {
    const startTime = new Date("2026-07-02T18:00:00.000Z");
    const now = new Date(startTime.getTime() - TWENTY_FOUR_HOURS_MS);

    expect(isShiftReminderDue(startTime, now, TWENTY_FOUR_HOURS_MS)).toBe(true);
    expect(
      isShiftReminderDue(
        startTime,
        new Date(now.getTime() + REMINDER_WINDOW_MS + 1),
        TWENTY_FOUR_HOURS_MS
      )
    ).toBe(false);
  });
});

describe("processShiftReminders", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("sends the 24-hour reminder once", async () => {
    const now = new Date("2026-07-01T18:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + TWENTY_FOUR_HOURS_MS + 5 * 60 * 1000),
    });
    const { db, notificationCreates } = createMockDb([application]);
    const createNotification = vi.fn(async (tx, input) => {
      await tx.notification.create({ data: input });
      return { id: "notification-1" };
    });

    const firstRun = await processShiftReminders(db as never, {
      now,
      createNotification,
    });
    const secondRun = await processShiftReminders(db as never, {
      now,
      createNotification,
    });

    expect(firstRun.sent24Hour).toBe(1);
    expect(secondRun.sent24Hour).toBe(0);
    expect(createNotification).toHaveBeenCalledTimes(1);
    expect(notificationCreates[0]).toMatchObject({
      userId: "officer-user-1",
      title: "Upcoming Shift Tomorrow",
      type: "shift_reminder_24h",
    });
  });

  it("sends the 2-hour reminder once", async () => {
    const now = new Date("2026-07-02T16:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + TWO_HOURS_MS + 5 * 60 * 1000),
    });
    const { db, notificationCreates } = createMockDb([application]);
    const createNotification = vi.fn(async (tx, input) => {
      await tx.notification.create({ data: input });
      return { id: "notification-2" };
    });

    const result = await processShiftReminders(db as never, {
      now,
      createNotification,
    });

    expect(result.sent2Hour).toBe(1);
    expect(notificationCreates[0]).toMatchObject({
      title: "Shift Starts Soon",
      type: "shift_reminder_2h",
    });
  });

  it("skips cancelled shifts", async () => {
    const now = new Date("2026-07-01T18:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStatus: ShiftStatus.CANCELLED,
      shiftStartTime: new Date(now.getTime() + TWENTY_FOUR_HOURS_MS),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processShiftReminders(db as never, {
      now,
      createNotification,
    });

    expect(result.sent24Hour).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("skips non-accepted officers", async () => {
    const now = new Date("2026-07-01T18:00:00.000Z");
    const application = buildAcceptedApplication({
      applicationStatus: ApplicationStatus.PENDING,
      shiftStartTime: new Date(now.getTime() + TWENTY_FOUR_HOURS_MS),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processShiftReminders(db as never, {
      now,
      createNotification,
    });

    expect(result.sent24Hour).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("never sends duplicate reminders", async () => {
    const now = new Date("2026-07-01T18:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + TWENTY_FOUR_HOURS_MS),
      shift24HourReminderSentAt: new Date("2026-07-01T12:00:00.000Z"),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processShiftReminders(db as never, {
      now,
      createNotification,
    });

    expect(result.sent24Hour).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("does not block notification creation when email delivery fails", async () => {
    const now = new Date("2026-07-01T18:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + TWENTY_FOUR_HOURS_MS),
    });
    const { db, notificationCreates } = createMockDb([application]);
    const createNotification = vi.fn(async (tx, input) => {
      await tx.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          message: input.message,
        },
      });

      try {
        await Promise.reject(new Error("Resend down"));
      } catch {
        // Email failures are non-blocking in createNotificationWithEmail.
      }

      return { id: "notification-1" };
    });

    const result = await processShiftReminders(db as never, {
      now,
      createNotification,
    });

    expect(result.sent24Hour).toBe(1);
    expect(notificationCreates).toHaveLength(1);
    expect(notificationCreates[0]).toMatchObject({
      userId: "officer-user-1",
      title: "Upcoming Shift Tomorrow",
    });
  });
});

describe("isShiftReminderJobAuthorized", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires bearer token in production when CRON_SECRET is set", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CRON_SECRET", "cron-secret");

    expect(
      isShiftReminderJobAuthorized(
        new Request("http://localhost/api/jobs/shift-reminders", {
          method: "POST",
        })
      )
    ).toBe(false);

    expect(
      isShiftReminderJobAuthorized(
        new Request("http://localhost/api/jobs/shift-reminders", {
          method: "POST",
          headers: {
            authorization: "Bearer cron-secret",
          },
        })
      )
    ).toBe(true);
  });
});
