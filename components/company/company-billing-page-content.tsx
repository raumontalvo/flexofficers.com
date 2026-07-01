import Link from "next/link";
import {
  BILLING_SUPPORT_HOURS,
  BILLING_SUPPORT_PHONE,
  BILLING_SUPPORT_PHONE_HREF,
  COMPANY_TRIAL_COPY,
} from "@/lib/company-billing-plan";
import type { CompanyBillingPageData } from "@/lib/company-billing-page-data";
import { buttonClassName, StatusBadge } from "@/components/ui";
import {
  MobileDetailRow,
  MobileListCard,
  MobileListCardGroup,
  MobileSectionCard,
  MobileSettingsRow,
  MobileSettingsRowGroup,
  MobileStack,
} from "@/components/ui/mobile";
import { cn } from "@/lib/cn";
import {
  StripeBillingAction,
  StripeBillingLink,
  StripeBillingSettingRow,
} from "@/components/company/stripe-billing-actions";

type CompanyBillingPageContentProps = {
  billing: CompanyBillingPageData;
};

function BillingSectionCard({
  title,
  children,
  className,
  compact = false,
  id,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "fo-glass-card h-auto self-start rounded-xl border border-white/10",
        compact ? "p-3" : "p-4 sm:p-5",
        className
      )}
    >
      <h2 className="text-sm font-semibold text-fo-text sm:text-base">{title}</h2>
      <div className={cn(compact ? "mt-2.5" : "mt-4")}>{children}</div>
    </section>
  );
}

function BillingDetailRow({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-white/[0.06] last:border-b-0 last:pb-0",
        compact ? "py-2" : "py-3"
      )}
    >
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

function FeatureList({
  features,
  compact = false,
  title,
}: {
  features: readonly string[];
  compact?: boolean;
  title?: string;
}) {
  return (
    <div className={cn(compact ? "mt-3" : "mt-5")}>
      {title ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fo-text-muted">
          {title}
        </p>
      ) : null}
      <ul className={cn(compact ? "space-y-1.5" : "space-y-3")}>
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-fo-text">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-fo-primary-hover">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
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

function StripeConnectPrompt() {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
      <p className="text-sm text-fo-text">
        No Stripe billing account is connected yet. Start a subscription to set
        up billing in this environment.
      </p>
      <div className="mt-4">
        <StripeBillingAction
          action="checkout"
          label="Start Subscription Now"
          fullWidth
        />
      </div>
    </div>
  );
}

function BillingHistoryScrollRow() {
  return <MobileSettingsRow label="Billing History" href="#billing-history" />;
}

function MobilePrimarySubscriptionCta({
  billing,
}: {
  billing: CompanyBillingPageData;
}) {
  const showPrimary =
    billing.isOnTrial ||
    billing.status === "expired" ||
    (billing.stripeBillingReady && !billing.hasValidStripeCustomer && !billing.isOnTrial);

  if (!showPrimary) {
    return null;
  }

  return (
    <div className="pt-1">
      {billing.stripeBillingReady ? (
        <StripeBillingAction
          action="checkout"
          label="Start Subscription"
          fullWidth
          className="[&_button]:min-h-[52px] [&_button]:text-base"
        />
      ) : (
        <>
          <StripeBillingAction
            action="checkout"
            label="Start Subscription"
            fullWidth
            disabled
            className="[&_button]:min-h-[52px] [&_button]:text-base"
          />
          <div className="mt-2">
            <StripeUnavailableNote />
          </div>
        </>
      )}
    </div>
  );
}

function CompanyBillingMobileContent({
  billing,
}: {
  billing: CompanyBillingPageData;
}) {
  const canManageStripeBilling =
    billing.stripeBillingReady && billing.hasValidStripeCustomer;

  return (
    <MobileStack>
      <MobileSectionCard title="Current Plan">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-fo-text">{billing.planName}</p>
            <p className="mt-1 text-2xl font-bold text-fo-primary-bright">
              {billing.planPriceDisplay}
              <span className="ml-1 text-sm font-semibold text-fo-text-muted">
                / year
              </span>
            </p>
          </div>
          <StatusBadge variant={billingStatusVariant(billing.status)}>
            {billing.statusLabel}
          </StatusBadge>
        </div>

        <FeatureList features={billing.features} compact title="Included" />

        {billing.trialPending ? (
          <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-sm font-semibold text-amber-100">
              {COMPANY_TRIAL_COPY.durationLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-fo-text-muted">
              {COMPANY_TRIAL_COPY.profileStartNote} {COMPANY_TRIAL_COPY.activeNote}
            </p>
          </div>
        ) : null}

        {billing.isOnTrial ? (
          <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
            <p className="text-sm font-semibold text-fo-primary-hover">
              {COMPANY_TRIAL_COPY.durationLabel}
            </p>
            {billing.trialDaysRemaining !== null ? (
              <p className="mt-1.5 text-sm font-medium text-fo-text">
                {billing.trialDaysRemaining}{" "}
                {billing.trialDaysRemaining === 1 ? "Day" : "Days"} Remaining
              </p>
            ) : null}
            {billing.trialEndsAt ? (
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-fo-text-muted">Trial Ends</span>
                <span className="font-medium text-fo-text">{billing.trialEndsAt}</span>
              </div>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-fo-text-muted">
              {COMPANY_TRIAL_COPY.activeNote}
            </p>
          </div>
        ) : null}

        <MobilePrimarySubscriptionCta billing={billing} />
      </MobileSectionCard>

      <MobileSectionCard title="Subscription Management">
        <MobileSettingsRowGroup>
          <StripeBillingSettingRow
            action="portal"
            label="Manage Subscription"
            disabled={!canManageStripeBilling}
          />
          <StripeBillingSettingRow
            action="payment-method"
            label="Update Payment Method"
            disabled={!canManageStripeBilling}
          />
          <BillingHistoryScrollRow />
        </MobileSettingsRowGroup>
      </MobileSectionCard>

      <MobileSectionCard title="Billing Summary">
        <dl>
          <MobileDetailRow label="Plan" value={billing.planName} />
          <MobileDetailRow label="Billing Cycle" value={billing.billingCycle} />
          <MobileDetailRow label="Status" value={billing.statusLabel} />
          <MobileDetailRow
            label="Next Renewal"
            value={billing.nextRenewal ?? "Not scheduled"}
          />
          <MobileDetailRow label="Next Charge" value={billing.nextCharge} />
        </dl>
      </MobileSectionCard>

      <MobileSectionCard title="Payment Method">
        {billing.paymentMethod ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-fo-text">
                  {billing.paymentMethod.brand}
                </p>
                <p className="mt-0.5 text-sm text-fo-text">
                  •••• {billing.paymentMethod.last4}
                </p>
                <p className="mt-1.5 text-xs text-fo-text-muted">
                  Expires {billing.paymentMethod.expiration}
                </p>
              </div>
              <StatusBadge variant="success">Default</StatusBadge>
            </div>
          </div>
        ) : (
          <p className="text-sm text-fo-text-muted">
            {billing.hasValidStripeCustomer
              ? "No payment method on file."
              : billing.stripeConnected
                ? "Start a subscription to add a payment method."
                : "Payment method details will appear here once Stripe is connected."}
          </p>
        )}
      </MobileSectionCard>

      <MobileSectionCard
        title="Billing History"
        className="scroll-mt-24"
        id="billing-history"
      >
        {billing.invoices.length > 0 ? (
          <MobileListCardGroup className="border-0 bg-transparent">
            {billing.invoices.map((invoice) => (
              <MobileListCard key={invoice.id} className="px-0 py-2.5 first:pt-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="min-w-[4.5rem] text-fo-text-muted">{invoice.date}</span>
                  <span className="font-medium text-fo-text">{invoice.amount}</span>
                  <StatusBadge
                    variant={invoice.status === "Paid" ? "success" : "neutral"}
                  >
                    {invoice.status}
                  </StatusBadge>
                  {invoice.downloadUrl ? (
                    <a
                      href={invoice.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-xs font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="ml-auto text-xs text-fo-text-muted">—</span>
                  )}
                </div>
              </MobileListCard>
            ))}
          </MobileListCardGroup>
        ) : (
          <p className="text-sm text-fo-text-muted">
            {billing.stripeConnected
              ? "No billing history yet."
              : "Billing history will appear here once Stripe is connected."}
          </p>
        )}
      </MobileSectionCard>

      <MobileSectionCard title="Billing Support">
        <a
          href={BILLING_SUPPORT_PHONE_HREF}
          className="inline-flex items-center gap-2 text-sm font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
        >
          <span aria-hidden="true">📞</span>
          {BILLING_SUPPORT_PHONE}
        </a>
        <div className="mt-2 text-xs leading-relaxed text-fo-text-muted">
          <p className="font-medium text-fo-text-muted">Business Hours</p>
          <p className="whitespace-pre-line">{BILLING_SUPPORT_HOURS}</p>
        </div>
      </MobileSectionCard>

      {billing.status === "expired" ? (
        <section className="fo-glass-card rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-sm font-semibold text-fo-rejected">
            Your trial has expired.
          </p>
          <p className="mt-1.5 text-xs text-fo-text-muted">
            {COMPANY_TRIAL_COPY.expiredNote}
          </p>
          <Link
            href="/company/shifts"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              fullWidth: true,
              className: "mt-3",
            })}
          >
            Manage Shifts
          </Link>
        </section>
      ) : null}
    </MobileStack>
  );
}

export function CompanyBillingPageContent({
  billing,
}: CompanyBillingPageContentProps) {
  const showRenewal = Boolean(billing.nextRenewal);
  const canManageStripeBilling =
    billing.stripeBillingReady && billing.hasValidStripeCustomer;
  const showStartSubscriptionPrompt =
    billing.stripeBillingReady && !billing.hasValidStripeCustomer && !billing.isOnTrial;

  return (
    <>
      <div className="md:hidden">
        <CompanyBillingMobileContent billing={billing} />
      </div>

      <div className="hidden space-y-6 md:block">
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

              {billing.trialPending ? (
                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-sm font-semibold text-amber-100">
                    {COMPANY_TRIAL_COPY.durationLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fo-text-muted">
                    {COMPANY_TRIAL_COPY.profileStartNote} {COMPANY_TRIAL_COPY.activeNote}
                  </p>
                </div>
              ) : null}

              {billing.isOnTrial ? (
                <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-sm font-semibold text-fo-primary-hover">
                    {COMPANY_TRIAL_COPY.durationLabel}
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
                    {COMPANY_TRIAL_COPY.activeNote}
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

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {canManageStripeBilling ? (
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

              {showStartSubscriptionPrompt ? (
                <div className="mt-4">
                  <StripeConnectPrompt />
                </div>
              ) : null}

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
                  {canManageStripeBilling ? (
                    <StripeBillingLink label="Update Payment Method" />
                  ) : (
                    <StripeBillingLink label="Update Payment Method" disabled />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-fo-text-muted">
                    {billing.hasValidStripeCustomer
                      ? "No payment method on file."
                      : billing.stripeConnected
                        ? "Start a subscription to add a payment method."
                        : "Payment method details will appear here once Stripe is connected."}
                  </p>
                  {canManageStripeBilling ? (
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
              {COMPANY_TRIAL_COPY.expiredNote}
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
    </>
  );
}
