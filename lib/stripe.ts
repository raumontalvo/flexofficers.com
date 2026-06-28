import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function readEnv(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getStripeSecretKey() {
  return readEnv(process.env.STRIPE_SECRET_KEY);
}

export function getStripePublishableKey() {
  return readEnv(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function getStripePriceId() {
  return readEnv(process.env.STRIPE_PRICE_ID);
}

export function getStripeWebhookSecret() {
  return readEnv(process.env.STRIPE_WEBHOOK_SECRET);
}

export function getAppUrl() {
  return readEnv(process.env.NEXT_PUBLIC_APP_URL) || "http://localhost:3000";
}

type StripeEnvInput = {
  secretKey?: string | null;
  publishableKey?: string | null;
  priceId?: string | null;
};

export function getStripeBillingReadiness(env: StripeEnvInput = {}) {
  const secretKey = readEnv(env.secretKey ?? process.env.STRIPE_SECRET_KEY);
  const publishableKey = readEnv(
    env.publishableKey ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  const priceId = readEnv(env.priceId ?? process.env.STRIPE_PRICE_ID);

  const configured = Boolean(secretKey && publishableKey);

  return {
    configured,
    billingReady: configured && Boolean(priceId),
    secretKey,
    publishableKey,
    priceId,
  };
}

export function isStripeConfigured(env: StripeEnvInput = {}) {
  return getStripeBillingReadiness(env).configured;
}

export function isStripeBillingReady(env: StripeEnvInput = {}) {
  return getStripeBillingReadiness(env).billingReady;
}

export function getStripeClient() {
  const secretKey = getStripeSecretKey();

  if (!secretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!host) {
    return getAppUrl();
  }

  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}
