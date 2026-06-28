import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

type EnsureStripeCustomerInput = {
  companyId: string;
  companyName: string;
  stripeCustomerId: string | null;
  email: string;
};

export async function ensureStripeCustomer({
  companyId,
  companyName,
  stripeCustomerId,
  email,
}: EnsureStripeCustomerInput) {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  if (stripeCustomerId) {
    return stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name: companyName,
    metadata: {
      companyId,
    },
  });

  await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}
