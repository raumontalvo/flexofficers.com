export const COMPANY_ANNUAL_PLAN = {
  name: "FlexOfficers Annual",
  priceCents: 59900,
  priceDisplay: "$599",
  priceAnnualDisplay: "$599.00",
  billingCycle: "Yearly",
  invoiceDescription: "FlexOfficers Annual Subscription",
} as const;

export const COMPANY_ANNUAL_PLAN_FEATURES = [
  "Unlimited Shift Posts",
  "Search Officers",
  "View Officer Profiles",
  "Company Invites",
  "Applicant Management",
  "Priority Support",
] as const;

export const COMPANY_TRIAL_COPY = {
  durationLabel: "7-Day Free Trial",
  profileStartNote:
    "Your free trial starts automatically when you complete your company profile (company name, email, phone, address, city, state, etc.).",
  activeNote:
    "You won't be charged when your trial ends. Subscribe anytime to unlock features.",
  expiredNote:
    "Your free trial has ended. Subscribe to unlock posting, officer search, and applicant management.",
} as const;

export const BILLING_SUPPORT_PHONE = "(239) 900-5653";
export const BILLING_SUPPORT_PHONE_HREF = "tel:+12399005653";
export const BILLING_SUPPORT_HOURS = "Mon – Fri\n8:00 AM – 6:00 PM EST";
