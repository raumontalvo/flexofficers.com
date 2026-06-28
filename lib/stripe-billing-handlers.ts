import { NextResponse } from "next/server";
import { getAuthenticatedCompanyForBilling } from "@/lib/company-billing-auth";
import {
  ensureStripeCustomerForCheckout,
  requireValidStripeCustomer,
} from "@/lib/company-billing-customer";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  getAppUrl,
  getRequestOrigin,
  getStripeClient,
  getStripePriceId,
  isStripeBillingReady,
} from "@/lib/stripe";

export function stripeApiError(error: unknown, status = 500) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unknown Stripe error",
    },
    { status }
  );
}

async function requireBillingAuth(request: Request, bucket: string) {
  const auth = await getAuthenticatedCompanyForBilling();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  const rateLimitResponse = enforceRateLimit({
    request,
    clerkUserId: auth.clerkUserId,
    bucket,
    profile: "strict",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  if (!isStripeBillingReady()) {
    return NextResponse.json(
      { error: "Stripe billing is not configured." },
      { status: 503 }
    );
  }

  return auth;
}

export async function createStripeCheckoutSession(request: Request) {
  try {
    const authOrResponse = await requireBillingAuth(request, "stripe-checkout");

    if (authOrResponse instanceof NextResponse) {
      return authOrResponse;
    }

    const stripe = getStripeClient();
    const priceId = getStripePriceId();

    if (!stripe || !priceId) {
      return NextResponse.json(
        { error: "Stripe billing is not configured." },
        { status: 503 }
      );
    }

    const customerId = await ensureStripeCustomerForCheckout({
      companyId: authOrResponse.company.id,
      companyName: authOrResponse.company.companyName,
      stripeCustomerId: authOrResponse.company.stripeCustomerId,
      email: authOrResponse.user.email,
    });

    if (!customerId) {
      return NextResponse.json(
        { error: "Unable to create Stripe customer." },
        { status: 500 }
      );
    }

    const appUrl = getAppUrl();
    const metadata = {
      clerkUserId: authOrResponse.clerkUserId,
      companyId: authOrResponse.company.id,
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/company/billing?success=true`,
      cancel_url: `${appUrl}/company/billing?canceled=true`,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to start checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return stripeApiError(error);
  }
}

export async function createStripePortalSession(request: Request) {
  try {
    const authOrResponse = await requireBillingAuth(request, "stripe-portal");

    if (authOrResponse instanceof NextResponse) {
      return authOrResponse;
    }

    const stripe = getStripeClient();

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe billing is not configured." },
        { status: 503 }
      );
    }

    const customerId = await requireValidStripeCustomer({
      companyId: authOrResponse.company.id,
      stripeCustomerId: authOrResponse.company.stripeCustomerId,
    });

    if (!customerId) {
      return NextResponse.json(
        {
          error:
            "No Stripe billing account is connected yet. Start a subscription first.",
        },
        { status: 400 }
      );
    }

    const returnUrl = `${getRequestOrigin(request)}/company/billing`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to open billing portal." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return stripeApiError(error);
  }
}

export async function createStripePaymentMethodSession(request: Request) {
  try {
    const authOrResponse = await requireBillingAuth(
      request,
      "stripe-payment-method"
    );

    if (authOrResponse instanceof NextResponse) {
      return authOrResponse;
    }

    const stripe = getStripeClient();

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe billing is not configured." },
        { status: 503 }
      );
    }

    const customerId = await requireValidStripeCustomer({
      companyId: authOrResponse.company.id,
      stripeCustomerId: authOrResponse.company.stripeCustomerId,
    });

    if (!customerId) {
      return NextResponse.json(
        {
          error:
            "No Stripe billing account is connected yet. Start a subscription first.",
        },
        { status: 400 }
      );
    }

    const returnUrl = `${getRequestOrigin(request)}/company/billing`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      flow_data: {
        type: "payment_method_update",
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: returnUrl,
          },
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to open payment method update." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return stripeApiError(error);
  }
}
