import { describe, expect, it } from "vitest";
import {
  CompanyAccessStatus,
  CompanySubscriptionStatus,
} from "@/app/generated/prisma/enums";
import {
  getCompanyBillingStatus,
  getCompanyBillingStatusLabel,
  serializeCompanyBillingPageData,
} from "@/lib/company-billing-page-data";

describe("company billing page data", () => {
  const now = new Date("2026-06-25T12:00:00.000Z");

  it("returns trial status for active trials", () => {
    const company = {
      accessStatus: CompanyAccessStatus.TRIAL,
      trialEndsAt: new Date("2026-07-01T12:00:00.000Z"),
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };

    expect(getCompanyBillingStatus(company, now)).toBe("trial");
    expect(getCompanyBillingStatusLabel("trial")).toBe("Trial");

    const billing = serializeCompanyBillingPageData({
      company,
      stripeConnected: false,
      stripeBillingReady: false,
      now,
    });

    expect(billing.status).toBe("trial");
    expect(billing.isOnTrial).toBe(true);
    expect(billing.trialDaysRemaining).toBe(6);
    expect(billing.trialEndsAt).toBe("July 1, 2026");
    expect(billing.planName).toBe("FlexOfficers Annual");
    expect(billing.planAnnualAmount).toBe("$599.00");
    expect(billing.autoRenewalEnabled).toBe(false);
  });

  it("returns active status for active subscriptions", () => {
    const company = {
      accessStatus: CompanyAccessStatus.TRIAL,
      trialEndsAt: new Date("2026-06-01T12:00:00.000Z"),
      subscriptionStatus: CompanySubscriptionStatus.ACTIVE,
      subscriptionCurrentPeriodEnd: new Date("2027-06-25T12:00:00.000Z"),
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
    };

    const billing = serializeCompanyBillingPageData({
      company,
      stripeConnected: true,
      stripeBillingReady: true,
      now,
    });

    expect(billing.status).toBe("active");
    expect(billing.statusLabel).toBe("Active");
    expect(billing.isOnTrial).toBe(false);
    expect(billing.autoRenewalEnabled).toBe(true);
    expect(billing.nextRenewal).toBe("June 25, 2027");
    expect(billing.nextCharge).toBe("$599.00");
    expect(billing.features).toContain("Unlimited Shift Posts");
  });

  it("returns expired status when trial and subscription are inactive", () => {
    const company = {
      accessStatus: CompanyAccessStatus.EXPIRED,
      trialEndsAt: new Date("2026-06-01T12:00:00.000Z"),
      subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
      subscriptionCurrentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };

    const billing = serializeCompanyBillingPageData({
      company,
      stripeConnected: false,
      stripeBillingReady: false,
      now,
    });

    expect(billing.status).toBe("expired");
    expect(billing.statusLabel).toBe("Expired");
    expect(billing.isOnTrial).toBe(false);
    expect(billing.nextRenewal).toBeNull();
  });

  it("passes through Stripe payment method and invoices without fake data", () => {
    const company = {
      accessStatus: CompanyAccessStatus.ACTIVE,
      trialEndsAt: null,
      subscriptionStatus: CompanySubscriptionStatus.ACTIVE,
      subscriptionCurrentPeriodEnd: new Date("2027-06-25T12:00:00.000Z"),
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
    };

    const billing = serializeCompanyBillingPageData({
      company,
      stripeConnected: true,
      stripeBillingReady: true,
      paymentMethod: {
        brand: "Visa",
        last4: "4242",
        expiration: "12/28",
        isDefault: true,
      },
      invoices: [
        {
          id: "in_123",
          date: "Jun 25, 2026",
          description: "FlexOfficers Annual Subscription",
          status: "Paid",
          amount: "$599.00",
          downloadUrl: "https://stripe.example/invoice.pdf",
        },
      ],
      now,
    });

    expect(billing.paymentMethod).toEqual({
      brand: "Visa",
      last4: "4242",
      expiration: "12/28",
      isDefault: true,
    });
    expect(billing.invoices).toHaveLength(1);
    expect(billing.invoices[0]?.description).toBe(
      "FlexOfficers Annual Subscription"
    );
  });
});
