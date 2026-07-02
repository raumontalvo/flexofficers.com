export const SECURITY_LEAD_PRICE_CENTS = 500;
export const SECURITY_LEAD_PRODUCT_NAME = "FlexOfficers Security Lead";

export function formatSecurityLeadPrice(locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(SECURITY_LEAD_PRICE_CENTS / 100);
}
