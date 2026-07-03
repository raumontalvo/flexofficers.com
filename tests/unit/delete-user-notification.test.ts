import { describe, expect, it, vi } from "vitest";
import { deleteUserNotification } from "@/lib/notifications/delete-user-notification";

describe("deleteUserNotification", () => {
  it("only deletes notifications owned by the requesting user", async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const db = {
      notification: {
        deleteMany,
      },
    };

    const deleted = await deleteUserNotification(db, {
      userId: "user-1",
      notificationId: "notification-1",
    });

    expect(deleted).toBe(true);
    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        id: "notification-1",
        userId: "user-1",
      },
    });
  });

  it("returns false when no notification was deleted", async () => {
    const db = {
      notification: {
        deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
    };

    const deleted = await deleteUserNotification(db, {
      userId: "user-1",
      notificationId: "missing",
    });

    expect(deleted).toBe(false);
  });
});
