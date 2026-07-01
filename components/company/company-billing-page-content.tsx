"use client";

import Link from "next/link";
import {
  BILLING_SUPPORT_PHONE,
  BILLING_SUPPORT_PHONE_HREF,
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
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { interpolate } from "@/lib/app-i18n";
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
  const { t } = useLandingLanguage();

  return (
    <p className="text-sm text-fo-text-muted">{t.billing.stripe.notConfigured}</p>
  );
}

function StripeConnectPrompt() {
  const { t } = useLandingLanguage();

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
      <p className="text-sm text-fo-text">{t.billing.stripe.noAccount}</p>
      <div className="mt-4">
        <StripeBillingAction
          action="checkout"
          label={t.billing.actions.startSubscriptionNow}
          fullWidth
        />
      </div>
    </div>
  );
}

function BillingHistoryScrollRow() {
  const { t } = useLandingLanguage();

  return (
    <MobileSettingsRow
      label={t.billing.sections.billingHistory}
      href="#billing-history"
    />
  );
}

function MobilePrimarySubscriptionCta({
  billing,
}: {
  billing: CompanyBillingPageData;
}) {
  const { t } = useLandingLanguage();
  const b = t.billing;
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
          label={b.actions.startSubscription}
          fullWidth
          className="[&_button]:min-h-[52px] [&_button]:text-base"
        />
      ) : (
        <>
          <StripeBillingAction
            action="checkout"
            label={b.actions.startSubscription}
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
  const { t } = useLandingLanguage();
  const b = t.billing;
  const canManageStripeBilling =
    billing.stripeBillingReady && billing.hasValidStripeCustomer;

  return (
    <MobileStack>
      <MobileSectionCard title={b.sections.currentPlan}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-fo-text">{billing.planName}</p>
            <p className="mt-1 text-2xl font-bold text-fo-primary-bright">
              {billing.planPriceDisplay}
              <span className="ml-1 text-sm font-semibold text-fo-text-muted">
                {b.labels.perYear}
              </span>
            </p>
          </div>
          <StatusBadge variant={billingStatusVariant(billing.status)}>
            {billing.statusLabel}
          </StatusBadge>
        </div>

        <FeatureList features={billing.features} compact title={b.labels.included} />

        {billing.trialPending ? (
          <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-sm font-semibold text-amber-100">
              {b.trial.durationLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-fo-text-muted">
              {b.trial.profileStartNote} {b.trial.activeNote}
            </p>
          </div>
        ) : null}

        {billing.isOnTrial ? (
          <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
            <p className="text-sm font-semibold text-fo-primary-hover">
              {b.trial.durationLabel}
            </p>
            {billing.trialDaysRemaining !== null ? (
              <p className="mt-1.5 text-sm font-medium text-fo-text">
                {billing.trialDaysRemaining === 1
                  ? interpolate(b.labels.dayRemaining, { count: billing.trialDaysRemaining })
                  : interpolate(b.labels.daysRemainingPlural, {
                      count: billing.trialDaysRemaining,
                    })}
              </p>
            ) : null}
            {billing.trialEndsAt ? (
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-fo-text-muted">{b.labels.trialEnds}</span>
                <span className="font-medium text-fo-text">{billing.trialEndsAt}</span>
              </div>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-fo-text-muted">
              {b.trial.activeNote}
            </p>
          </div>
        ) : null}

        <MobilePrimarySubscriptionCta billing={billing} />
      </MobileSectionCard>

      <MobileSectionCard title={b.sections.subscriptionManagement}>
        <MobileSettingsRowGroup>
          <StripeBillingSettingRow
            action="portal"
            label={b.actions.manageSubscription}
            disabled={!canManageStripeBilling}
          />
          <StripeBillingSettingRow
            action="payment-method"
            label={b.actions.updatePaymentMethod}
            disabled={!canManageStripeBilling}
          />
          <BillingHistoryScrollRow />
        </MobileSettingsRowGroup>
      </MobileSectionCard>

      <MobileSectionCard title={b.sections.billingSummary}>
        <dl>
          <MobileDetailRow label={b.labels.plan} value={billing.planName} />
          <MobileDetailRow label={b.labels.billingCycle} value={billing.billingCycle} />
          <MobileDetailRow label={b.labels.status} value={billing.statusLabel} />
          <MobileDetailRow
            label={b.labels.nextRenewal}
            value={billing.nextRenewal ?? b.labels.notScheduled}
          />
          <MobileDetailRow label={b.labels.nextCharge} value={billing.nextCharge} />
        </dl>
      </MobileSectionCard>

      <MobileSectionCard title={b.sections.paymentMethod}>
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
                  {b.labels.expires} {billing.paymentMethod.expiration}
                </p>
              </div>
              <StatusBadge variant="success">{b.labels.default}</StatusBadge>
            </div>
          </div>
        ) : (
          <p className="text-sm text-fo-text-muted">
            {billing.hasValidStripeCustomer
              ? b.emptyStates.noPaymentMethod
              : billing.stripeConnected
                ? b.emptyStates.subscribeToAddPayment
                : b.emptyStates.stripePaymentPending}
          </p>
        )}
      </MobileSectionCard>

      <MobileSectionCard
        title={b.sections.billingHistory}
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
                      {b.actions.download}
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
              ? b.emptyStates.noBillingHistory
              : b.emptyStates.stripeHistoryPending}
          </p>
        )}
      </MobileSectionCard>

      <MobileSectionCard title={b.sections.billingSupport}>
        <a
          href={BILLING_SUPPORT_PHONE_HREF}
          className="inline-flex items-center gap-2 text-sm font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
        >
          <span aria-hidden="true">📞</span>
          {BILLING_SUPPORT_PHONE}
        </a>
        <div className="mt-2 text-xs leading-relaxed text-fo-text-muted">
          <p className="font-medium text-fo-text-muted">{b.labels.businessHours}</p>
          <p className="whitespace-pre-line">{b.support.hours}</p>
        </div>
      </MobileSectionCard>

      {billing.status === "expired" ? (
        <section className="fo-glass-card rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-sm font-semibold text-fo-rejected">
            {b.emptyStates.trialExpired}
          </p>
          <p className="mt-1.5 text-xs text-fo-text-muted">
            {b.trial.expiredNote}
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
            {b.actions.manageShifts}
          </Link>
        </section>
      ) : null}
    </MobileStack>
  );
}

export function CompanyBillingPageContent({
  billing,
}: CompanyBillingPageContentProps) {
  const { t } = useLandingLanguage();
  const b = t.billing;
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
            <BillingSectionCard title={b.sections.currentPlan}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-fo-text">{billing.planName}</p>
                  <p className="mt-2 text-3xl font-bold text-fo-primary-bright">
                    {billing.planPriceDisplay}
                    <span className="ml-1 text-lg font-semibold text-fo-text-muted">
                      {b.plan.yearly}
                    </span>
                  </p>
                </div>
                <StatusBadge variant={billingStatusVariant(billing.status)}>
                  {billing.statusLabel}
                </StatusBadge>
              </div>

              <dl className="mt-5 space-y-0">
                <BillingDetailRow
                  label={b.labels.billingCycle}
                  value={billing.billingCycle}
                />
                <BillingDetailRow
                  label={b.labels.autoRenewal}
                  value={billing.autoRenewalEnabled ? b.labels.enabled : b.labels.notEnabled}
                />
                {showRenewal ? (
                  <BillingDetailRow
                    label={b.labels.nextRenewal}
                    value={billing.nextRenewal}
                  />
                ) : null}
                <BillingDetailRow label={b.labels.amount} value={billing.planAnnualAmount} />
              </dl>

              <FeatureList features={billing.features} />

              {billing.trialPending ? (
                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-sm font-semibold text-amber-100">
                    {b.trial.durationLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fo-text-muted">
                    {b.trial.profileStartNote} {b.trial.activeNote}
                  </p>
                </div>
              ) : null}

              {billing.isOnTrial ? (
                <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-sm font-semibold text-fo-primary-hover">
                    {b.trial.durationLabel}
                  </p>
                  {billing.trialDaysRemaining !== null ? (
                    <p className="mt-2 text-sm text-fo-text">
                      {billing.trialDaysRemaining === 1
                        ? interpolate(b.labels.dayRemaining, {
                            count: billing.trialDaysRemaining,
                          })
                        : interpolate(b.labels.daysRemainingPlural, {
                            count: billing.trialDaysRemaining,
                          })}
                    </p>
                  ) : null}
                  {billing.trialEndsAt ? (
                    <p className="mt-1 text-sm text-fo-text-muted">
                      {b.trial.trialEndsPrefix} {billing.trialEndsAt}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-fo-text-muted">
                    {b.trial.activeNote}
                  </p>
                  <div className="mt-4">
                    {billing.stripeBillingReady ? (
                      <StripeBillingAction
                        action="checkout"
                        label={b.actions.startSubscriptionNow}
                        fullWidth
                      />
                    ) : (
                      <>
                        <StripeBillingAction
                          action="checkout"
                          label={b.actions.startSubscriptionNow}
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
                      label={b.actions.manageSubscription}
                      fullWidth
                    />
                    <StripeBillingAction
                      action="payment-method"
                      label={b.actions.updatePaymentMethod}
                      variant="secondary"
                      fullWidth
                    />
                  </>
                ) : (
                  <>
                    <StripeBillingAction
                      action="portal"
                      label={b.actions.manageSubscription}
                      fullWidth
                      disabled
                    />
                    <StripeBillingAction
                      action="payment-method"
                      label={b.actions.updatePaymentMethod}
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

            <BillingSectionCard title={b.sections.billingHistory}>
              {billing.invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-fo-text-muted">
                        <th className="px-2 py-3 font-semibold">{b.table.date}</th>
                        <th className="px-2 py-3 font-semibold">{b.table.description}</th>
                        <th className="px-2 py-3 font-semibold">{b.table.status}</th>
                        <th className="px-2 py-3 font-semibold">{b.table.amount}</th>
                        <th className="px-2 py-3 font-semibold">{b.table.invoice}</th>
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
                                {b.actions.download}
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
                    ? b.emptyStates.noBillingHistory
                    : b.emptyStates.stripeHistoryPending}
                </p>
              )}
            </BillingSectionCard>
          </div>

          <div className="space-y-6">
            <BillingSectionCard title={b.sections.billingSummary}>
              <dl>
                <BillingDetailRow label={b.labels.plan} value={billing.planName} />
                <BillingDetailRow
                  label={b.labels.billingCycle}
                  value={billing.billingCycle}
                />
                <BillingDetailRow label={b.labels.status} value={billing.statusLabel} />
                <BillingDetailRow
                  label={b.labels.nextRenewal}
                  value={billing.nextRenewal ?? b.labels.notScheduled}
                />
                <BillingDetailRow
                  label={b.labels.nextCharge}
                  value={billing.nextCharge}
                />
              </dl>
            </BillingSectionCard>

            <BillingSectionCard title={b.sections.paymentMethod}>
              {billing.paymentMethod ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-fo-text">
                          {billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}
                        </p>
                        <p className="mt-1 text-sm text-fo-text-muted">
                          {b.labels.expires} {billing.paymentMethod.expiration}
                        </p>
                      </div>
                      <StatusBadge variant="success">{b.labels.default}</StatusBadge>
                    </div>
                  </div>
                  {canManageStripeBilling ? (
                    <StripeBillingLink label={b.actions.updatePaymentMethod} />
                  ) : (
                    <StripeBillingLink label={b.actions.updatePaymentMethod} disabled />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-fo-text-muted">
                    {billing.hasValidStripeCustomer
                      ? b.emptyStates.noPaymentMethod
                      : billing.stripeConnected
                        ? b.emptyStates.subscribeToAddPayment
                        : b.emptyStates.stripePaymentPending}
                  </p>
                  {canManageStripeBilling ? (
                    <StripeBillingLink label={b.actions.updatePaymentMethod} />
                  ) : (
                    <StripeBillingLink label={b.actions.updatePaymentMethod} disabled />
                  )}
                </div>
              )}
            </BillingSectionCard>

            <BillingSectionCard title={b.sections.billingSupport}>
              <p className="text-sm text-fo-text-muted">
                {b.labels.subscriptionQuestions}
              </p>
              <a
                href={BILLING_SUPPORT_PHONE_HREF}
                className="mt-3 inline-flex text-lg font-semibold text-fo-primary-bright hover:text-fo-primary-hover"
              >
                {BILLING_SUPPORT_PHONE}
              </a>
              <p className="mt-4 whitespace-pre-line text-sm text-fo-text-muted">
                {b.labels.businessHours}
                {"\n"}
                {b.support.hours}
              </p>
            </BillingSectionCard>
          </div>
        </div>

        {billing.status === "expired" ? (
          <section className="fo-glass-card rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-fo-rejected">
              {b.emptyStates.trialExpired}
            </p>
            <p className="mt-2 text-sm text-fo-text-muted">
              {b.trial.expiredNote}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {billing.stripeBillingReady ? (
                <StripeBillingAction
                  action="checkout"
                  label={b.actions.startSubscriptionNow}
                />
              ) : (
                <StripeBillingAction
                  action="checkout"
                  label={b.actions.startSubscriptionNow}
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
                {b.actions.manageShifts}
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
