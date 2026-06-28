import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { isStripeMissingCustomerError } from "@/lib/stripe-customer-errors";

describe("isStripeMissingCustomerError", () => {
  it("detects Stripe resource_missing customer errors", () => {
    const error = new Stripe.errors.StripeInvalidRequestError({
      message: "No such customer: 'cus_test'",
      type: "invalid_request_error",
      param: "customer",
      code: "resource_missing",
    });

    expect(isStripeMissingCustomerError(error)).toBe(true);
  });

  it("detects plain No such customer messages", () => {
    expect(
      isStripeMissingCustomerError(new Error("No such customer: 'cus_test'"))
    ).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isStripeMissingCustomerError(new Error("Network timeout"))).toBe(
      false
    );
  });
});
