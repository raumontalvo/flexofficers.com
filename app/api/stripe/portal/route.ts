import { createStripePortalSession } from "@/lib/stripe-billing-handlers";

export async function POST(request: Request) {
  return createStripePortalSession(request);
}
