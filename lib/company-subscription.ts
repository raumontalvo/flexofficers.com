import { CompanySubscriptionStatus } from "@/app/generated/prisma/enums";

export type CompanySubscriptionFields = {
  subscriptionStatus: CompanySubscriptionStatus;
  subscriptionCurrentPeriodEnd: Date | null;
};

export function isCompanySubscriptionActive(
  company: CompanySubscriptionFields,
  now: Date = new Date()
) {
  if (company.subscriptionStatus !== CompanySubscriptionStatus.ACTIVE) {
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
    case CompanySubscriptionStatus.PAST_DUE:
      return "Past due";
    case CompanySubscriptionStatus.CANCELED:
      return "Canceled";
    case CompanySubscriptionStatus.INACTIVE:
    default:
      return "Inactive";
  }
}
