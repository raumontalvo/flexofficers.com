import type {
  LeadPaymentStatus,
  LeadStatus,
} from "@/app/generated/prisma/enums";
import {
  formatLeadDateLabel,
  formatLeadTimeRange,
} from "@/lib/security-lead-data";
import {
  getClientLeadDisplayStatus,
  type ClientLeadDisplayStatus,
} from "@/lib/client-dashboard-data";

export const CLIENT_LEADS_PAGE_SIZE = 10;

export type ClientLeadsPageTab =
  | "all"
  | "active"
  | "pending"
  | "completed"
  | "cancelled";

export type ClientLeadsPageStats = {
  total: number;
  active: number;
  pending: number;
  completed: number;
  cancelled: number;
};

export type SerializedClientSecurityRequest = {
  id: string;
  requestId: string;
  title: string;
  subtitle: string;
  city: string;
  state: string;
  zipLabel: string;
  dateLabel: string;
  timeLabel: string;
  officersNeeded: number;
  budgetOffer: string;
  displayStatus: ClientLeadDisplayStatus;
  applicantCount: number;
  href: string;
};

type ClientLeadRecord = {
  id: string;
  serviceNeeded: string;
  description: string;
  city: string;
  state: string;
  address: string;
  dateNeeded: Date;
  startTime: Date;
  endTime: Date;
  officersNeeded: number;
  budgetOffer: string;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
  _count?: { applications: number };
};

export function formatSecurityRequestId(id: string) {
  return `#SR-${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

export function extractZipLabel(address: string) {
  const match = address.match(/\b\d{5}(?:-\d{4})?\b/);
  return match?.[0] ?? address.trim().split(",").pop()?.trim() ?? "—";
}

export function getClientLeadSubtitle(description: string, serviceNeeded: string) {
  const normalized = description.trim();

  if (normalized) {
    return normalized.length > 48 ? `${normalized.slice(0, 48).trim()}…` : normalized;
  }

  return `${serviceNeeded} Protection`;
}

export function getClientLeadsPageStats(
  leads: Array<Pick<ClientLeadRecord, "status" | "paymentStatus">>
): ClientLeadsPageStats {
  return leads.reduce<ClientLeadsPageStats>(
    (stats, lead) => {
      stats.total += 1;

      const displayStatus = getClientLeadDisplayStatus(lead);

      switch (displayStatus) {
        case "ACTIVE":
          stats.active += 1;
          break;
        case "PENDING":
          stats.pending += 1;
          break;
        case "COMPLETED":
          stats.completed += 1;
          break;
        case "CANCELLED":
          stats.cancelled += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, active: 0, pending: 0, completed: 0, cancelled: 0 }
  );
}

export function filterClientLeadsByTab<T extends Pick<ClientLeadRecord, "status" | "paymentStatus">>(
  leads: T[],
  tab: ClientLeadsPageTab
): T[] {
  if (tab === "all") {
    return leads;
  }

  return leads.filter((lead) => {
    const displayStatus = getClientLeadDisplayStatus(lead);

    switch (tab) {
      case "active":
        return displayStatus === "ACTIVE";
      case "pending":
        return displayStatus === "PENDING";
      case "completed":
        return displayStatus === "COMPLETED";
      case "cancelled":
        return displayStatus === "CANCELLED";
      default:
        return true;
    }
  });
}

export function filterClientSecurityRequestsByTab(
  requests: SerializedClientSecurityRequest[],
  tab: ClientLeadsPageTab
) {
  if (tab === "all") {
    return requests;
  }

  return requests.filter((request) => {
    switch (tab) {
      case "active":
        return request.displayStatus === "ACTIVE";
      case "pending":
        return request.displayStatus === "PENDING";
      case "completed":
        return request.displayStatus === "COMPLETED";
      case "cancelled":
        return request.displayStatus === "CANCELLED";
      default:
        return true;
    }
  });
}

export function searchClientLeads<T extends SerializedClientSecurityRequest>(
  leads: T[],
  query: string
): T[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return leads;
  }

  return leads.filter((lead) => {
    return (
      lead.title.toLowerCase().includes(normalized) ||
      lead.subtitle.toLowerCase().includes(normalized) ||
      lead.city.toLowerCase().includes(normalized) ||
      lead.state.toLowerCase().includes(normalized) ||
      lead.requestId.toLowerCase().includes(normalized) ||
      lead.zipLabel.toLowerCase().includes(normalized)
    );
  });
}

export function paginateClientLeads<T>(items: T[], page: number, pageSize: number) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    rangeStart: totalItems === 0 ? 0 : startIndex + 1,
    rangeEnd: Math.min(startIndex + pageSize, totalItems),
  };
}

export function formatClientLeadsPagination(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 to 0 of 0 requests";
  }

  return `Showing ${rangeStart} to ${rangeEnd} of ${total} requests`;
}

export function serializeClientSecurityRequest(
  lead: ClientLeadRecord
): SerializedClientSecurityRequest {
  const displayStatus = getClientLeadDisplayStatus(lead);

  return {
    id: lead.id,
    requestId: formatSecurityRequestId(lead.id),
    title: lead.serviceNeeded,
    subtitle: getClientLeadSubtitle(lead.description, lead.serviceNeeded),
    city: lead.city,
    state: lead.state,
    zipLabel: extractZipLabel(lead.address),
    dateLabel: formatLeadDateLabel(lead.dateNeeded.toISOString()),
    timeLabel: formatLeadTimeRange(
      lead.startTime.toISOString(),
      lead.endTime.toISOString()
    ),
    officersNeeded: lead.officersNeeded,
    budgetOffer: lead.budgetOffer,
    displayStatus,
    applicantCount: lead._count?.applications ?? 0,
    href: `/client/leads/${lead.id}`,
  };
}
