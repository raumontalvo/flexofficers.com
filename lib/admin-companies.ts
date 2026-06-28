import {
  CompanyAccessStatus,
  CompanySubscriptionStatus,
} from "@/app/generated/prisma/enums";
import type { AdminCompanyRecord } from "@/lib/officer-fields";
import {
  getCompanyAccessSummary,
  getEffectiveAccessStatus,
} from "@/lib/company-access";
import { isCompanySubscriptionActive } from "@/lib/company-subscription";

export type SerializedAdminCompany = {
  id: string;
  companyName: string;
  contactName: string | null;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  logoUrl: string | null;
  verified: boolean;
  accessStatus: CompanyAccessStatus;
  effectiveStatus: CompanyAccessStatus;
  statusLabel: string;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  daysRemaining: number | null;
  planLabel: string;
  subscriptionStatus: CompanySubscriptionStatus;
  subscriptionCurrentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  trialExtendedAt: string | null;
  trialExtendedByAdminId: string | null;
  trialExtendedByEmail: string | null;
  trialExtensionReason: string | null;
  shiftCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCompanyStats = {
  total: number;
  active: number;
  onTrial: number;
  expired: number;
};

function toIso(date: Date | null | undefined) {
  return date ? date.toISOString() : null;
}

export function getCompanyPlanLabel(
  company: Pick<
    AdminCompanyRecord,
    | "accessStatus"
    | "trialEndsAt"
    | "subscriptionStatus"
    | "subscriptionCurrentPeriodEnd"
  >,
  now: Date = new Date()
) {
  if (isCompanySubscriptionActive(company, now)) {
    return "Annual Subscription";
  }

  const effectiveStatus = getEffectiveAccessStatus(company, now);

  if (effectiveStatus === CompanyAccessStatus.ACTIVE) {
    return "Paid (Manual)";
  }

  if (effectiveStatus === CompanyAccessStatus.TRIAL) {
    return "Trial";
  }

  return "Expired";
}

export function serializeAdminCompany(
  company: AdminCompanyRecord,
  extendedByEmail: string | null = null,
  now: Date = new Date()
): SerializedAdminCompany {
  const access = getCompanyAccessSummary(company, now);
  const contactEmail = company.email ?? company.user.email;

  return {
    id: company.id,
    companyName: company.companyName,
    contactName: company.contactName,
    contactEmail,
    phone: company.phone,
    address: company.address,
    city: company.city,
    state: company.state,
    website: company.website,
    logoUrl: company.logoUrl,
    verified: company.verified,
    accessStatus: company.accessStatus,
    effectiveStatus: access.effectiveStatus,
    statusLabel: access.statusLabel,
    trialStartedAt: toIso(company.trialStartedAt),
    trialEndsAt: toIso(company.trialEndsAt),
    daysRemaining: access.daysRemaining,
    planLabel: getCompanyPlanLabel(company, now),
    subscriptionStatus: company.subscriptionStatus,
    subscriptionCurrentPeriodEnd: toIso(company.subscriptionCurrentPeriodEnd),
    stripeCustomerId: company.stripeCustomerId,
    stripeSubscriptionId: company.stripeSubscriptionId,
    trialExtendedAt: toIso(company.trialExtendedAt),
    trialExtendedByAdminId: company.trialExtendedByAdminId,
    trialExtendedByEmail: extendedByEmail,
    trialExtensionReason: company.trialExtensionReason,
    shiftCount: company._count.shifts,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function getAdminCompanyStats(
  companies: Pick<SerializedAdminCompany, "effectiveStatus">[]
): AdminCompanyStats {
  return companies.reduce<AdminCompanyStats>(
    (stats, company) => {
      stats.total += 1;

      switch (company.effectiveStatus) {
        case CompanyAccessStatus.ACTIVE:
          stats.active += 1;
          break;
        case CompanyAccessStatus.TRIAL:
          stats.onTrial += 1;
          break;
        case CompanyAccessStatus.EXPIRED:
          stats.expired += 1;
          break;
        default:
          break;
      }

      return stats;
    },
    { total: 0, active: 0, onTrial: 0, expired: 0 }
  );
}

function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = value == null ? "" : String(value);

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }

  return normalized;
}

export function buildCompaniesCsv(companies: SerializedAdminCompany[]) {
  const headers = [
    "Company",
    "Contact Email",
    "Access Status",
    "Trial Ends",
    "Days Remaining",
    "Plan",
    "Shifts",
    "Created",
  ];

  const rows = companies.map((company) => [
    company.companyName,
    company.contactEmail,
    company.effectiveStatus,
    company.trialEndsAt
      ? new Date(company.trialEndsAt).toLocaleDateString("en-US")
      : "",
    company.daysRemaining ?? "",
    company.planLabel,
    company.shiftCount,
    new Date(company.createdAt).toLocaleDateString("en-US"),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
}

export function formatAdminDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDaysRemaining(daysRemaining: number | null) {
  if (daysRemaining === null) {
    return "—";
  }

  if (daysRemaining === 0) {
    return "Expired";
  }

  return `${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
}
