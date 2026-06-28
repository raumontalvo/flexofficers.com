import { createStripeCheckoutSession } from "@/lib/stripe-billing-handlers";

export async function POST(request: Request) {
  return createStripeCheckoutSession(request);
}
