import type { InviteStatus } from "@/app/generated/prisma/enums";
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
