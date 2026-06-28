import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  getStripeClient,
  getStripeWebhookSecret,
} from "@/lib/stripe";
import {
  syncCompanyFromCheckoutSession,
  syncCompanySubscriptionFromStripe,
} from "@/lib/stripe-subscription-sync";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription") {
          await syncCompanyFromCheckoutSession(session);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncCompanySubscriptionFromStripe(subscription, {
          companyId: subscription.metadata?.companyId,
          clerkUserId: subscription.metadata?.clerkUserId,
        });
        break;
      }
      default:
        break;
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to process Stripe webhook." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
