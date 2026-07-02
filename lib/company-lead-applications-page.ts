import type { LeadApplicationStatus } from "@/app/generated/prisma/enums";
import {
  formatLeadDateLabel,
  formatLeadTimeRange,
} from "@/lib/security-lead-data";

export const COMPANY_APPLICATIONS_PAGE_SIZE = 6;

export type CompanyApplicationPageTab =
  | "all"
  | "pending"
  | "hired"
  | "notSelected"
  | "withdrawn";

export type CompanyApplicationDisplayStatus =
  | "PENDING_REVIEW"
  | "HIRED"
  | "NOT_SELECTED"
  | "WITHDRAWN";

export type CompanyApplicationsPageStats = {
  total: number;
  pending: number;
  hired: number;
  notSelected: number;
};

export type SerializedCompanyLeadApplication = {
  id: string;
  leadTitle: string;
  leadLocation: string;
  leadDateLabel: string;
  leadTimeLabel: string;
  clientName: string;
  clientPhotoUrl: string | null;
  appliedDateLabel: string;
  appliedTimeLabel: string;
  displayStatus: CompanyApplicationDisplayStatus;
  offerLabel: string;
  detailHref: string;
};

type CompanyApplicationRecord = {
  id: string;
  status: LeadApplicationStatus;
  createdAt: Date;
  securityLeadId: string;
  securityLead: {
    serviceNeeded: string;
    city: string;
    state: string;
    dateNeeded: Date;
    startTime: Date;
    endTime: Date;
    budgetOffer: string;
    companyName: string | null;
    contactName: string;
    client: {
      companyName: string | null;
      contactName: string | null;
      profilePhotoUrl: string | null;
    };
  };
};

export function getCompanyApplicationDisplayStatus(
  status: LeadApplicationStatus
): CompanyApplicationDisplayStatus {
  switch (status) {
    case "ACCEPTED":
      return "HIRED";
    case "REJECTED":
      return "NOT_SELECTED";
    case "PENDING":
    default:
      return "PENDING_REVIEW";
  }
}

export function getCompanyApplicationDisplayStatusLabel(
  status: CompanyApplicationDisplayStatus
) {
  switch (status) {
    case "HIRED":
      return "Hired";
    case "NOT_SELECTED":
      return "Not Selected";
    case "WITHDRAWN":
      return "Withdrawn";
    case "PENDING_REVIEW":
    default:
      return "Pending Review";
  }
}

export function getCompanyClientDisplayName(
  securityLead: CompanyApplicationRecord["securityLead"]
) {
  return (
    securityLead.companyName?.trim() ||
    securityLead.client.companyName?.trim() ||
    securityLead.contactName?.trim() ||
    securityLead.client.contactName?.trim() ||
    "Client"
  );
}

export function getCompanyApplicationsPageStats(
  applications: Array<Pick<CompanyApplicationRecord, "status">>
): CompanyApplicationsPageStats {
  return applications.reduce<CompanyApplicationsPageStats>(
    (stats, application) => {
      stats.total += 1;

      switch (getCompanyApplicationDisplayStatus(application.status)) {
        case "PENDING_REVIEW":
          stats.pending += 1;
          break;
        case "HIRED":
          stats.hired += 1;
          break;
        case "NOT_SELECTED":
          stats.notSelected += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, pending: 0, hired: 0, notSelected: 0 }
  );
}

export function getCompanyApplicationTabCounts(
  applications: SerializedCompanyLeadApplication[]
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
        case "NOT_SELECTED":
          counts.notSelected += 1;
          break;
        case "WITHDRAWN":
          counts.withdrawn += 1;
          break;
        default:
          break;
      }

      return counts;
    },
    { all: 0, pending: 0, hired: 0, notSelected: 0, withdrawn: 0 }
  );
}

export function filterCompanyApplicationsByTab(
  applications: SerializedCompanyLeadApplication[],
  tab: CompanyApplicationPageTab
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
      case "notSelected":
        return application.displayStatus === "NOT_SELECTED";
      case "withdrawn":
        return application.displayStatus === "WITHDRAWN";
      default:
        return true;
    }
  });
}

export function searchCompanyApplications(
  applications: SerializedCompanyLeadApplication[],
  query: string
) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return applications;
  }

  return applications.filter((application) => {
    return (
      application.clientName.toLowerCase().includes(normalized) ||
      application.leadTitle.toLowerCase().includes(normalized) ||
      application.leadLocation.toLowerCase().includes(normalized)
    );
  });
}

export function paginateCompanyApplications<T>(
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

export function formatCompanyApplicationsPagination(
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

export function serializeCompanyLeadApplication(
  application: CompanyApplicationRecord
): SerializedCompanyLeadApplication {
  const displayStatus = getCompanyApplicationDisplayStatus(application.status);

  return {
    id: application.id,
    leadTitle: application.securityLead.serviceNeeded,
    leadLocation: `${application.securityLead.city}, ${application.securityLead.state}`,
    leadDateLabel: formatLeadDateLabel(
      application.securityLead.dateNeeded.toISOString()
    ),
    leadTimeLabel: formatLeadTimeRange(
      application.securityLead.startTime.toISOString(),
      application.securityLead.endTime.toISOString()
    ),
    clientName: getCompanyClientDisplayName(application.securityLead),
    clientPhotoUrl: application.securityLead.client.profilePhotoUrl,
    appliedDateLabel: formatAppliedDateLabel(application.createdAt),
    appliedTimeLabel: formatAppliedTimeLabel(application.createdAt),
    displayStatus,
    offerLabel: application.securityLead.budgetOffer,
    detailHref: `/company/leads/${application.securityLeadId}`,
  };
}
