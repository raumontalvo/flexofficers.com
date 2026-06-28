import { CompanyAccessStatus } from "@/app/generated/prisma/enums";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function getDefaultTrialFields(now: Date = new Date()) {
  return {
    trialStartedAt: now,
    trialEndsAt: addDays(now, 7),
    accessStatus: CompanyAccessStatus.TRIAL,
  };
}

export function calculateExtendedTrialEnd(
  currentTrialEndsAt: Date | null,
  daysToAdd: number,
  now: Date = new Date()
) {
  const base =
    currentTrialEndsAt && currentTrialEndsAt > now ? currentTrialEndsAt : now;

  return addDays(base, daysToAdd);
}

export function buildTrialExtensionUpdate(
  company: {
    trialEndsAt: Date | null;
  },
  daysToAdd: number,
  adminUserId: string,
  reason: string | null,
  now: Date = new Date()
) {
  return {
    trialEndsAt: calculateExtendedTrialEnd(company.trialEndsAt, daysToAdd, now),
    accessStatus: CompanyAccessStatus.TRIAL,
    trialExtendedAt: now,
    trialExtendedByAdminId: adminUserId,
    trialExtensionReason: reason?.trim() || null,
  };
}

export function getTrialDaysRemaining(
  trialEndsAt: Date | null,
  now: Date = new Date()
) {
  if (!trialEndsAt) {
    return null;
  }

  const remainingMs = trialEndsAt.getTime() - now.getTime();

  if (remainingMs <= 0) {
    return 0;
  }

  return Math.ceil(remainingMs / MS_PER_DAY);
}
