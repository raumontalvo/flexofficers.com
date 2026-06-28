import {
  formatNotificationTimeAgo,
  formatNotificationsPaginationRange,
  notificationToneClasses,
  type NotificationIconVariant,
  type NotificationTone,
} from "@/lib/officer-notification-data";

export type CompanyNotificationTab =
  | "all"
  | "unread"
  | "applicants"
  | "shifts"
  | "system";

export type CompanyNotificationCategory = "applicants" | "shifts" | "system";

export type CompanyNotificationKind =
  | "invite_accepted"
  | "invite_declined"
  | "new_application"
  | "application_withdrawn"
  | "shift_update"
  | "shift_cancelled"
  | "system_update"
  | "general";

export type CompanyNotificationData = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  category: CompanyNotificationCategory;
  kind: CompanyNotificationKind;
  tone: NotificationTone;
  iconVariant: NotificationIconVariant;
  typeLabel: string;
  primaryAction: {
    label: "View Applicants" | "View Shifts" | "View Details";
    href: string;
  };
};

const NOTIFICATION_TABS: { value: CompanyNotificationTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "applicants", label: "Applicants" },
  { value: "shifts", label: "Shifts" },
  { value: "system", label: "System" },
];

const KIND_LABELS: Record<CompanyNotificationKind, string> = {
  invite_accepted: "INVITE ACCEPTED",
  invite_declined: "INVITE DECLINED",
  new_application: "NEW APPLICATION",
  application_withdrawn: "APPLICATION WITHDRAWN",
  shift_update: "SHIFT UPDATE",
  shift_cancelled: "SHIFT CANCELLED",
  system_update: "SYSTEM UPDATE",
  general: "SYSTEM UPDATE",
};

const KIND_TONES: Record<CompanyNotificationKind, NotificationTone> = {
  invite_accepted: "success",
  invite_declined: "danger",
  new_application: "info",
  application_withdrawn: "purple",
  shift_update: "warning",
  shift_cancelled: "danger",
  system_update: "system",
  general: "system",
};

const KIND_ICON_VARIANTS: Record<CompanyNotificationKind, NotificationIconVariant> =
  {
    invite_accepted: "check",
    invite_declined: "x",
    new_application: "document",
    application_withdrawn: "document",
    shift_update: "bell",
    shift_cancelled: "x",
    system_update: "megaphone",
    general: "megaphone",
  };

function includesAny(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function inferNotificationMeta(
  title: string,
  message: string
): { category: CompanyNotificationCategory; kind: CompanyNotificationKind } {
  const text = `${title} ${message}`.toLowerCase();

  if (includesAny(text, ["invitation accepted", "accepted your invitation"])) {
    return { category: "applicants", kind: "invite_accepted" };
  }
  if (includesAny(text, ["invitation declined", "declined your invitation"])) {
    return { category: "applicants", kind: "invite_declined" };
  }
  if (includesAny(text, ["new application", "applied to", "application received"])) {
    return { category: "applicants", kind: "new_application" };
  }
  if (includesAny(text, ["application withdrawn", "withdrew their application"])) {
    return { category: "applicants", kind: "application_withdrawn" };
  }
  if (includesAny(text, ["application", "applicant", "invite", "invitation"])) {
    return { category: "applicants", kind: "new_application" };
  }

  if (includesAny(text, ["shift cancelled", "shift canceled"])) {
    return { category: "shifts", kind: "shift_cancelled" };
  }
  if (includesAny(text, ["shift"])) {
    return { category: "shifts", kind: "shift_update" };
  }

  if (includesAny(text, ["platform update", "announcement", "maintenance"])) {
    return { category: "system", kind: "system_update" };
  }

  return { category: "system", kind: "general" };
}

function inferPrimaryAction(
  kind: CompanyNotificationKind,
  category: CompanyNotificationCategory
): CompanyNotificationData["primaryAction"] {
  if (category === "applicants") {
    return { label: "View Applicants", href: "/company/applications" };
  }

  if (category === "shifts" || kind === "shift_update" || kind === "shift_cancelled") {
    return { label: "View Shifts", href: "/company/shifts" };
  }

  return { label: "View Details", href: "/dashboard" };
}

export function mapCompanyNotification(notification: {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}): CompanyNotificationData {
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
    primaryAction: inferPrimaryAction(kind, category),
  };
}

export function getCompanyNotificationTabs() {
  return NOTIFICATION_TABS;
}

export function countUnreadCompanyNotifications(
  notifications: CompanyNotificationData[]
) {
  return notifications.filter((notification) => !notification.read).length;
}

export function filterCompanyNotifications(
  notifications: CompanyNotificationData[],
  tab: CompanyNotificationTab
) {
  switch (tab) {
    case "unread":
      return notifications.filter((notification) => !notification.read);
    case "applicants":
      return notifications.filter(
        (notification) => notification.category === "applicants"
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

export {
  formatNotificationTimeAgo,
  formatNotificationsPaginationRange,
  notificationToneClasses,
};

export type { NotificationIconVariant } from "@/lib/officer-notification-data";
