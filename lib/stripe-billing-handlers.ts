import { NextResponse } from "next/server";
import { getAuthenticatedCompanyForBilling } from "@/lib/company-billing-auth";
import { ensureStripeCustomer } from "@/lib/company-billing-customer";
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

async function requireStripeCustomer(
  auth: Exclude<Awaited<ReturnType<typeof requireBillingAuth>>, NextResponse>
) {
  const stripe = getStripeClient();

  if (!stripe) {
    return {
      error: NextResponse.json(
        { error: "Stripe billing is not configured." },
        { status: 503 }
      ),
    };
  }

  const customerId = await ensureStripeCustomer({
    companyId: auth.company.id,
    companyName: auth.company.companyName,
    stripeCustomerId: auth.company.stripeCustomerId,
    email: auth.user.email,
  });

  if (!customerId) {
    return {
      error: NextResponse.json(
        { error: "Unable to create Stripe customer." },
        { status: 500 }
      ),
    };
  }

  return { stripe, customerId };
}

export async function createStripeCheckoutSession(request: Request) {
  try {
    const authOrResponse = await requireBillingAuth(request, "stripe-checkout");

    if (authOrResponse instanceof NextResponse) {
      return authOrResponse;
    }

    const customerResult = await requireStripeCustomer(authOrResponse);

    if ("error" in customerResult) {
      return customerResult.error;
    }

    const priceId = getStripePriceId();

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe billing is not configured." },
        { status: 503 }
      );
    }

    const { stripe, customerId } = customerResult;
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

    const customerResult = await requireStripeCustomer(authOrResponse);

    if ("error" in customerResult) {
      return customerResult.error;
    }

    const { stripe, customerId } = customerResult;
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

    const customerResult = await requireStripeCustomer(authOrResponse);

    if ("error" in customerResult) {
      return customerResult.error;
    }

    const { stripe, customerId } = customerResult;
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
