import type Stripe from "stripe";
import { COMPANY_ANNUAL_PLAN } from "@/lib/company-billing-plan";
import { getStripeClient } from "@/lib/stripe";

export type SerializedStripePaymentMethod = {
  brand: string;
  last4: string;
  expiration: string;
  isDefault: true;
};

export type SerializedStripeInvoice = {
  id: string;
  date: string;
  description: string;
  status: string;
  amount: string;
  downloadUrl: string | null;
};

function formatCardBrand(brand: string) {
  if (!brand.trim()) {
    return "Card";
  }

  return brand
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCardExpiration(expMonth: number, expYear: number) {
  const month = String(expMonth).padStart(2, "0");
  const year = String(expYear).slice(-2);
  return `${month}/${year}`;
}

function formatInvoiceDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatInvoiceAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatInvoiceStatus(status: Stripe.Invoice.Status | null) {
  if (!status) {
    return "Unknown";
  }

  switch (status) {
    case "paid":
      return "Paid";
    case "open":
      return "Open";
    case "void":
      return "Void";
    case "uncollectible":
      return "Uncollectible";
    case "draft":
      return "Draft";
    default:
      return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  }
}

function serializePaymentMethod(
  paymentMethod: Stripe.PaymentMethod
): SerializedStripePaymentMethod | null {
  if (paymentMethod.type !== "card" || !paymentMethod.card) {
    return null;
  }

  return {
    brand: formatCardBrand(paymentMethod.card.brand),
    last4: paymentMethod.card.last4,
    expiration: formatCardExpiration(
      paymentMethod.card.exp_month,
      paymentMethod.card.exp_year
    ),
    isDefault: true,
  };
}

export async function fetchCompanyStripeBillingDetails(stripeCustomerId: string) {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  const customer = await stripe.customers.retrieve(stripeCustomerId, {
    expand: ["invoice_settings.default_payment_method"],
  });

  if (customer.deleted) {
    return {
      paymentMethod: null,
      invoices: [] as SerializedStripeInvoice[],
    };
  }

  const defaultPaymentMethod =
    customer.invoice_settings?.default_payment_method;

  const paymentMethod =
    defaultPaymentMethod && typeof defaultPaymentMethod !== "string"
      ? serializePaymentMethod(defaultPaymentMethod)
      : null;

  const invoiceList = await stripe.invoices.list({
    customer: stripeCustomerId,
    limit: 12,
  });

  const invoices = invoiceList.data.map((invoice) => ({
    id: invoice.id,
    date: formatInvoiceDate(invoice.created),
    description: COMPANY_ANNUAL_PLAN.invoiceDescription,
    status: formatInvoiceStatus(invoice.status),
    amount: formatInvoiceAmount(
      invoice.amount_paid || invoice.amount_due,
      invoice.currency
    ),
    downloadUrl: invoice.invoice_pdf ?? null,
  }));

  return {
    paymentMethod,
    invoices,
  };
}
