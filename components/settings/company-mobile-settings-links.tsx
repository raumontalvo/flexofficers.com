"use client";

import Link from "next/link";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { BillingIcon } from "@/components/nav/icons";
import { MobileActionCard } from "@/components/ui/mobile";

export function CompanyMobileSettingsLinks() {
  const { t } = useLandingLanguage();
  const billing = t.settings.billingLink;

  return (
    <div className="mb-8 md:hidden">
      <MobileActionCard
        href="/company/billing"
        title={billing.title}
        description={billing.description}
        icon={<BillingIcon className="h-4 w-4" />}
        iconClassName="bg-violet-500/20 text-violet-300"
      />
    </div>
  );
}
