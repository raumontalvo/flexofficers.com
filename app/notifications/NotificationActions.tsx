"use client";

export default function NotificationActions({
  notificationId,
  isRead,
}: {
  notificationId: string;
  isRead: boolean;
}) {
  async function markAsRead() {
    const response = await fetch("/api/notifications/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert("Failed to mark notification as read");
    }
  }

  async function deleteNotification() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/notifications/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete notification");
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {!isRead && (
        <button
          onClick={markAsRead}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Mark as Read
        </button>
      )}

      <button
        onClick={deleteNotification}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
      >
        Delete
      </button>
    </div>
  );
}