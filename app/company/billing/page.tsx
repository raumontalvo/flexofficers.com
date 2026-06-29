import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyBillingPageContent } from "@/components/company/company-billing-page-content";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import { serializeCompanyBillingPageData } from "@/lib/company-billing-page-data";
import { resolveCompanyStripeCustomer } from "@/lib/company-billing-customer";
import { fetchCompanyStripeBillingDetails } from "@/lib/company-billing-stripe";
import { companyDashboardSelect } from "@/lib/officer-fields";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { getStripeBillingReadiness } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function CompanyBillingPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        company: {
          select: companyDashboardSelect,
        },
      },
    });

    const company = user?.company;

    if (!company) {
      return (
        <PageShell nav="company" maxWidth="full" sidebar>
          <SectionHeading
            title="Billing & Subscription"
            subtitle="Manage your FlexOfficers subscription and payment method."
          />

          <Card
            variant="muted"
            className="fo-glass-card mt-8 border border-white/10 text-center"
          >
            <CardTitle className="text-lg">Complete your company profile</CardTitle>
            <CardDescription className="mt-2">
              Add your company details before managing billing.
            </CardDescription>
            <Link
              href="/company/profile"
              className={buttonClassName({ className: "mt-6" })}
            >
              Complete Company Profile
            </Link>
          </Card>
        </PageShell>
      );
    }

    const { configured: stripeConnected, billingReady: stripeBillingReady } =
      getStripeBillingReadiness({
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        priceId: process.env.STRIPE_PRICE_ID,
      });

    const stripeCustomer = await resolveCompanyStripeCustomer({
      companyId: company.id,
      stripeCustomerId: company.stripeCustomerId,
    });

    const stripeDetails =
      stripeCustomer.isValid && stripeCustomer.customerId
        ? await fetchCompanyStripeBillingDetails(stripeCustomer.customerId)
        : null;

    const billing = serializeCompanyBillingPageData({
      company,
      stripeConnected,
      stripeBillingReady,
      hasValidStripeCustomer: stripeCustomer.isValid,
      paymentMethod: stripeDetails?.paymentMethod ?? null,
      invoices: stripeDetails?.invoices ?? [],
    });

    return (
      <PageShell nav="company" maxWidth="full" sidebar>
        <SectionHeading
          title="Billing & Subscription"
          subtitle="Manage your FlexOfficers subscription and payment method."
        />

        <div className="mt-4 md:mt-8">
          <CompanyBillingPageContent billing={billing} />
        </div>
      </PageShell>
    );
  } catch (error) {
    console.error("Failed to load company billing page:", error);

    return (
      <PageShell nav="company" maxWidth="full" sidebar>
        <SectionHeading
          title="Billing & Subscription"
          subtitle="Manage your FlexOfficers subscription and payment method."
        />

        <Card
          variant="muted"
          className="fo-glass-card mt-8 border border-white/10"
        >
          <CardTitle className="text-lg">Unable to load billing</CardTitle>
          <CardDescription className="mt-2">
            Billing is temporarily unavailable. Your subscription details could
            not be loaded right now. Please try again in a moment.
          </CardDescription>
        </Card>
      </PageShell>
    );
  }
}
