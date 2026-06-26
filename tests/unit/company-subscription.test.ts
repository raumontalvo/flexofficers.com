import { describe, expect, it } from "vitest";
import { CompanySubscriptionStatus } from "@/app/generated/prisma/enums";
import { isCompanySubscriptionActive } from "@/lib/company-subscription";

describe("isCompanySubscriptionActive", () => {
  const now = new Date("2026-06-25T12:00:00.000Z");

  it("returns true when status is ACTIVE and period end is in the future", () => {
    expect(
      isCompanySubscriptionActive(
        {
          subscriptionStatus: CompanySubscriptionStatus.ACTIVE,
          subscriptionCurrentPeriodEnd: new Date("2027-06-25T12:00:00.000Z"),
        },
        now
      )
    ).toBe(true);
  });

  it("returns false when status is ACTIVE but period end is missing", () => {
    expect(
      isCompanySubscriptionActive(
        {
          subscriptionStatus: CompanySubscriptionStatus.ACTIVE,
          subscriptionCurrentPeriodEnd: null,
        },
        now
      )
    ).toBe(false);
  });

  it("returns false when status is ACTIVE but period end has passed", () => {
    expect(
      isCompanySubscriptionActive(
        {
          subscriptionStatus: CompanySubscriptionStatus.ACTIVE,
          subscriptionCurrentPeriodEnd: new Date("2026-01-01T00:00:00.000Z"),
        },
        now
      )
    ).toBe(false);
  });

  it("returns false for non-active statuses", () => {
    expect(
      isCompanySubscriptionActive(
        {
          subscriptionStatus: CompanySubscriptionStatus.INACTIVE,
          subscriptionCurrentPeriodEnd: new Date("2027-06-25T12:00:00.000Z"),
        },
        now
      )
    ).toBe(false);

    expect(
      isCompanySubscriptionActive(
        {
          subscriptionStatus: CompanySubscriptionStatus.PAST_DUE,
          subscriptionCurrentPeriodEnd: new Date("2027-06-25T12:00:00.000Z"),
        },
        now
      )
    ).toBe(false);

    expect(
      isCompanySubscriptionActive(
        {
          subscriptionStatus: CompanySubscriptionStatus.CANCELED,
          subscriptionCurrentPeriodEnd: new Date("2027-06-25T12:00:00.000Z"),
        },
        now
      )
    ).toBe(false);
  });
});
