import type { PrismaClient } from "@/app/generated/prisma/client";

type NotificationDb = Pick<PrismaClient, "notification">;

/**
 * Notifications persist until the owning user explicitly deletes them.
 * Do not call this from read handlers, cron jobs, status transitions, or
 * shift lifecycle events — only from a manual delete action in the UI.
 */
export async function deleteUserNotification(
  db: NotificationDb,
  input: {
    userId: string;
    notificationId: string;
  }
) {
  const result = await db.notification.deleteMany({
    where: {
      id: input.notificationId,
      userId: input.userId,
    },
  });

  return result.count > 0;
}
