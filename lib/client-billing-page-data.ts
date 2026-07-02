import { SECURITY_LEAD_PRICE_CENTS } from "@/lib/security-lead-pricing";

export type ClientBillingHistoryItem = {
  id: string;
  serviceNeeded: string;
  paidAtLabel: string;
  amountLabel: string;
};

function formatCurrency(cents: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function buildClientBillingHistoryItems(
  leads: Array<{ id: string; serviceNeeded: string; createdAt: Date }>,
  locale = "en-US"
): ClientBillingHistoryItem[] {
  const amountLabel = formatCurrency(SECURITY_LEAD_PRICE_CENTS, locale);

  return leads.map((lead) => ({
    id: lead.id,
    serviceNeeded: lead.serviceNeeded,
    paidAtLabel: new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(lead.createdAt),
    amountLabel,
  }));
}

export function formatClientTotalSpent(paidLeadCount: number, locale = "en-US") {
  return formatCurrency(paidLeadCount * SECURITY_LEAD_PRICE_CENTS, locale);
}
