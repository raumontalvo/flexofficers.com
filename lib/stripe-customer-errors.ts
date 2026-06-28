import Stripe from "stripe";

export function isStripeMissingCustomerError(error: unknown) {
  if (error instanceof Stripe.errors.StripeError) {
    if (error.code === "resource_missing") {
      const invalidRequest = error as Stripe.errors.StripeInvalidRequestError;

      if (
        invalidRequest.param === "customer" ||
        invalidRequest.param === "id"
      ) {
        return true;
      }
    }

    return error.message.includes("No such customer");
  }

  return (
    error instanceof Error && error.message.includes("No such customer")
  );
}
