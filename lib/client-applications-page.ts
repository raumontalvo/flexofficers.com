import type { LeadApplicationStatus } from "@/app/generated/prisma/enums";
import {
  formatLeadDateLabel,
  formatLeadTimeRange,
} from "@/lib/security-lead-data";

export const CLIENT_APPLICATIONS_PAGE_SIZE = 6;

export type ClientApplicationPageTab =
  | "all"
  | "pending"
  | "hired"
  | "declined"
  | "withdrawn";

export type ClientApplicationDisplayStatus =
  | "PENDING_REVIEW"
  | "HIRED"
  | "DECLINED"
  | "WITHDRAWN";

export type ClientApplicationsPageStats = {
  total: number;
  pending: number;
  hired: number;
  declined: number;
  withdrawn: number;
};

export type SerializedClientLeadApplication = {
  id: string;
  companyName: string;
  logoUrl: string | null;
  leadTitle: string;
  leadLocation: string;
  leadDateLabel: string;
  leadTimeLabel: string;
  appliedDateLabel: string;
  appliedTimeLabel: string;
  displayStatus: ClientApplicationDisplayStatus;
  offerLabel: string;
  profileHref: string;
};

type ClientApplicationRecord = {
  id: string;
  status: LeadApplicationStatus;
  createdAt: Date;
  securityLeadId: string;
  companyId: string;
  company: {
    companyName: string;
    logoUrl: string | null;
  };
  securityLead: {
    serviceNeeded: string;
    city: string;
    state: string;
    dateNeeded: Date;
    startTime: Date;
    endTime: Date;
    budgetOffer: string;
  };
};

export function getClientApplicationDisplayStatus(
  status: LeadApplicationStatus
): ClientApplicationDisplayStatus {
  switch (status) {
    case "ACCEPTED":
      return "HIRED";
    case "REJECTED":
      return "DECLINED";
    case "PENDING":
    default:
      return "PENDING_REVIEW";
  }
}

export function getClientApplicationDisplayStatusLabel(
  status: ClientApplicationDisplayStatus
) {
  switch (status) {
    case "HIRED":
      return "Hired";
    case "DECLINED":
      return "Declined";
    case "WITHDRAWN":
      return "Withdrawn";
    case "PENDING_REVIEW":
    default:
      return "Pending Review";
  }
}

export function getClientApplicationsPageStats(
  applications: Array<Pick<ClientApplicationRecord, "status">>
): ClientApplicationsPageStats {
  return applications.reduce<ClientApplicationsPageStats>(
    (stats, application) => {
      stats.total += 1;

      switch (getClientApplicationDisplayStatus(application.status)) {
        case "PENDING_REVIEW":
          stats.pending += 1;
          break;
        case "HIRED":
          stats.hired += 1;
          break;
        case "DECLINED":
          stats.declined += 1;
          break;
        case "WITHDRAWN":
          stats.withdrawn += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, pending: 0, hired: 0, declined: 0, withdrawn: 0 }
  );
}

export function getClientApplicationTabCounts(
  applications: SerializedClientLeadApplication[]
) {
  return applications.reduce(
    (counts, application) => {
      counts.all += 1;

      switch (application.displayStatus) {
        case "PENDING_REVIEW":
          counts.pending += 1;
          break;
        case "HIRED":
          counts.hired += 1;
          break;
        case "DECLINED":
          counts.declined += 1;
          break;
        case "WITHDRAWN":
          counts.withdrawn += 1;
          break;
        default:
          break;
      }

      return counts;
    },
    { all: 0, pending: 0, hired: 0, declined: 0, withdrawn: 0 }
  );
}

export function filterClientApplicationsByTab(
  applications: SerializedClientLeadApplication[],
  tab: ClientApplicationPageTab
) {
  if (tab === "all") {
    return applications;
  }

  return applications.filter((application) => {
    switch (tab) {
      case "pending":
        return application.displayStatus === "PENDING_REVIEW";
      case "hired":
        return application.displayStatus === "HIRED";
      case "declined":
        return application.displayStatus === "DECLINED";
      case "withdrawn":
        return application.displayStatus === "WITHDRAWN";
      default:
        return true;
    }
  });
}

export function searchClientApplications(
  applications: SerializedClientLeadApplication[],
  query: string
) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return applications;
  }

  return applications.filter((application) => {
    return (
      application.companyName.toLowerCase().includes(normalized) ||
      application.leadTitle.toLowerCase().includes(normalized) ||
      application.leadLocation.toLowerCase().includes(normalized)
    );
  });
}

export function paginateClientApplications<T>(
  items: T[],
  page: number,
  pageSize: number
) {
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

export function formatClientApplicationsPagination(
  rangeStart: number,
  rangeEnd: number,
  total: number
) {
  if (total === 0) {
    return "Showing 0 to 0 of 0 applications";
  }

  return `Showing ${rangeStart} to ${rangeEnd} of ${total} applications`;
}

function formatAppliedDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppliedTimeLabel(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function serializeClientLeadApplication(
  application: ClientApplicationRecord
): SerializedClientLeadApplication {
  const displayStatus = getClientApplicationDisplayStatus(application.status);

  return {
    id: application.id,
    companyName: application.company.companyName,
    logoUrl: application.company.logoUrl,
    leadTitle: application.securityLead.serviceNeeded,
    leadLocation: `${application.securityLead.city}, ${application.securityLead.state}`,
    leadDateLabel: formatLeadDateLabel(
      application.securityLead.dateNeeded.toISOString()
    ),
    leadTimeLabel: formatLeadTimeRange(
      application.securityLead.startTime.toISOString(),
      application.securityLead.endTime.toISOString()
    ),
    appliedDateLabel: formatAppliedDateLabel(application.createdAt),
    appliedTimeLabel: formatAppliedTimeLabel(application.createdAt),
    displayStatus,
    offerLabel: application.securityLead.budgetOffer,
    profileHref: `/client/leads/${application.securityLeadId}/companies/${application.companyId}`,
  };
}
