import type {
  LeadApplicationStatus,
  LeadPaymentStatus,
  LeadStatus,
  LeadUrgency,
} from "@/app/generated/prisma/enums";

export type SerializedSecurityLeadCard = {
  id: string;
  serviceNeeded: string;
  city: string;
  state: string;
  dateNeeded: string;
  startTime: string;
  endTime: string;
  budgetOffer: string;
  urgency: LeadUrgency;
  officersNeeded: number;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
  applicantCount: number;
};

export type SerializedClientLeadCard = {
  id: string;
  serviceNeeded: string;
  city: string;
  dateNeeded: string;
  budgetOffer: string;
  applicantCount: number;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
};

export type SerializedLeadApplicant = {
  id: string;
  message: string | null;
  status: LeadApplicationStatus;
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    city: string | null;
    state: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    licenseNumber: string | null;
    licenseState: string | null;
    verified: boolean;
  };
};

export function serializeSecurityLeadCard(lead: {
  id: string;
  serviceNeeded: string;
  city: string;
  state: string;
  dateNeeded: Date;
  startTime: Date;
  endTime: Date;
  budgetOffer: string;
  urgency: LeadUrgency;
  officersNeeded: number;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
  _count?: { applications: number };
}): SerializedSecurityLeadCard {
  return {
    id: lead.id,
    serviceNeeded: lead.serviceNeeded,
    city: lead.city,
    state: lead.state,
    dateNeeded: lead.dateNeeded.toISOString(),
    startTime: lead.startTime.toISOString(),
    endTime: lead.endTime.toISOString(),
    budgetOffer: lead.budgetOffer,
    urgency: lead.urgency,
    officersNeeded: lead.officersNeeded,
    status: lead.status,
    paymentStatus: lead.paymentStatus,
    applicantCount: lead._count?.applications ?? 0,
  };
}

export function serializeClientLeadCard(lead: {
  id: string;
  serviceNeeded: string;
  city: string;
  dateNeeded: Date;
  budgetOffer: string;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
  _count?: { applications: number };
}): SerializedClientLeadCard {
  return {
    id: lead.id,
    serviceNeeded: lead.serviceNeeded,
    city: lead.city,
    dateNeeded: lead.dateNeeded.toISOString(),
    budgetOffer: lead.budgetOffer,
    applicantCount: lead._count?.applications ?? 0,
    status: lead.status,
    paymentStatus: lead.paymentStatus,
  };
}

export function serializeLeadApplicant(application: {
  id: string;
  message: string | null;
  status: LeadApplicationStatus;
  createdAt: Date;
  company: {
    id: string;
    companyName: string;
    city: string | null;
    state: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    licenseNumber: string | null;
    licenseState: string | null;
    verified: boolean;
  };
}): SerializedLeadApplicant {
  return {
    id: application.id,
    message: application.message,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
    company: application.company,
  };
}

export function formatLeadDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLeadTimeRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

export function formatLeadUrgencyLabel(urgency: LeadUrgency) {
  return urgency === "URGENT" ? "Urgent" : "Standard";
}

export function formatLeadStatusLabel(status: LeadStatus) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "FILLED":
      return "Filled";
    case "CANCELLED":
    default:
      return "Cancelled";
  }
}

export function formatLeadApplicationStatusLabel(status: LeadApplicationStatus) {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
    default:
      return "Pending";
  }
}

export function buildPublicLeadsWhere() {
  return {
    status: "OPEN" as const,
    paymentStatus: "PAID" as const,
    postType: "PUBLIC" as const,
  };
}

export function buildCompanyPublicLeadsBrowseWhere() {
  return {
    paymentStatus: "PAID" as const,
    postType: "PUBLIC" as const,
  };
}
