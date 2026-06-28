import { isStripeMissingCustomerError } from "@/lib/stripe-customer-errors";
import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export { isStripeMissingCustomerError } from "@/lib/stripe-customer-errors";

type CompanyStripeCustomerInput = {
  companyId: string;
  companyName: string;
  stripeCustomerId: string | null;
  email: string;
};

export async function clearCompanyStripeBillingLinks(companyId: string) {
  await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
  });
}

export async function retrieveValidStripeCustomer(customerId: string) {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);

    if ("deleted" in customer && customer.deleted) {
      return null;
    }

    return customer;
  } catch (error) {
    if (isStripeMissingCustomerError(error)) {
      return null;
    }

    throw error;
  }
}

export async function resolveCompanyStripeCustomer(input: {
  companyId: string;
  stripeCustomerId: string | null;
}) {
  if (!input.stripeCustomerId) {
    return {
      customerId: null,
      isValid: false,
    };
  }

  const customer = await retrieveValidStripeCustomer(input.stripeCustomerId);

  if (!customer) {
    await clearCompanyStripeBillingLinks(input.companyId);

    return {
      customerId: null,
      isValid: false,
    };
  }

  return {
    customerId: customer.id,
    isValid: true,
  };
}

async function createStripeCustomer({
  companyId,
  companyName,
  email,
}: Pick<CompanyStripeCustomerInput, "companyId" | "companyName" | "email">) {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
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

export async function ensureStripeCustomerForCheckout(
  input: CompanyStripeCustomerInput
) {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  if (input.stripeCustomerId) {
    const existingCustomer = await retrieveValidStripeCustomer(
      input.stripeCustomerId
    );

    if (existingCustomer) {
      return existingCustomer.id;
    }

    await clearCompanyStripeBillingLinks(input.companyId);
  }

  return createStripeCustomer(input);
}

export async function requireValidStripeCustomer(
  input: Pick<CompanyStripeCustomerInput, "companyId" | "stripeCustomerId">
) {
  const resolved = await resolveCompanyStripeCustomer(input);

  if (!resolved.isValid || !resolved.customerId) {
    return null;
  }

  return resolved.customerId;
}
