import type {
  LeadApplicationStatus,
  LeadPaymentStatus,
  LeadStatus,
} from "@/app/generated/prisma/enums";
import {
  formatLeadDateLabel,
  formatLeadTimeRange,
} from "@/lib/security-lead-data";

export type ClientLeadDisplayStatus =
  | "ACTIVE"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

export type ClientDashboardStats = {
  totalLeads: number;
  activeLeads: number;
  pendingApplicants: number;
};

export type ClientApplicantsOverview = {
  hired: number;
  pendingReview: number;
  declined: number;
  withdrawn: number;
  total: number;
};

export type SerializedClientDashboardLead = {
  id: string;
  title: string;
  displayStatus: ClientLeadDisplayStatus;
  locationLabel: string;
  dateLabel: string;
  timeLabel: string;
  applicantCount: number;
  href: string;
};

type DashboardLeadRecord = {
  id: string;
  serviceNeeded: string;
  city: string;
  state: string;
  dateNeeded: Date;
  startTime: Date;
  endTime: Date;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
  _count?: { applications: number };
};

type DashboardApplicationRecord = {
  status: LeadApplicationStatus;
};

export function getClientLeadDisplayStatus(input: {
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
}): ClientLeadDisplayStatus {
  if (input.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (input.status === "FILLED") {
    return "COMPLETED";
  }

  if (input.paymentStatus !== "PAID") {
    return "PENDING";
  }

  return "ACTIVE";
}

export function getClientLeadDisplayStatusLabel(status: ClientLeadDisplayStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
    default:
      return "Cancelled";
  }
}

export function getClientDashboardStats(input: {
  leads: Array<Pick<DashboardLeadRecord, "status" | "paymentStatus">>;
  pendingApplicants: number;
}): ClientDashboardStats {
  const activeLeads = input.leads.filter(
    (lead) => lead.status === "OPEN" && lead.paymentStatus === "PAID"
  ).length;

  return {
    totalLeads: input.leads.length,
    activeLeads,
    pendingApplicants: input.pendingApplicants,
  };
}

export function getClientApplicantsOverview(
  applications: DashboardApplicationRecord[]
): ClientApplicantsOverview {
  const overview = applications.reduce(
    (counts, application) => {
      switch (application.status) {
        case "ACCEPTED":
          counts.hired += 1;
          break;
        case "PENDING":
          counts.pendingReview += 1;
          break;
        case "REJECTED":
          counts.declined += 1;
          break;
        default:
          break;
      }

      return counts;
    },
    { hired: 0, pendingReview: 0, declined: 0, withdrawn: 0 }
  );

  return {
    ...overview,
    total: applications.length,
  };
}

export function serializeClientDashboardLead(
  lead: DashboardLeadRecord
): SerializedClientDashboardLead {
  const displayStatus = getClientLeadDisplayStatus(lead);

  return {
    id: lead.id,
    title: lead.serviceNeeded,
    displayStatus,
    locationLabel: `${lead.city}, ${lead.state}`,
    dateLabel: formatLeadDateLabel(lead.dateNeeded.toISOString()),
    timeLabel: formatLeadTimeRange(
      lead.startTime.toISOString(),
      lead.endTime.toISOString()
    ),
    applicantCount: lead._count?.applications ?? 0,
    href: `/client/leads/${lead.id}/applicants`,
  };
}
