import Link from "next/link";
import {
  BILLING_SUPPORT_HOURS,
  BILLING_SUPPORT_PHONE,
  BILLING_SUPPORT_PHONE_HREF,
} from "@/lib/company-billing-plan";
import type { CompanyBillingPageData } from "@/lib/company-billing-page-data";
import { buttonClassName, StatusBadge } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  StripeBillingAction,
  StripeBillingLink,
} from "@/components/company/stripe-billing-actions";

type CompanyBillingPageContentProps = {
  billing: CompanyBillingPageData;
};

function BillingSectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "fo-glass-card h-auto self-start rounded-xl border border-white/10 p-4 sm:p-5",
        className
      )}
    >
      <h2 className="text-base font-semibold text-fo-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BillingDetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] py-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-fo-text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-fo-text">{value}</dd>
    </div>
  );
}

function billingStatusVariant(
  status: CompanyBillingPageData["status"]
): "success" | "pending" | "rejected" {
  switch (status) {
    case "active":
      return "success";
    case "trial":
      return "pending";
    case "expired":
    default:
      return "rejected";
  }
}

function FeatureList({ features }: { features: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm text-fo-text">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-fo-primary-hover">
            ✓
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function StripeUnavailableNote() {
  return (
    <p className="text-sm text-fo-text-muted">
      Stripe billing is not configured yet. Subscription management will be
      available once Stripe is connected.
    </p>
  );
}

export function CompanyBillingPageContent({
  billing,
}: CompanyBillingPageContentProps) {
  const showRenewal = Boolean(billing.nextRenewal);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <BillingSectionCard title="Current Plan">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-bold text-fo-text">{billing.planName}</p>
                <p className="mt-2 text-3xl font-bold text-fo-primary-bright">
                  {billing.planPriceDisplay}
                  <span className="ml-1 text-lg font-semibold text-fo-text-muted">
                    / year
                  </span>
                </p>
              </div>
              <StatusBadge variant={billingStatusVariant(billing.status)}>
                {billing.statusLabel}
              </StatusBadge>
            </div>

            <dl className="mt-5 space-y-0">
              <BillingDetailRow
                label="Billing Cycle"
                value={billing.billingCycle}
              />
              <BillingDetailRow
                label="Auto Renewal"
                value={billing.autoRenewalEnabled ? "Enabled" : "Not enabled"}
              />
              {showRenewal ? (
                <BillingDetailRow
                  label="Next Renewal"
                  value={billing.nextRenewal}
                />
              ) : null}
              <BillingDetailRow label="Amount" value={billing.planAnnualAmount} />
            </dl>

            <FeatureList features={billing.features} />

            {billing.isOnTrial ? (
              <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-sm font-semibold text-fo-primary-hover">
                  7-Day Free Trial
                </p>
                {billing.trialDaysRemaining !== null ? (
                  <p className="mt-2 text-sm text-fo-text">
                    {billing.trialDaysRemaining}{" "}
                    {billing.trialDaysRemaining === 1 ? "day" : "days"} remaining
                  </p>
                ) : null}
                {billing.trialEndsAt ? (
                  <p className="mt-1 text-sm text-fo-text-muted">
                    Trial ends: {billing.trialEndsAt}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-fo-text-muted">
                  After your trial ends, your annual subscription will begin
                  automatically.
                </p>
                <div className="mt-4">
                  {billing.stripeBillingReady ? (
                    <StripeBillingAction
                      action="checkout"
                      label="Start Subscription Now"
                      fullWidth
                    />
                  ) : (
                    <>
                      <StripeBillingAction
                        action="checkout"
                        label="Start Subscription Now"
                        fullWidth
                        disabled
                      />
                      <StripeUnavailableNote />
                    </>
                  )}
                </div>
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {billing.stripeBillingReady ? (
                <>
                  <StripeBillingAction
                    action="portal"
                    label="Manage Subscription"
                    fullWidth
                  />
                  <StripeBillingAction
                    action="payment-method"
                    label="Update Payment Method"
                    variant="secondary"
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <StripeBillingAction
                    action="portal"
                    label="Manage Subscription"
                    fullWidth
                    disabled
                  />
                  <StripeBillingAction
                    action="payment-method"
                    label="Update Payment Method"
                    variant="secondary"
                    fullWidth
                    disabled
                  />
                </>
              )}
            </div>

            {!billing.stripeBillingReady ? (
              <div className="mt-4">
                <StripeUnavailableNote />
              </div>
            ) : null}
          </BillingSectionCard>

          <BillingSectionCard title="Billing History">
            {billing.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-fo-text-muted">
                      <th className="px-2 py-3 font-semibold">Date</th>
                      <th className="px-2 py-3 font-semibold">Description</th>
                      <th className="px-2 py-3 font-semibold">Status</th>
                      <th className="px-2 py-3 font-semibold">Amount</th>
                      <th className="px-2 py-3 font-semibold">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billing.invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-white/[0.06] last:border-b-0"
                      >
                        <td className="px-2 py-3 text-fo-text">{invoice.date}</td>
                        <td className="px-2 py-3 text-fo-text">
                          {invoice.description}
                        </td>
                        <td className="px-2 py-3">
                          <StatusBadge
                            variant={
                              invoice.status === "Paid" ? "success" : "neutral"
                            }
                          >
                            {invoice.status}
                          </StatusBadge>
                        </td>
                        <td className="px-2 py-3 text-fo-text">{invoice.amount}</td>
                        <td className="px-2 py-3">
                          {invoice.downloadUrl ? (
                            <a
                              href={invoice.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-sm text-fo-text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-fo-text-muted">
                {billing.stripeConnected
                  ? "No billing history yet."
                  : "Billing history will appear here once Stripe is connected."}
              </p>
            )}
          </BillingSectionCard>
        </div>

        <div className="space-y-6">
          <BillingSectionCard title="Billing Summary">
            <dl>
              <BillingDetailRow label="Plan" value={billing.planName} />
              <BillingDetailRow
                label="Billing Cycle"
                value={billing.billingCycle}
              />
              <BillingDetailRow label="Status" value={billing.statusLabel} />
              <BillingDetailRow
                label="Next Renewal"
                value={billing.nextRenewal ?? "Not scheduled"}
              />
              <BillingDetailRow
                label="Next Charge"
                value={billing.nextCharge}
              />
            </dl>
          </BillingSectionCard>

          <BillingSectionCard title="Payment Method">
            {billing.paymentMethod ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-fo-text">
                        {billing.paymentMethod.brand} ending in{" "}
                        {billing.paymentMethod.last4}
                      </p>
                      <p className="mt-1 text-sm text-fo-text-muted">
                        Expires {billing.paymentMethod.expiration}
                      </p>
                    </div>
                    <StatusBadge variant="success">Default</StatusBadge>
                  </div>
                </div>
                {billing.stripeBillingReady ? (
                  <StripeBillingLink label="Update Payment Method" />
                ) : (
                  <StripeBillingLink label="Update Payment Method" disabled />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-fo-text-muted">
                  {billing.stripeConnected
                    ? "No payment method on file."
                    : "Payment method details will appear here once Stripe is connected."}
                </p>
                {billing.stripeBillingReady ? (
                  <StripeBillingLink label="Update Payment Method" />
                ) : (
                  <StripeBillingLink label="Update Payment Method" disabled />
                )}
              </div>
            )}
          </BillingSectionCard>

          <BillingSectionCard title="Billing Support">
            <p className="text-sm text-fo-text-muted">
              Questions about your subscription?
            </p>
            <a
              href={BILLING_SUPPORT_PHONE_HREF}
              className="mt-3 inline-flex text-lg font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
            >
              {BILLING_SUPPORT_PHONE}
            </a>
            <p className="mt-4 whitespace-pre-line text-sm text-fo-text-muted">
              Business Hours:
              {"\n"}
              {BILLING_SUPPORT_HOURS}
            </p>
          </BillingSectionCard>
        </div>
      </div>

      {billing.status === "expired" ? (
        <section className="fo-glass-card rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5">
          <p className="text-sm font-semibold text-fo-rejected">
            Your trial has expired.
          </p>
          <p className="mt-2 text-sm text-fo-text-muted">
            Subscribe to continue posting new shifts and managing your hiring
            workflow.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {billing.stripeBillingReady ? (
              <StripeBillingAction
                action="checkout"
                label="Start Subscription Now"
              />
            ) : (
              <StripeBillingAction
                action="checkout"
                label="Start Subscription Now"
                disabled
              />
            )}
            <Link
              href="/company/shifts"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
              })}
            >
              Manage Shifts
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
