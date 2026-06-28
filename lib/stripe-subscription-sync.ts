import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { mapStripeSubscriptionStatus } from "@/lib/stripe-subscription-status";

export { mapStripeSubscriptionStatus } from "@/lib/stripe-subscription-status";

function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
) {
  if (!customer || typeof customer === "string") {
    return customer ?? null;
  }

  if ("deleted" in customer && customer.deleted) {
    return null;
  }

  return customer.id;
}

function getSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id ?? null;
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnd = subscription.items.data[0]?.current_period_end;

  if (periodEnd) {
    return new Date(periodEnd * 1000);
  }

  if (subscription.cancel_at) {
    return new Date(subscription.cancel_at * 1000);
  }

  return null;
}

type SyncCompanySubscriptionInput = {
  companyId?: string | null;
  clerkUserId?: string | null;
  customerId?: string | null;
};

async function findCompanyForSubscription(
  subscription: Stripe.Subscription,
  input: SyncCompanySubscriptionInput = {}
) {
  if (input.companyId) {
    const company = await prisma.company.findUnique({
      where: {
        id: input.companyId,
      },
    });

    if (company) {
      return company;
    }
  }

  const customerId =
    input.customerId ?? getStripeCustomerId(subscription.customer);

  if (customerId) {
    const companyByCustomer = await prisma.company.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (companyByCustomer) {
      return companyByCustomer;
    }
  }

  return prisma.company.findFirst({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });
}

export async function syncCompanySubscriptionFromStripe(
  subscription: Stripe.Subscription,
  input: SyncCompanySubscriptionInput = {}
) {
  const company = await findCompanyForSubscription(subscription, input);

  if (!company) {
    return null;
  }

  const customerId =
    input.customerId ?? getStripeCustomerId(subscription.customer);

  await prisma.company.update({
    where: {
      id: company.id,
    },
    data: {
      stripeCustomerId: customerId ?? company.stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: mapStripeSubscriptionStatus(subscription.status),
      subscriptionCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
      subscriptionPriceId: getSubscriptionPriceId(subscription),
    },
  });

  return company.id;
}

export async function syncCompanyFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    return null;
  }

  const { getStripeClient } = await import("@/lib/stripe");
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return syncCompanySubscriptionFromStripe(subscription, {
    companyId: session.metadata?.companyId,
    clerkUserId: session.metadata?.clerkUserId,
    customerId: getStripeCustomerId(session.customer),
  });
}
