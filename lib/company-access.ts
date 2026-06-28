import {
  CompanyAccessStatus,
  CompanySubscriptionStatus,
} from "@/app/generated/prisma/enums";
import { isCompanySubscriptionActive } from "@/lib/company-subscription";
import { getTrialDaysRemaining } from "@/lib/company-trial";

export type CompanyAccessFields = {
  accessStatus: CompanyAccessStatus;
  trialEndsAt: Date | null;
  subscriptionStatus: CompanySubscriptionStatus;
  subscriptionCurrentPeriodEnd: Date | null;
};

export function getEffectiveAccessStatus(
  company: Pick<CompanyAccessFields, "accessStatus" | "trialEndsAt">,
  now: Date = new Date()
): CompanyAccessStatus {
  if (company.accessStatus === CompanyAccessStatus.ACTIVE) {
    return CompanyAccessStatus.ACTIVE;
  }

  if (company.accessStatus === CompanyAccessStatus.EXPIRED) {
    return CompanyAccessStatus.EXPIRED;
  }

  if (!company.trialEndsAt || company.trialEndsAt <= now) {
    return CompanyAccessStatus.EXPIRED;
  }

  return CompanyAccessStatus.TRIAL;
}

export function canCompanyPostNewShifts(
  company: CompanyAccessFields,
  now: Date = new Date()
) {
  if (isCompanySubscriptionActive(company, now)) {
    return true;
  }

  const effectiveStatus = getEffectiveAccessStatus(company, now);

  return (
    effectiveStatus === CompanyAccessStatus.ACTIVE ||
    effectiveStatus === CompanyAccessStatus.TRIAL
  );
}

export function formatCompanyAccessStatus(
  company: Pick<CompanyAccessFields, "accessStatus" | "trialEndsAt">,
  now: Date = new Date()
) {
  const effectiveStatus = getEffectiveAccessStatus(company, now);

  switch (effectiveStatus) {
    case CompanyAccessStatus.ACTIVE:
      return "Active";
    case CompanyAccessStatus.TRIAL:
      return "Trial";
    case CompanyAccessStatus.EXPIRED:
    default:
      return "Expired";
  }
}

export function getCompanyPostingBlockMessage(
  company: CompanyAccessFields,
  now: Date = new Date()
) {
  if (canCompanyPostNewShifts(company, now)) {
    return null;
  }

  const effectiveStatus = getEffectiveAccessStatus(company, now);

  if (effectiveStatus === CompanyAccessStatus.EXPIRED) {
    return "Your trial has expired. Subscribe to post new shifts.";
  }

  return "An active subscription or trial is required to post new shifts.";
}

export function getCompanyAccessSummary(
  company: Pick<CompanyAccessFields, "accessStatus" | "trialEndsAt">,
  now: Date = new Date()
) {
  const effectiveStatus = getEffectiveAccessStatus(company, now);
  const daysRemaining = getTrialDaysRemaining(company.trialEndsAt, now);

  return {
    effectiveStatus,
    daysRemaining,
    statusLabel: formatCompanyAccessStatus(company, now),
  };
}
