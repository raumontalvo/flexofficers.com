"use server";

import {
  deleteNotificationForCurrentUser,
  markAllNotificationsReadForCurrentUser,
} from "@/lib/notifications/notification-actions";

export async function markAllCompanyNotificationsRead() {
  await markAllNotificationsReadForCurrentUser();
}

export async function deleteCompanyNotification(notificationId: string) {
  return deleteNotificationForCurrentUser(notificationId);
}
