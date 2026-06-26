import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Button,
  Card,
  CardDescription,
  CardTitle,
  PageShell,
  SectionHeading,
  StatusBadge,
} from "@/components/ui";
import {
  formatCompanySubscriptionStatus,
  isCompanySubscriptionActive,
} from "@/lib/company-subscription";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

const planFeatures = [
  "Unlimited shift postings",
  "Unlimited officer applications",
  "Unlimited hires",
  "Unlimited officer search",
];

function PlanFeatureList() {
  return (
    <ul className="mt-5 space-y-3">
      {planFeatures.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm text-fo-text">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fo-primary/15 text-xs font-bold text-fo-primary-hover">
            ✓
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CompanyBillingPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const company = await prisma.company.findFirst({
    where: {
      user: {
        clerkId: clerkUser.id,
      },
    },
  });

  if (!company) {
    return (
      <PageShell nav="company" maxWidth="lg">
        <SectionHeading
          title="Billing"
          subtitle="Manage your annual FlexOfficers subscription."
        />

        <Card variant="muted" className="mt-8 text-center">
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

  const subscriptionActive = isCompanySubscriptionActive(company);
  const statusLabel = formatCompanySubscriptionStatus(
    company.subscriptionStatus
  );
  const periodEnd = company.subscriptionCurrentPeriodEnd
    ? company.subscriptionCurrentPeriodEnd.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <PageShell nav="company" maxWidth="lg">
      <SectionHeading
        title="Billing"
        subtitle="Manage your annual FlexOfficers subscription."
      />

      <div className="mt-8 space-y-4">
        <Card variant="elevated" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Current subscription</CardTitle>
              <CardDescription className="mt-1">
                Officers use FlexOfficers for free. Companies subscribe
                annually to post new shifts.
              </CardDescription>
            </div>
            <StatusBadge variant={subscriptionActive ? "success" : "info"}>
              {statusLabel}
            </StatusBadge>
          </div>

          {subscriptionActive ? (
            <div className="rounded-2xl border border-green-500/20 bg-fo-success-bg p-4">
              <p className="text-sm font-semibold text-fo-success">
                Unlimited shift posting is unlocked.
              </p>
              {periodEnd ? (
                <p className="mt-2 text-sm text-fo-success/90">
                  Current period ends {periodEnd}.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-yellow-500/20 bg-fo-pending-bg p-4">
              <p className="text-sm leading-relaxed text-fo-pending">
                Your subscription is not active. You can still manage your
                profile, existing shifts, applicants, and officer search.
                Posting new shifts requires an active subscription.
              </p>
            </div>
          )}
        </Card>

        <Card variant="elevated" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
            Annual plan
          </p>
          <CardTitle className="text-2xl">FlexOfficers Company Plan</CardTitle>
          <p className="text-4xl font-bold text-fo-primary-bright">
            $599
            <span className="ml-1 text-lg font-semibold text-fo-text-muted">
              /year
            </span>
          </p>
          <PlanFeatureList />
        </Card>

        {subscriptionActive ? (
          <Card variant="muted" className="space-y-4">
            <CardTitle className="text-lg">Your plan is active</CardTitle>
            <CardDescription>
              You can post new shifts and manage your hiring workflow across
              FlexOfficers.
            </CardDescription>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/shifts/create"
                className={buttonClassName({ fullWidth: true, className: "w-full" })}
              >
                Post a Shift
              </Link>
              <Link
                href="/company/shifts"
                className={buttonClassName({
                  variant: "secondary",
                  fullWidth: true,
                  className: "w-full",
                })}
              >
                Manage Shifts
              </Link>
            </div>
          </Card>
        ) : (
          <Card variant="muted" className="space-y-4">
            <CardTitle className="text-lg">Subscribe</CardTitle>
            <CardDescription>
              Stripe checkout is coming soon. For now, subscriptions are
              activated manually during testing.
            </CardDescription>

            <Button type="button" disabled fullWidth className="w-full">
              Coming Soon
            </Button>

            <Link
              href="/company/shifts"
              className={buttonClassName({
                variant: "secondary",
                fullWidth: true,
                className: "w-full",
              })}
            >
              Manage Shifts
            </Link>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
