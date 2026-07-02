"use client";

import Link from "next/link";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName } from "@/components/ui";
import { interpolate } from "@/lib/app-i18n";
import type { ClientBillingHistoryItem } from "@/lib/client-billing-page-data";

type ClientBillingPageContentProps = {
  items: ClientBillingHistoryItem[];
  totalSpentLabel: string;
};

export function ClientBillingPageContent({
  items,
  totalSpentLabel,
}: ClientBillingPageContentProps) {
  const { t } = useLandingLanguage();
  const labels = t.client.billing;
  const view = t.client.clientProfile.view;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-fo-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-fo-text-muted">{labels.subtitle}</p>
      </div>

      <section className="fo-glass-card rounded-2xl border border-white/10 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fo-text-subtle">
          {view.totalSpent}
        </p>
        <p className="mt-1 text-3xl font-bold text-fo-text">{totalSpentLabel}</p>
      </section>

      <section className="fo-glass-card rounded-xl border border-white/10 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-fo-text">{labels.paymentMethodsTitle}</h2>
        <p className="mt-2 text-sm text-fo-text-muted">{labels.paymentMethodsHelper}</p>
        <p className="mt-3 text-sm text-fo-text">{view.noPaymentMethod}</p>
      </section>

      <section id="history" className="fo-glass-card rounded-xl border border-white/10 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-fo-text">{labels.historyTitle}</h2>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-fo-text-muted">{labels.emptyHistory}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-fo-text">{item.serviceNeeded}</p>
                  <p className="mt-0.5 text-xs text-fo-text-muted">{labels.leadPostingFee}</p>
                  <p className="mt-1 text-xs text-fo-text-subtle">
                    {interpolate(labels.paidOn, { date: item.paidAtLabel })}
                  </p>
                </div>
                <p className="text-sm font-bold text-fo-text">{item.amountLabel}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/client/profile" className={buttonClassName({ variant: "secondary", size: "md" })}>
        {t.client.clientProfile.edit.backToProfile}
      </Link>
    </div>
  );
}
