"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { deleteUserNotification } from "@/lib/notifications/delete-user-notification";
import { prisma } from "@/lib/prisma";

const NOTIFICATION_ROLES = new Set<UserRole>([
  UserRole.OFFICER,
  UserRole.COMPANY,
  UserRole.CLIENT,
  UserRole.ADMIN,
]);

const NOTIFICATION_LIST_PATHS: Partial<Record<UserRole, string>> = {
  [UserRole.OFFICER]: "/officer/notifications",
  [UserRole.COMPANY]: "/company/notifications",
  [UserRole.CLIENT]: "/client/notifications",
  [UserRole.ADMIN]: "/admin/notifications",
};

async function getNotificationActor() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user || !NOTIFICATION_ROLES.has(user.role)) {
    redirect("/dashboard");
  }

  return user;
}

function revalidateNotificationList(role: UserRole) {
  const path = NOTIFICATION_LIST_PATHS[role];

  if (path) {
    revalidatePath(path);
  }
}

export async function markAllNotificationsReadForCurrentUser() {
  const user = await getNotificationActor();

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidateNotificationList(user.role);
}

export async function deleteNotificationForCurrentUser(notificationId: string) {
  const user = await getNotificationActor();

  if (!notificationId) {
    return { deleted: false as const };
  }

  const deleted = await deleteUserNotification(prisma, {
    userId: user.id,
    notificationId,
  });

  if (deleted) {
    revalidateNotificationList(user.role);
  }

  return { deleted };
}
