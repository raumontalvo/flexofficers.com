import Link from "next/link";
import type { Prisma } from "@/app/generated/prisma/client";
import { companyDashboardSelect } from "@/lib/officer-fields";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
  PageShell,
  SectionHeading,
  StatCard,
  StatusBadge,
} from "@/components/ui";
import {
  formatCompanySubscriptionStatus,
  isCompanySubscriptionActive,
} from "@/lib/company-subscription";
import { prisma } from "@/lib/prisma";
import DashboardSignOutButton from "./SignOutButton";

type CompanyDashboardProps = {
  firstName?: string | null;
  company: Prisma.CompanyGetPayload<{ select: typeof companyDashboardSelect }>;
  missingItems: string[];
};

function QuickActionCard({
  href,
  title,
  description,
  highlight = false,
}: {
  href: string;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card
        variant={highlight ? "elevated" : "default"}
        className="h-full transition hover:border-fo-border-strong hover:bg-fo-surface-hover"
      >
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </Card>
    </Link>
  );
}

export default async function CompanyDashboard({
  firstName,
  company,
  missingItems,
}: CompanyDashboardProps) {
  const subscriptionActive = isCompanySubscriptionActive(company);
  const subscriptionLabel = formatCompanySubscriptionStatus(
    company.subscriptionStatus
  );
  const periodEnd = company.subscriptionCurrentPeriodEnd
    ? company.subscriptionCurrentPeriodEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const [openShiftsCount, pendingApplicantsCount, acceptedApplicantsCount, filledShiftsCount] =
    await Promise.all([
      prisma.shift.count({
        where: {
          companyId: company.id,
          status: ShiftStatus.OPEN,
        },
      }),
      prisma.application.count({
        where: {
          status: ApplicationStatus.PENDING,
          shift: {
            companyId: company.id,
          },
        },
      }),
      prisma.application.count({
        where: {
          status: ApplicationStatus.ACCEPTED,
          shift: {
            companyId: company.id,
          },
        },
      }),
      prisma.shift.count({
        where: {
          companyId: company.id,
          status: ShiftStatus.FILLED,
        },
      }),
    ]);

  return (
    <PageShell nav="company" maxWidth="2xl">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          title={`Welcome${firstName ? `, ${firstName}` : ""}`}
          subtitle="Your company control center for shifts, applicants, and hiring."
          className="flex-1"
        />
        <DashboardSignOutButton />
      </div>

      <div className="mt-8 space-y-4">
        {missingItems.length > 0 ? (
          <Card className="border-yellow-500/20 bg-fo-pending-bg">
            <CardTitle className="text-lg text-fo-pending">
              Complete your company profile
            </CardTitle>
            <CardDescription className="mt-2 text-fo-text">
              Finish these items so your account is ready:
            </CardDescription>
            <ul className="mt-4 space-y-2 text-sm text-fo-text">
              {missingItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fo-pending" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/company/profile"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "mt-5 border-yellow-500/30 text-fo-pending hover:bg-yellow-500/10",
              })}
            >
              Complete Profile
            </Link>
          </Card>
        ) : null}

        <Card variant="elevated" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Subscription</CardTitle>
              <CardDescription className="mt-1">
                {subscriptionActive
                  ? "Your subscription is active. You can post new shifts."
                  : "Activate a subscription to post new shifts."}
              </CardDescription>
            </div>
            <StatusBadge variant={subscriptionActive ? "success" : "info"}>
              {subscriptionLabel}
            </StatusBadge>
          </div>

          {periodEnd ? (
            <p className="text-sm text-fo-text-muted">
              Current period ends {periodEnd}
            </p>
          ) : null}

          {!subscriptionActive ? (
            <p className="text-sm leading-relaxed text-fo-text-muted">
              Existing shifts, applicants, and officer search stay available
              without a subscription.
            </p>
          ) : null}
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Open Shifts"
            value={openShiftsCount}
            hint="Currently accepting applicants"
          />
          <StatCard
            label="Pending Applicants"
            value={pendingApplicantsCount}
            hint="Waiting for your review"
          />
          <StatCard
            label="Accepted / Filled"
            value={acceptedApplicantsCount}
            hint={
              filledShiftsCount > 0
                ? `${filledShiftsCount} shift${filledShiftsCount === 1 ? "" : "s"} filled`
                : "Accepted applicants across your shifts"
            }
          />
        </div>

        {subscriptionActive ? (
          <Link
            href="/shifts/create"
            className={buttonClassName({ fullWidth: true, className: "w-full" })}
          >
            Post a Shift
          </Link>
        ) : (
          <Link
            href="/company/billing"
            className={buttonClassName({ fullWidth: true, className: "w-full" })}
          >
            Subscribe to Post Shifts
          </Link>
        )}

        <div>
          <h2 className="text-lg font-semibold text-fo-text">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <QuickActionCard
              href="/company/shifts"
              title="Manage Shifts"
              description="View, edit, cancel, and delete shifts your company posted."
            />
            <QuickActionCard
              href="/company/applications"
              title="Applicants"
              description="Review pending applications and accept officers."
            />
            <QuickActionCard
              href="/company/officers"
              title="Search Officers"
              description="Filter officer profiles by city, experience, and availability."
            />
            <QuickActionCard
              href="/company/billing"
              title="Billing"
              description="View subscription status and billing details."
              highlight={!subscriptionActive}
            />
            <QuickActionCard
              href="/company/profile"
              title="Company Profile"
              description="Update company contact info and profile details."
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
