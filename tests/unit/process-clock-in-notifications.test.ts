import { afterEach, describe, expect, it, vi } from "vitest";
import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { CLOCK_IN_OPEN_WINDOW_MS } from "@/lib/attendance";
import { buildClockInAvailableNotification } from "@/lib/reminders/clock-in-notification-content";
import {
  isClockInNotificationJobAuthorized,
  processClockInNotifications,
} from "@/lib/reminders/process-clock-in-notifications";

function buildAcceptedApplication(overrides?: {
  id?: string;
  userId?: string;
  shiftStartTime?: Date;
  shiftEndTime?: Date;
  shiftStatus?: ShiftStatus;
  applicationStatus?: ApplicationStatus;
  clockInAt?: Date | null;
  clockInNotificationSentAt?: Date | null;
}) {
  const shiftStartTime =
    overrides?.shiftStartTime ?? new Date("2026-07-02T18:00:00.000Z");
  const shiftEndTime =
    overrides?.shiftEndTime ??
    new Date(shiftStartTime.getTime() + 8 * 60 * 60 * 1000);

  return {
    id: overrides?.id ?? "application-1",
    status: overrides?.applicationStatus ?? ApplicationStatus.ACCEPTED,
    clockInAt: overrides?.clockInAt ?? null,
    clockInNotificationSentAt: overrides?.clockInNotificationSentAt ?? null,
    officer: {
      firstName: "Jordan",
      lastName: "Reyes",
      user: {
        id: overrides?.userId ?? "officer-user-1",
      },
    },
    shift: {
      title: "Casino Shift",
      location: "100 Main St",
      city: "Las Vegas",
      state: "NV",
      startTime: shiftStartTime,
      endTime: shiftEndTime,
      status: overrides?.shiftStatus ?? ShiftStatus.FILLED,
    },
  };
}

type MockApplication = ReturnType<typeof buildAcceptedApplication>;

function createMockDb(applications: MockApplication[]) {
  const applicationState = new Map(
    applications.map((application) => [application.id, { ...application }])
  );

  const notificationCreates: Array<Record<string, unknown>> = [];

  const applicationModel = {
    findMany: vi.fn(async ({ where }: { where: Record<string, unknown> }) => {
      const shiftWhere = where.shift as {
        startTime: { lte: Date };
        endTime: { gte: Date };
        status: { notIn: ShiftStatus[] };
      };

      return [...applicationState.values()].filter((application) => {
        if (application.status !== ApplicationStatus.ACCEPTED) {
          return false;
        }

        if (application.clockInAt !== null) {
          return false;
        }

        if (application.clockInNotificationSentAt !== null) {
          return false;
        }

        if (shiftWhere.status.notIn.includes(application.shift.status)) {
          return false;
        }

        if (
          application.shift.startTime.getTime() > shiftWhere.startTime.lte.getTime()
        ) {
          return false;
        }

        if (
          application.shift.endTime.getTime() < shiftWhere.endTime.gte.getTime()
        ) {
          return false;
        }

        return true;
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

        if (application.clockInAt !== null) {
          return { count: 0 };
        }

        if (application.clockInNotificationSentAt !== null) {
          return { count: 0 };
        }

        const shiftWhere = where.shift as {
          status: { notIn: ShiftStatus[] };
        };

        if (shiftWhere.status.notIn.includes(application.shift.status)) {
          return { count: 0 };
        }

        application.clockInNotificationSentAt = data.clockInNotificationSentAt;
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

describe("clock-in notification content", () => {
  it("builds in-app and email copy", () => {
    const notification = buildClockInAvailableNotification({
      officerName: "Jordan Reyes",
      shift: buildAcceptedApplication().shift,
    });

    expect(notification.type).toBe("clock_in_available");
    expect(notification.title).toBe("Clock In Available");
    expect(notification.message).toContain("Your clock-in is now open");
    expect(notification.message).toContain("Las Vegas, NV");
    expect(notification.message).toContain("Upcoming Shift page");
    expect(notification.emailSubject).toBe("Clock In Available for Your Shift");
    expect(notification.emailMessage).toContain("Hi Jordan Reyes,");
    expect(notification.emailMessage).toContain("Shift: Casino Shift");
    expect(notification.emailMessage).toContain("Location: 100 Main St, Las Vegas, NV");
    expect(notification.linkUrl).toBe("/officer/upcoming-shifts");
  });
});

describe("processClockInNotifications", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("sends the clock-in notification once when the window is open", async () => {
    const now = new Date("2026-07-02T17:30:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + CLOCK_IN_OPEN_WINDOW_MS - 60 * 1000),
    });
    const { db, notificationCreates } = createMockDb([application]);
    const createNotification = vi.fn(async (tx, input) => {
      await tx.notification.create({ data: input });
      return { id: "notification-1" };
    });

    const firstRun = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });
    const secondRun = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(firstRun.sent).toBe(1);
    expect(secondRun.sent).toBe(0);
    expect(createNotification).toHaveBeenCalledTimes(1);
    expect(notificationCreates[0]).toMatchObject({
      userId: "officer-user-1",
      title: "Clock In Available",
    });
  });

  it("does not send before the clock-in window opens", async () => {
    const now = new Date("2026-07-02T16:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + CLOCK_IN_OPEN_WINDOW_MS + 30 * 60 * 1000),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("still sends after shift start for late arrivals", async () => {
    const now = new Date("2026-07-02T18:30:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date("2026-07-02T18:00:00.000Z"),
      shiftEndTime: new Date("2026-07-03T02:00:00.000Z"),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn(async (tx, input) => {
      await tx.notification.create({ data: input });
      return { id: "notification-1" };
    });

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(1);
  });

  it("does not notify shifts that have already ended", async () => {
    const now = new Date("2026-07-03T05:00:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date("2026-07-02T18:00:00.000Z"),
      shiftEndTime: new Date("2026-07-03T02:00:00.000Z"),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("skips cancelled shifts", async () => {
    const now = new Date("2026-07-02T17:30:00.000Z");
    const application = buildAcceptedApplication({
      shiftStatus: ShiftStatus.CANCELLED,
      shiftStartTime: new Date(now.getTime() + 30 * 60 * 1000),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("skips officers who already clocked in", async () => {
    const now = new Date("2026-07-02T17:30:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + 30 * 60 * 1000),
      clockInAt: new Date("2026-07-02T17:15:00.000Z"),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("skips non-accepted applications", async () => {
    const now = new Date("2026-07-02T17:30:00.000Z");
    const application = buildAcceptedApplication({
      applicationStatus: ApplicationStatus.PENDING,
      shiftStartTime: new Date(now.getTime() + 30 * 60 * 1000),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("never sends a duplicate notification", async () => {
    const now = new Date("2026-07-02T17:30:00.000Z");
    const application = buildAcceptedApplication({
      shiftStartTime: new Date(now.getTime() + 30 * 60 * 1000),
      clockInNotificationSentAt: new Date("2026-07-02T17:15:00.000Z"),
    });
    const { db } = createMockDb([application]);
    const createNotification = vi.fn();

    const result = await processClockInNotifications(db as never, {
      now,
      createNotification,
    });

    expect(result.sent).toBe(0);
    expect(createNotification).not.toHaveBeenCalled();
  });
});

describe("isClockInNotificationJobAuthorized", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires bearer token in production when CRON_SECRET is set", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CRON_SECRET", "cron-secret");

    expect(
      isClockInNotificationJobAuthorized(
        new Request("http://localhost/api/jobs/clock-in-notifications", {
          method: "POST",
        })
      )
    ).toBe(false);

    expect(
      isClockInNotificationJobAuthorized(
        new Request("http://localhost/api/jobs/clock-in-notifications", {
          method: "POST",
          headers: {
            authorization: "Bearer cron-secret",
          },
        })
      )
    ).toBe(true);
  });
});
