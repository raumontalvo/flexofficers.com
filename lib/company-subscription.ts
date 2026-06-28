import { CompanySubscriptionStatus } from "@/app/generated/prisma/enums";

export type CompanySubscriptionFields = {
  subscriptionStatus: CompanySubscriptionStatus;
  subscriptionCurrentPeriodEnd: Date | null;
};

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<CompanySubscriptionStatus>([
  CompanySubscriptionStatus.ACTIVE,
  CompanySubscriptionStatus.TRIALING,
]);

export function isCompanySubscriptionActive(
  company: CompanySubscriptionFields,
  now: Date = new Date()
) {
  if (!ACTIVE_SUBSCRIPTION_STATUSES.has(company.subscriptionStatus)) {
    return false;
  }

  if (!company.subscriptionCurrentPeriodEnd) {
    return false;
  }

  return company.subscriptionCurrentPeriodEnd > now;
}

export function formatCompanySubscriptionStatus(
  status: CompanySubscriptionStatus
) {
  switch (status) {
    case CompanySubscriptionStatus.ACTIVE:
      return "Active";
    case CompanySubscriptionStatus.TRIALING:
      return "Trialing";
    case CompanySubscriptionStatus.PAST_DUE:
      return "Past due";
    case CompanySubscriptionStatus.CANCELED:
      return "Canceled";
    case CompanySubscriptionStatus.INACTIVE:
    default:
      return "Inactive";
  }
}
