import Link from "next/link";
import { BillingIcon } from "@/components/nav/icons";
import { MobileActionCard } from "@/components/ui/mobile";

export function CompanyMobileSettingsLinks() {
  return (
    <div className="mb-8 md:hidden">
      <MobileActionCard
        href="/company/billing"
        title="Billing & Plan"
        description="Manage subscription and payment method."
        icon={<BillingIcon className="h-4 w-4" />}
        iconClassName="bg-violet-500/20 text-violet-300"
      />
    </div>
  );
}
