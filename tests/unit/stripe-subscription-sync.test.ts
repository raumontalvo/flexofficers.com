import { describe, expect, it } from "vitest";
import { CompanySubscriptionStatus } from "@/app/generated/prisma/enums";
import { mapStripeSubscriptionStatus } from "@/lib/stripe-subscription-status";

describe("mapStripeSubscriptionStatus", () => {
  it("maps Stripe active and trialing statuses", () => {
    expect(mapStripeSubscriptionStatus("active")).toBe(
      CompanySubscriptionStatus.ACTIVE
    );
    expect(mapStripeSubscriptionStatus("trialing")).toBe(
      CompanySubscriptionStatus.TRIALING
    );
  });

  it("maps delinquent and canceled statuses", () => {
    expect(mapStripeSubscriptionStatus("past_due")).toBe(
      CompanySubscriptionStatus.PAST_DUE
    );
    expect(mapStripeSubscriptionStatus("canceled")).toBe(
      CompanySubscriptionStatus.CANCELED
    );
    expect(mapStripeSubscriptionStatus("unpaid")).toBe(
      CompanySubscriptionStatus.CANCELED
    );
  });

  it("maps incomplete statuses to inactive", () => {
    expect(mapStripeSubscriptionStatus("incomplete")).toBe(
      CompanySubscriptionStatus.INACTIVE
    );
    expect(mapStripeSubscriptionStatus("incomplete_expired")).toBe(
      CompanySubscriptionStatus.INACTIVE
    );
  });
});
