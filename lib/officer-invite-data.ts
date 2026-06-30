import type { InviteStatus } from "@/app/generated/prisma/enums";
import type { OfficerNotificationData } from "@/lib/officer-notification-data";
import { formatNotificationTimeAgo } from "@/lib/officer-notification-data";
import {
  formatHourlyRate,
  formatShiftCityState,
  formatShiftScheduleParts,
} from "@/lib/format-shift";

export type InviteTab = "all" | "pending" | "accepted" | "declined";

export type InviteSortOption = "newest" | "oldest";

export type InviteViewMode = "list" | "grid";

export type OfficerInviteData = {
  id: string;
  status: InviteStatus;
  invitedAt: string;
  respondedAt: string | null;
  company: {
    companyName: string;
    logoUrl: string | null;
  };
  shift: {
    id: string;
    title: string;
    hourlyRate: string;
    location: string;
    city: string | null;
    state: string | null;
    startTime: string;
    endTime: string;
  };
};

export const INVITE_TABS: { value: InviteTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export const INVITE_STATUS_LABELS: Record<InviteStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
};

export function mapOfficerInvite(invite: {
  id: string;
  status: InviteStatus;
  invitedAt: Date;
  respondedAt: Date | null;
  shift: {
    id: string;
    title: string;
    hourlyRate: { toString: () => string };
    location: string;
    city: string | null;
    state: string | null;
    startTime: Date;
    endTime: Date;
    company: {
      companyName: string;
      logoUrl: string | null;
    };
  };
}): OfficerInviteData {
  return {
    id: invite.id,
    status: invite.status,
    invitedAt: invite.invitedAt.toISOString(),
    respondedAt: invite.respondedAt?.toISOString() ?? null,
    company: {
      companyName: invite.shift.company.companyName,
      logoUrl: invite.shift.company.logoUrl,
    },
    shift: {
      id: invite.shift.id,
      title: invite.shift.title,
      hourlyRate: invite.shift.hourlyRate.toString(),
      location: invite.shift.location,
      city: invite.shift.city,
      state: invite.shift.state,
      startTime: invite.shift.startTime.toISOString(),
      endTime: invite.shift.endTime.toISOString(),
    },
  };
}

export function getInviteTabCounts(invites: OfficerInviteData[]) {
  return {
    all: invites.length,
    pending: invites.filter((invite) => invite.status === "PENDING").length,
    accepted: invites.filter((invite) => invite.status === "ACCEPTED").length,
    declined: invites.filter((invite) => invite.status === "DECLINED").length,
  };
}

export function filterInvitesByTab(
  invites: OfficerInviteData[],
  tab: InviteTab
): OfficerInviteData[] {
  if (tab === "all") {
    return invites;
  }

  const statusMap: Record<Exclude<InviteTab, "all">, InviteStatus> = {
    pending: "PENDING",
    accepted: "ACCEPTED",
    declined: "DECLINED",
  };

  return invites.filter((invite) => invite.status === statusMap[tab]);
}

export function sortOfficerInvites(
  invites: OfficerInviteData[],
  sort: InviteSortOption
): OfficerInviteData[] {
  const sorted = [...invites];

  sorted.sort((left, right) => {
    const leftTime = new Date(left.invitedAt).getTime();
    const rightTime = new Date(right.invitedAt).getTime();
    return sort === "newest" ? rightTime - leftTime : leftTime - rightTime;
  });

  return sorted;
}

export function formatInviteSchedule(invite: OfficerInviteData) {
  const startTime = new Date(invite.shift.startTime);
  const endTime = new Date(invite.shift.endTime);
  return formatShiftScheduleParts(startTime, endTime);
}

export function formatInviteLocation(invite: OfficerInviteData) {
  return formatShiftCityState(invite.shift);
}

export function formatInviteHourlyRate(invite: OfficerInviteData) {
  return formatHourlyRate(invite.shift.hourlyRate);
}

export function formatInvitedTimeAgo(invitedAt: string, now = new Date()) {
  return `Invited ${formatNotificationTimeAgo(invitedAt, now)}`;
}

export const INVITE_HOW_IT_WORKS_STEPS = [
  {
    title: "Company invites you",
    description: "A company finds your profile and invites you to a shift.",
  },
  {
    title: "You review the shift",
    description: "Check the details and decide if it's a good fit.",
  },
  {
    title: "Accept invite",
    description:
      "If you accept, the shift is automatically added to your Accepted Shifts.",
  },
  {
    title: "Show up & get paid",
    description:
      "Work the shift and get paid directly by the security company. The company is in charge of paying you—not through FlexOfficers.",
  },
] as const;

export function filterDuplicateInviteNotifications(
  notifications: OfficerNotificationData[],
  invites: OfficerInviteData[]
): OfficerNotificationData[] {
  if (invites.length === 0) {
    return notifications;
  }

  return notifications.filter((notification) => {
    const text = `${notification.title} ${notification.message}`.toLowerCase();

    return !invites.some((invite) => {
      const company = invite.company.companyName.toLowerCase();
      const title = invite.shift.title.toLowerCase();

      return text.includes(company) && text.includes(title);
    });
  });
}

export function isInviteNotification(notification: {
  title: string;
  message: string;
}) {
  const text = `${notification.title} ${notification.message}`.toLowerCase();
  return (
    text.includes("invited you") ||
    text.includes("company invite") ||
    text.includes("new company invite")
  );
}
