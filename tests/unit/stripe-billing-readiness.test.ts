import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAppUrl,
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

describe("getAppUrl", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("defaults to localhost during development", () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_URL: "https://flexofficers.com",
    };

    expect(getAppUrl()).toBe("http://localhost:3000");
  });

  it("uses localhost env override during development", () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    };

    expect(getAppUrl()).toBe("http://localhost:3000");
  });

  it("uses production app url outside development", () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: "https://flexofficers.com",
    };

    expect(getAppUrl()).toBe("https://flexofficers.com");
  });

  it("falls back to APP_URL when NEXT_PUBLIC_APP_URL is missing", () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: undefined,
      APP_URL: "https://app.flexofficers.com",
    };

    expect(getAppUrl()).toBe("https://app.flexofficers.com");
  });
});
