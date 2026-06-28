import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import {
  getCompanyAccessSummary,
  getEffectiveAccessStatus,
} from "@/lib/company-access";
import {
  COMPANY_ANNUAL_PLAN,
  COMPANY_ANNUAL_PLAN_FEATURES,
} from "@/lib/company-billing-plan";
import type {
  SerializedStripeInvoice,
  SerializedStripePaymentMethod,
} from "@/lib/company-billing-stripe";
import { isCompanySubscriptionActive } from "@/lib/company-subscription";

export type CompanyBillingStatus = "trial" | "active" | "expired";

export type CompanyBillingPageData = {
  planName: string;
  planPriceDisplay: string;
  planAnnualAmount: string;
  billingCycle: string;
  status: CompanyBillingStatus;
  statusLabel: string;
  autoRenewalEnabled: boolean;
  nextRenewal: string | null;
  nextCharge: string;
  isOnTrial: boolean;
  trialDaysRemaining: number | null;
  trialEndsAt: string | null;
  paymentMethod: SerializedStripePaymentMethod | null;
  invoices: SerializedStripeInvoice[];
  stripeConnected: boolean;
  stripeBillingReady: boolean;
  hasValidStripeCustomer: boolean;
  features: readonly string[];
};

export type CompanyBillingSource = {
  accessStatus: CompanyAccessStatus;
  trialEndsAt: Date | null;
  subscriptionStatus: Parameters<typeof isCompanySubscriptionActive>[0]["subscriptionStatus"];
  subscriptionCurrentPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

function formatBillingDate(date: Date | null | undefined) {
  if (!date) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCompanyBillingStatus(
  company: CompanyBillingSource,
  now: Date = new Date()
): CompanyBillingStatus {
  if (isCompanySubscriptionActive(company, now)) {
    return "active";
  }

  const effectiveStatus = getEffectiveAccessStatus(company, now);

  if (effectiveStatus === CompanyAccessStatus.TRIAL) {
    return "trial";
  }

  return "expired";
}

export function getCompanyBillingStatusLabel(status: CompanyBillingStatus) {
  switch (status) {
    case "trial":
      return "Trial";
    case "active":
      return "Active";
    case "expired":
    default:
      return "Expired";
  }
}

export function serializeCompanyBillingPageData(input: {
  company: CompanyBillingSource;
  stripeConnected: boolean;
  stripeBillingReady: boolean;
  hasValidStripeCustomer: boolean;
  paymentMethod?: SerializedStripePaymentMethod | null;
  invoices?: SerializedStripeInvoice[];
  now?: Date;
}): CompanyBillingPageData {
  const now = input.now ?? new Date();
  const status = getCompanyBillingStatus(input.company, now);
  const accessSummary = getCompanyAccessSummary(input.company, now);
  const nextRenewal = formatBillingDate(
    input.company.subscriptionCurrentPeriodEnd
  );

  return {
    planName: COMPANY_ANNUAL_PLAN.name,
    planPriceDisplay: COMPANY_ANNUAL_PLAN.priceDisplay,
    planAnnualAmount: COMPANY_ANNUAL_PLAN.priceAnnualDisplay,
    billingCycle: COMPANY_ANNUAL_PLAN.billingCycle,
    status,
    statusLabel: getCompanyBillingStatusLabel(status),
    autoRenewalEnabled: Boolean(input.company.stripeSubscriptionId),
    nextRenewal,
    nextCharge: COMPANY_ANNUAL_PLAN.priceAnnualDisplay,
    isOnTrial: status === "trial",
    trialDaysRemaining: accessSummary.daysRemaining,
    trialEndsAt: formatBillingDate(input.company.trialEndsAt),
    paymentMethod: input.paymentMethod ?? null,
    invoices: input.invoices ?? [],
    stripeConnected: input.stripeConnected,
    stripeBillingReady: input.stripeBillingReady,
    hasValidStripeCustomer: input.hasValidStripeCustomer,
    features: COMPANY_ANNUAL_PLAN_FEATURES,
  };
}
