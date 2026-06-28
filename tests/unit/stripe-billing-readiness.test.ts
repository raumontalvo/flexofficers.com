import { describe, expect, it } from "vitest";
import {
  getStripeBillingReadiness,
  isStripeBillingReady,
  isStripeConfigured,
} from "@/lib/stripe";

describe("stripe billing readiness", () => {
  it("requires secret key and publishable key for configured state", () => {
    expect(
      getStripeBillingReadiness({
        secretKey: "sk_test_123",
        publishableKey: "pk_test_123",
        priceId: null,
      })
    ).toEqual({
      configured: true,
      billingReady: false,
      secretKey: "sk_test_123",
      publishableKey: "pk_test_123",
      priceId: null,
    });
  });

  it("is billing ready when secret, publishable, and price id are set", () => {
    const readiness = getStripeBillingReadiness({
      secretKey: "sk_test_123",
      publishableKey: "pk_test_123",
      priceId: "price_123",
    });

    expect(readiness.billingReady).toBe(true);
    expect(isStripeConfigured(readiness)).toBe(true);
    expect(isStripeBillingReady(readiness)).toBe(true);
  });

  it("does not require webhook secret for billing readiness", () => {
    expect(
      isStripeBillingReady({
        secretKey: "sk_test_123",
        publishableKey: "pk_test_123",
        priceId: "price_123",
      })
    ).toBe(true);
  });

  it("treats empty strings as missing", () => {
    expect(
      getStripeBillingReadiness({
        secretKey: "   ",
        publishableKey: "pk_test_123",
        priceId: "price_123",
      }).billingReady
    ).toBe(false);
  });
});
