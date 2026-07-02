import type { LeadStatus } from "@/app/generated/prisma/enums";
import { extractZipLabel } from "@/lib/client-leads-page";
import {
  formatLeadDateLabel,
  formatLeadTimeRange,
} from "@/lib/security-lead-data";

export const COMPANY_LEADS_PAGE_SIZE = 6;

export type CompanyLeadsPageTab =
  | "all"
  | "active"
  | "filled"
  | "closed"
  | "cancelled";

export type CompanyLeadDisplayStatus =
  | "ACTIVE"
  | "FILLED"
  | "CLOSED"
  | "CANCELLED";

export type CompanyLeadsPageStats = {
  total: number;
  active: number;
  filled: number;
  closed: number;
  cancelled: number;
};

export type CompanyLeadsTabCounts = CompanyLeadsPageStats;

export type SerializedCompanySecurityLead = {
  id: string;
  title: string;
  city: string;
  state: string;
  zipLabel: string;
  dateLabel: string;
  timeLabel: string;
  officersNeeded: number;
  budgetOffer: string;
  displayStatus: CompanyLeadDisplayStatus;
  href: string;
};

type CompanyLeadRecord = {
  id: string;
  serviceNeeded: string;
  city: string;
  state: string;
  address: string;
  dateNeeded: Date;
  startTime: Date;
  endTime: Date;
  officersNeeded: number;
  budgetOffer: string;
  status: LeadStatus;
};

export function getCompanyLeadDisplayStatus(
  lead: Pick<CompanyLeadRecord, "status" | "endTime">,
  now: Date = new Date()
): CompanyLeadDisplayStatus {
  if (lead.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (lead.status === "FILLED") {
    return "FILLED";
  }

  if (lead.endTime < now) {
    return "CLOSED";
  }

  return "ACTIVE";
}

export function getCompanyLeadDisplayStatusLabel(status: CompanyLeadDisplayStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "FILLED":
      return "Filled";
    case "CLOSED":
      return "Closed";
    case "CANCELLED":
    default:
      return "Cancelled";
  }
}

export function getCompanyLeadsPageStats(
  leads: Array<Pick<CompanyLeadRecord, "status" | "endTime">>,
  now: Date = new Date()
): CompanyLeadsPageStats {
  return leads.reduce<CompanyLeadsPageStats>(
    (stats, lead) => {
      stats.total += 1;

      const displayStatus = getCompanyLeadDisplayStatus(lead, now);

      switch (displayStatus) {
        case "ACTIVE":
          stats.active += 1;
          break;
        case "FILLED":
          stats.filled += 1;
          break;
        case "CLOSED":
          stats.closed += 1;
          break;
        case "CANCELLED":
          stats.cancelled += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, active: 0, filled: 0, closed: 0, cancelled: 0 }
  );
}

export function getCompanyLeadsTabCounts(
  leads: Array<Pick<CompanyLeadRecord, "status" | "endTime">>,
  now: Date = new Date()
): CompanyLeadsTabCounts {
  return getCompanyLeadsPageStats(leads, now);
}

export function filterCompanyLeadsByTab<T extends Pick<CompanyLeadRecord, "status" | "endTime">>(
  leads: T[],
  tab: CompanyLeadsPageTab,
  now: Date = new Date()
): T[] {
  if (tab === "all") {
    return leads;
  }

  return leads.filter((lead) => {
    const displayStatus = getCompanyLeadDisplayStatus(lead, now);

    switch (tab) {
      case "active":
        return displayStatus === "ACTIVE";
      case "filled":
        return displayStatus === "FILLED";
      case "closed":
        return displayStatus === "CLOSED";
      case "cancelled":
        return displayStatus === "CANCELLED";
      default:
        return true;
    }
  });
}

export function filterCompanySecurityLeadsByTab(
  leads: SerializedCompanySecurityLead[],
  tab: CompanyLeadsPageTab
) {
  if (tab === "all") {
    return leads;
  }

  return leads.filter((lead) => {
    switch (tab) {
      case "active":
        return lead.displayStatus === "ACTIVE";
      case "filled":
        return lead.displayStatus === "FILLED";
      case "closed":
        return lead.displayStatus === "CLOSED";
      case "cancelled":
        return lead.displayStatus === "CANCELLED";
      default:
        return true;
    }
  });
}

export function searchCompanyLeads<T extends SerializedCompanySecurityLead>(
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
      lead.city.toLowerCase().includes(normalized) ||
      lead.state.toLowerCase().includes(normalized) ||
      lead.zipLabel.toLowerCase().includes(normalized)
    );
  });
}

export function paginateCompanyLeads<T>(items: T[], page: number, pageSize: number) {
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

export function formatCompanyLeadsPagination(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 to 0 of 0 leads";
  }

  return `Showing ${rangeStart} to ${rangeEnd} of ${total} leads`;
}

export function serializeCompanySecurityLead(
  lead: CompanyLeadRecord,
  now: Date = new Date()
): SerializedCompanySecurityLead {
  const displayStatus = getCompanyLeadDisplayStatus(lead, now);

  return {
    id: lead.id,
    title: lead.serviceNeeded,
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
    href: `/company/leads/${lead.id}`,
  };
}
