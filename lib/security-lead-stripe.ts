import type Stripe from "stripe";
import { LeadPaymentStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripeClient } from "@/lib/stripe";

import {
  SECURITY_LEAD_PRICE_CENTS,
  SECURITY_LEAD_PRODUCT_NAME,
} from "@/lib/security-lead-pricing";

export function isStripeLeadPaymentReady() {
  return Boolean(getStripeClient());
}

export async function createSecurityLeadCheckoutSession(input: {
  leadId: string;
  clientId: string;
  clerkUserId: string;
  contactEmail: string;
}) {
  const stripe = getStripeClient();

  if (!stripe) {
    return { error: "Stripe is not configured." as const };
  }

  const appUrl = getAppUrl();
  const metadata = {
    securityLeadId: input.leadId,
    clientId: input.clientId,
    clerkUserId: input.clerkUserId,
    type: "security_lead",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.contactEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: SECURITY_LEAD_PRICE_CENTS,
          product_data: {
            name: SECURITY_LEAD_PRODUCT_NAME,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/client/leads?paid=${input.leadId}`,
    cancel_url: `${appUrl}/client/leads/new?canceled=${input.leadId}`,
    metadata,
    payment_intent_data: {
      metadata,
    },
  });

  if (!session.url) {
    return { error: "Unable to start checkout." as const };
  }

  await prisma.securityLead.update({
    where: { id: input.leadId },
    data: {
      stripeCheckoutSessionId: session.id,
    },
  });

  return { url: session.url };
}

export async function syncSecurityLeadFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  if (session.metadata?.type !== "security_lead") {
    return;
  }

  const leadId = session.metadata.securityLeadId;

  if (!leadId) {
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  if (session.payment_status !== "paid") {
    await prisma.securityLead.updateMany({
      where: { id: leadId },
      data: {
        paymentStatus: LeadPaymentStatus.FAILED,
      },
    });
    return;
  }

  await prisma.securityLead.updateMany({
    where: { id: leadId },
    data: {
      paymentStatus: LeadPaymentStatus.PAID,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
    },
  });
}
