import type Stripe from "stripe";
import { CompanySubscriptionStatus } from "@/app/generated/prisma/enums";

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): CompanySubscriptionStatus {
  switch (status) {
    case "active":
      return CompanySubscriptionStatus.ACTIVE;
    case "trialing":
      return CompanySubscriptionStatus.TRIALING;
    case "past_due":
      return CompanySubscriptionStatus.PAST_DUE;
    case "canceled":
    case "unpaid":
      return CompanySubscriptionStatus.CANCELED;
    case "incomplete":
    case "incomplete_expired":
    case "paused":
    default:
      return CompanySubscriptionStatus.INACTIVE;
  }
}
