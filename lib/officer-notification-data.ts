export type NotificationTab = "all" | "unread" | "applications" | "shifts" | "system";

export type NotificationCategory = "applications" | "shifts" | "system";

export type NotificationTone =
  | "success"
  | "info"
  | "warning"
  | "purple"
  | "danger"
  | "system";

export type NotificationKind =
  | "application_accepted"
  | "application_rejected"
  | "application_viewed"
  | "application_withdrawn"
  | "application_status_updated"
  | "upcoming_shift_reminder"
  | "shift_starts_tomorrow"
  | "shift_starts_soon"
  | "shift_schedule_changed"
  | "shift_cancelled"
  | "new_shift_match"
  | "system_update"
  | "system_maintenance"
  | "system_security"
  | "system_coming_soon"
  | "system_welcome"
  | "system_profile_reminder"
  | "general";

export type NotificationIconVariant =
  | "check"
  | "calendar"
  | "bell"
  | "document"
  | "x"
  | "megaphone";

export type OfficerNotificationData = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  category: NotificationCategory;
  kind: NotificationKind;
  tone: NotificationTone;
  iconVariant: NotificationIconVariant;
  typeLabel: string;
  primaryAction: {
    label: "View Shift" | "View Details";
    href: string;
  };
};

const NOTIFICATION_TABS: { value: NotificationTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "applications", label: "Applications" },
  { value: "shifts", label: "Shifts" },
  { value: "system", label: "System" },
];

const KIND_LABELS: Record<NotificationKind, string> = {
  application_accepted: "APPLICATION ACCEPTED",
  application_rejected: "APPLICATION REJECTED",
  application_viewed: "APPLICATION VIEWED",
  application_withdrawn: "APPLICATION WITHDRAWN",
  application_status_updated: "APPLICATION UPDATE",
  upcoming_shift_reminder: "SHIFT REMINDER",
  shift_starts_tomorrow: "SHIFT REMINDER",
  shift_starts_soon: "SHIFT REMINDER",
  shift_schedule_changed: "SCHEDULE CHANGED",
  shift_cancelled: "SHIFT CANCELLED",
  new_shift_match: "NEW SHIFT MATCH",
  system_update: "SYSTEM UPDATE",
  system_maintenance: "SYSTEM UPDATE",
  system_security: "SYSTEM UPDATE",
  system_coming_soon: "SYSTEM UPDATE",
  system_welcome: "SYSTEM UPDATE",
  system_profile_reminder: "SYSTEM UPDATE",
  general: "SYSTEM UPDATE",
};

const KIND_TONES: Record<NotificationKind, NotificationTone> = {
  application_accepted: "success",
  application_rejected: "danger",
  application_viewed: "purple",
  application_withdrawn: "purple",
  application_status_updated: "purple",
  upcoming_shift_reminder: "warning",
  shift_starts_tomorrow: "warning",
  shift_starts_soon: "warning",
  shift_schedule_changed: "warning",
  shift_cancelled: "danger",
  new_shift_match: "info",
  system_update: "system",
  system_maintenance: "system",
  system_security: "system",
  system_coming_soon: "system",
  system_welcome: "system",
  system_profile_reminder: "system",
  general: "system",
};

type InferredMeta = {
  category: NotificationCategory;
  kind: NotificationKind;
};

function includesAny(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function inferNotificationMeta(title: string, message: string): InferredMeta {
  const text = `${title} ${message}`.toLowerCase();

  if (includesAny(text, ["invited you", "company invite", "new company invite"])) {
    return { category: "applications", kind: "application_status_updated" };
  }
  if (includesAny(text, ["application accepted", "accepted your application"])) {
    return { category: "applications", kind: "application_accepted" };
  }
  if (includesAny(text, ["application rejected", "rejected your application"])) {
    return { category: "applications", kind: "application_rejected" };
  }
  if (includesAny(text, ["application viewed", "viewed your application"])) {
    return { category: "applications", kind: "application_viewed" };
  }
  if (includesAny(text, ["application withdrawn", "withdrew your application"])) {
    return { category: "applications", kind: "application_withdrawn" };
  }
  if (includesAny(text, ["application status", "application updated"])) {
    return { category: "applications", kind: "application_status_updated" };
  }

  if (includesAny(text, ["upcoming shift tomorrow", "starts tomorrow"])) {
    return { category: "shifts", kind: "shift_starts_tomorrow" };
  }
  if (includesAny(text, ["shift starts soon", "begins in about 2 hours"])) {
    return { category: "shifts", kind: "shift_starts_soon" };
  }
  if (includesAny(text, ["upcoming shift", "shift reminder"])) {
    return { category: "shifts", kind: "upcoming_shift_reminder" };
  }
  if (includesAny(text, ["schedule changed", "shift rescheduled", "time changed"])) {
    return { category: "shifts", kind: "shift_schedule_changed" };
  }
  if (includesAny(text, ["shift cancelled", "shift canceled"])) {
    return { category: "shifts", kind: "shift_cancelled" };
  }
  if (includesAny(text, ["new shift match", "shift match", "matching shift"])) {
    return { category: "shifts", kind: "new_shift_match" };
  }
  if (includesAny(text, ["shift"])) {
    return { category: "shifts", kind: "upcoming_shift_reminder" };
  }

  if (includesAny(text, ["application"])) {
    return { category: "applications", kind: "application_status_updated" };
  }

  if (includesAny(text, ["maintenance"])) {
    return { category: "system", kind: "system_maintenance" };
  }
  if (includesAny(text, ["security"])) {
    return { category: "system", kind: "system_security" };
  }
  if (includesAny(text, ["coming soon"])) {
    return { category: "system", kind: "system_coming_soon" };
  }
  if (includesAny(text, ["welcome"])) {
    return { category: "system", kind: "system_welcome" };
  }
  if (includesAny(text, ["complete your profile", "profile completion", "profile reminder"])) {
    return { category: "system", kind: "system_profile_reminder" };
  }
  if (includesAny(text, ["platform update", "bug fix", "announcement"])) {
    return { category: "system", kind: "system_update" };
  }

  return { category: "system", kind: "general" };
}

const KIND_ICON_VARIANTS: Record<NotificationKind, NotificationIconVariant> = {
  application_accepted: "check",
  application_rejected: "x",
  application_viewed: "document",
  application_withdrawn: "document",
  application_status_updated: "document",
  upcoming_shift_reminder: "bell",
  shift_starts_tomorrow: "bell",
  shift_starts_soon: "bell",
  shift_schedule_changed: "bell",
  shift_cancelled: "x",
  new_shift_match: "calendar",
  system_update: "megaphone",
  system_maintenance: "megaphone",
  system_security: "megaphone",
  system_coming_soon: "megaphone",
  system_welcome: "megaphone",
  system_profile_reminder: "megaphone",
  general: "megaphone",
};

function inferPrimaryAction(
  kind: NotificationKind,
  category: NotificationCategory,
  title: string,
  message: string
): OfficerNotificationData["primaryAction"] {
  const text = `${title} ${message}`.toLowerCase();

  if (includesAny(text, ["invited you", "new company invite", "company invite"])) {
    return { label: "View Details", href: "/officer/invites" };
  }

  if (kind === "new_shift_match") {
    return { label: "View Shift", href: "/shifts" };
  }

  if (
    includesAny(text, ["upcoming shift tomorrow", "shift starts soon", "begins in about 2 hours"])
  ) {
    return { label: "View Shift", href: "/officer/accepted-shifts" };
  }

  if (
    kind === "upcoming_shift_reminder" ||
    kind.startsWith("shift_")
  ) {
    return { label: "View Shift", href: "/officer/upcoming-shifts" };
  }

  if (kind === "system_profile_reminder") {
    return { label: "View Details", href: "/officer/profile" };
  }

  if (category === "applications") {
    return { label: "View Details", href: "/officer/applications" };
  }

  return { label: "View Details", href: "/dashboard" };
}

export function mapOfficerNotification(notification: {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}): OfficerNotificationData {
  const { category, kind } = inferNotificationMeta(
    notification.title,
    notification.message
  );

  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    read: notification.read,
    createdAt: notification.createdAt.toISOString(),
    category,
    kind,
    tone: KIND_TONES[kind],
    iconVariant: KIND_ICON_VARIANTS[kind],
    typeLabel: KIND_LABELS[kind],
    primaryAction: inferPrimaryAction(kind, category, notification.title, notification.message),
  };
}

export function getNotificationTabs() {
  return NOTIFICATION_TABS;
}

export function countUnreadNotifications(notifications: OfficerNotificationData[]) {
  return notifications.filter((notification) => !notification.read).length;
}

export function filterNotifications(
  notifications: OfficerNotificationData[],
  tab: NotificationTab
) {
  switch (tab) {
    case "unread":
      return notifications.filter((notification) => !notification.read);
    case "applications":
      return notifications.filter(
        (notification) => notification.category === "applications"
      );
    case "shifts":
      return notifications.filter(
        (notification) => notification.category === "shifts"
      );
    case "system":
      return notifications.filter(
        (notification) => notification.category === "system"
      );
    default:
      return notifications;
  }
}

export function formatNotificationTimeAgo(iso: string, now = new Date()) {
  const createdAt = new Date(iso);
  const diffMs = now.getTime() - createdAt.getTime();

  if (diffMs < 0) {
    return "Just now";
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  return createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNotificationsPaginationRange(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 notifications";
  }

  return `Showing ${rangeStart}–${rangeEnd} of ${total} notifications`;
}

export const notificationToneClasses: Record<
  NotificationTone,
  { icon: string; badge: string }
> = {
  success: {
    icon: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  },
  info: {
    icon: "bg-blue-500/20 text-blue-300 ring-blue-500/30",
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  },
  warning: {
    icon: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  purple: {
    icon: "bg-violet-500/20 text-violet-300 ring-violet-500/30",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  },
  danger: {
    icon: "bg-red-500/20 text-red-300 ring-red-500/30",
    badge: "border-red-500/30 bg-red-500/10 text-red-200",
  },
  system: {
    icon: "bg-slate-500/20 text-slate-300 ring-slate-500/30",
    badge: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  },
};
