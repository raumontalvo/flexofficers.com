import type { Prisma } from "@/app/generated/prisma/client";
import { LeadPaymentStatus, LeadStatus } from "@/app/generated/prisma/enums";
import { formatAdminDate, formatLocation } from "@/lib/admin-officers";

export const adminClientSelect = {
  id: true,
  contactName: true,
  companyName: true,
  phone: true,
  email: true,
  profilePhotoUrl: true,
  industry: true,
  website: true,
  city: true,
  state: true,
  address: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      email: true,
      createdAt: true,
    },
  },
  leads: {
    select: {
      id: true,
      paymentStatus: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  },
  _count: {
    select: {
      leads: true,
    },
  },
} satisfies Prisma.ClientSelect;

export type AdminClientRecord = Prisma.ClientGetPayload<{
  select: typeof adminClientSelect;
}>;

export type ClientAccountStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export type SerializedAdminClient = {
  id: string;
  displayName: string;
  contactName: string | null;
  companyName: string | null;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
  industry: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  locationLabel: string;
  accountStatus: ClientAccountStatus;
  leadCount: number;
  paidLeadCount: number;
  openLeadCount: number;
  applicationCount: number;
  lastLeadAt: string | null;
  joinedAt: string;
  updatedAt: string;
};

export type AdminClientStats = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
};

function toIso(date: Date | null | undefined) {
  return date ? date.toISOString() : null;
}

export function getClientAccountStatus(
  client: Pick<AdminClientRecord, "contactName" | "email" | "user" | "leads">
): ClientAccountStatus {
  const paidLeadCount = client.leads.filter(
    (lead) => lead.paymentStatus === LeadPaymentStatus.PAID
  ).length;

  if (paidLeadCount > 0) {
    return "ACTIVE";
  }

  if (client.leads.length > 0) {
    return "PENDING";
  }

  const email = client.email?.trim() || client.user.email?.trim();
  const contactName = client.contactName?.trim();

  if (contactName && email) {
    return "PENDING";
  }

  return "INACTIVE";
}

export function serializeAdminClient(client: AdminClientRecord): SerializedAdminClient {
  const email = client.email?.trim() || client.user.email;
  const paidLeadCount = client.leads.filter(
    (lead) => lead.paymentStatus === LeadPaymentStatus.PAID
  ).length;
  const openLeadCount = client.leads.filter(
    (lead) => lead.status === LeadStatus.OPEN
  ).length;
  const applicationCount = client.leads.reduce(
    (sum, lead) => sum + lead._count.applications,
    0
  );
  const displayName =
    client.contactName?.trim() ||
    client.companyName?.trim() ||
    email ||
    "Unnamed client";

  return {
    id: client.id,
    displayName,
    contactName: client.contactName,
    companyName: client.companyName,
    email,
    phone: client.phone,
    profilePhotoUrl: client.profilePhotoUrl,
    industry: client.industry,
    website: client.website,
    city: client.city,
    state: client.state,
    locationLabel: formatLocation(client.city, client.state),
    accountStatus: getClientAccountStatus(client),
    leadCount: client._count.leads,
    paidLeadCount,
    openLeadCount,
    applicationCount,
    lastLeadAt: toIso(client.leads[0]?.createdAt ?? null),
    joinedAt: client.user.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

export function getAdminClientStats(
  clients: Pick<SerializedAdminClient, "accountStatus">[]
): AdminClientStats {
  return clients.reduce<AdminClientStats>(
    (stats, client) => {
      stats.total += 1;

      switch (client.accountStatus) {
        case "ACTIVE":
          stats.active += 1;
          break;
        case "PENDING":
          stats.pending += 1;
          break;
        case "INACTIVE":
          stats.inactive += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, active: 0, pending: 0, inactive: 0 }
  );
}

function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = value == null ? "" : String(value);

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }

  return normalized;
}

export function buildClientsCsv(clients: SerializedAdminClient[]) {
  const headers = [
    "Client",
    "Email",
    "Status",
    "Company",
    "Location",
    "Leads",
    "Paid Leads",
    "Applications",
    "Joined",
  ];

  const rows = clients.map((client) => [
    client.displayName,
    client.email,
    client.accountStatus,
    client.companyName ?? "",
    client.locationLabel === "—" ? "" : client.locationLabel,
    client.leadCount,
    client.paidLeadCount,
    client.applicationCount,
    new Date(client.joinedAt).toLocaleDateString("en-US"),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
}

export { formatAdminDate, formatLocation };
