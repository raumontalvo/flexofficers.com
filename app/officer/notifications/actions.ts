"use server";

import {
  deleteNotificationForCurrentUser,
  markAllNotificationsReadForCurrentUser,
} from "@/lib/notifications/notification-actions";

export async function markAllNotificationsRead() {
  await markAllNotificationsReadForCurrentUser();
}

export async function deleteNotification(notificationId: string) {
  return deleteNotificationForCurrentUser(notificationId);
}
