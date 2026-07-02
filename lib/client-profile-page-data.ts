import { LeadApplicationStatus, LeadPaymentStatus, LeadStatus } from "@/app/generated/prisma/enums";
import { SECURITY_LEAD_PRICE_CENTS } from "@/lib/security-lead-pricing";
import { resolveProfilePhotoUrl } from "@/lib/profile-photo";

export type SerializedClientActivityItem = {
  id: string;
  title: string;
  subtitle: string | null;
  timestampLabel: string;
  createdAt: string;
};

export type SerializedClientBilling = {
  totalSpentLabel: string;
  totalSpentCents: number;
  paidLeadCount: number;
  paymentMethodLabel: string | null;
  hasPaymentHistory: boolean;
};

export type SerializedClientNotificationPrefs = {
  emailNotifications: boolean;
  newCompanyApplications: boolean;
  messages: boolean;
  marketingEmails: boolean;
};

export type SerializedClientProfile = {
  contactName: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
  industry: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  emailVerified: boolean;
  memberSinceLabel: string;
  stats: {
    securityRequests: number;
    applications: number;
    completed: number;
  };
  billing: SerializedClientBilling;
  notifications: SerializedClientNotificationPrefs;
  recentActivity: SerializedClientActivityItem[];
};

function formatMemberSince(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatActivityDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(cents: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

type ClientRecord = {
  contactName: string | null;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  profilePhotoUrl: string | null;
  industry: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  notifyNewApplications: boolean;
  notifyMessages: boolean;
  notifyMarketing: boolean;
  createdAt: Date;
};

type UserRecord = {
  email: string;
  emailNotificationsEnabled: boolean;
};

type LeadSummary = {
  id: string;
  serviceNeeded: string;
  status: LeadStatus;
  paymentStatus: LeadPaymentStatus;
  createdAt: Date;
  applications: Array<{
    id: string;
    status: LeadApplicationStatus;
    createdAt: Date;
    company: { companyName: string | null };
  }>;
};

export function serializeClientProfile(input: {
  client: ClientRecord;
  user: UserRecord;
  clerkImageUrl: string | null;
  emailVerified: boolean;
  leads: LeadSummary[];
  locale?: string;
}): SerializedClientProfile {
  const locale = input.locale ?? "en-US";
  const email = input.client.email?.trim() || input.user.email.trim();
  const contactName = input.client.contactName?.trim() || "Client";
  const paidLeads = input.leads.filter(
    (lead) => lead.paymentStatus === LeadPaymentStatus.PAID
  );
  const totalSpentCents = paidLeads.length * SECURITY_LEAD_PRICE_CENTS;
  const applicationCount = input.leads.reduce(
    (sum, lead) => sum + lead.applications.length,
    0
  );
  const completedCount = input.leads.filter(
    (lead) => lead.status === LeadStatus.FILLED
  ).length;

  return {
    contactName,
    companyName: input.client.companyName?.trim() || null,
    email,
    phone: input.client.phone?.trim() || null,
    profilePhotoUrl:
      resolveProfilePhotoUrl(
        input.client.profilePhotoUrl ?? "",
        input.clerkImageUrl ?? ""
      ) || null,
    industry: input.client.industry?.trim() || null,
    website: input.client.website?.trim() || null,
    address: input.client.address?.trim() || null,
    city: input.client.city?.trim() || null,
    state: input.client.state?.trim() || null,
    zipCode: input.client.zipCode?.trim() || null,
    country: input.client.country?.trim() || null,
    emailVerified: input.emailVerified,
    memberSinceLabel: formatMemberSince(input.client.createdAt, locale),
    stats: {
      securityRequests: input.leads.length,
      applications: applicationCount,
      completed: completedCount,
    },
    billing: {
      totalSpentLabel: formatCurrency(totalSpentCents, locale),
      totalSpentCents,
      paidLeadCount: paidLeads.length,
      paymentMethodLabel:
        paidLeads.length > 0 ? "Stripe Checkout" : null,
      hasPaymentHistory: paidLeads.length > 0,
    },
    notifications: {
      emailNotifications: input.user.emailNotificationsEnabled,
      newCompanyApplications: input.client.notifyNewApplications,
      messages: input.client.notifyMessages,
      marketingEmails: input.client.notifyMarketing,
    },
    recentActivity: buildClientRecentActivity(input.leads, locale),
  };
}

export function buildClientRecentActivity(
  leads: LeadSummary[],
  locale = "en-US"
): SerializedClientActivityItem[] {
  const items: Array<SerializedClientActivityItem & { sortAt: number }> = [];

  for (const lead of leads) {
    items.push({
      id: `lead-${lead.id}`,
      title: "lead_created",
      subtitle: lead.serviceNeeded,
      timestampLabel: formatActivityDate(lead.createdAt, locale),
      createdAt: lead.createdAt.toISOString(),
      sortAt: lead.createdAt.getTime(),
    });

    if (lead.status === LeadStatus.FILLED) {
      items.push({
        id: `lead-filled-${lead.id}`,
        title: "request_completed",
        subtitle: lead.serviceNeeded,
        timestampLabel: formatActivityDate(lead.createdAt, locale),
        createdAt: lead.createdAt.toISOString(),
        sortAt: lead.createdAt.getTime() + 3,
      });
    }

    for (const application of lead.applications) {
      const companyName =
        application.company.companyName?.trim() || "Security company";

      items.push({
        id: `app-${application.id}`,
        title: "company_applied",
        subtitle: companyName,
        timestampLabel: formatActivityDate(application.createdAt, locale),
        createdAt: application.createdAt.toISOString(),
        sortAt: application.createdAt.getTime(),
      });

      if (application.status === LeadApplicationStatus.ACCEPTED) {
        items.push({
          id: `app-accepted-${application.id}`,
          title: "company_accepted",
          subtitle: companyName,
          timestampLabel: formatActivityDate(application.createdAt, locale),
          createdAt: application.createdAt.toISOString(),
          sortAt: application.createdAt.getTime() + 1,
        });
      }
    }
  }

  return items
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 12)
    .map(({ sortAt: _sortAt, ...item }) => item);
}

export type ClientProfileEditFormState = {
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profilePhotoUrl: string;
};

export function buildClientProfileEditFormState(input: {
  client: ClientRecord;
  userEmail: string;
  clerkImageUrl: string | null;
}): ClientProfileEditFormState {
  return {
    contactName: input.client.contactName?.trim() ?? "",
    email: input.client.email?.trim() || input.userEmail.trim(),
    phone: input.client.phone?.trim() ?? "",
    companyName: input.client.companyName?.trim() ?? "",
    industry: input.client.industry?.trim() ?? "",
    website: input.client.website?.trim() ?? "",
    address: input.client.address?.trim() ?? "",
    city: input.client.city?.trim() ?? "",
    state: input.client.state?.trim() ?? "",
    zipCode: input.client.zipCode?.trim() ?? "",
    country: input.client.country?.trim() ?? "",
    profilePhotoUrl:
      resolveProfilePhotoUrl(
        input.client.profilePhotoUrl ?? "",
        input.clerkImageUrl ?? ""
      ) ?? "",
  };
}
