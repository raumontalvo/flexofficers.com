import Link from "next/link";
import { BillingIcon } from "@/components/nav/icons";
import { Card } from "@/components/ui";

export function CompanyMobileSettingsLinks() {
  return (
    <div className="mb-8 md:hidden">
      <Card
        variant="elevated"
        padding="none"
        className="fo-glass-card divide-y divide-white/[0.06]"
      >
        <Link
          href="/company/billing"
          className="flex items-center gap-3 px-4 py-4 transition hover:bg-white/[0.03]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
            <BillingIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fo-text">Billing & Plan</p>
            <p className="text-xs text-fo-text-muted">
              Manage subscription and payment method.
            </p>
          </div>
          <span className="shrink-0 text-fo-text-subtle" aria-hidden="true">
            →
          </span>
        </Link>
      </Card>
    </div>
  );
}
