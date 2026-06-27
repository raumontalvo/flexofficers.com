import Link from "next/link";
import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import { isCompanySubscriptionActive } from "@/lib/company-subscription";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { CompanyShiftCard } from "./CompanyShiftCard";

export const dynamic = "force-dynamic";

export default async function CompanyShiftsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const company = await prisma.company.findFirst({
    where: {
      user: {
        clerkId: clerkUser.id,
      },
    },
  });

  const subscriptionActive = company
    ? isCompanySubscriptionActive(company)
    : false;

  const shifts = await prisma.shift.findMany({
    where: {
      company: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    },
    include: {
      applications: {
        where: {
          status: ApplicationStatus.ACCEPTED,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <SectionHeading
        title="Open Shifts"
        subtitle="Track open, filled, and cancelled shifts."
        action={
          subscriptionActive ? (
            <Link
              href="/shifts/create"
              className={buttonClassName({ size: "md" })}
            >
              Post a Shift
            </Link>
          ) : (
            <Link
              href="/company/billing"
              className={buttonClassName({ size: "md" })}
            >
              Subscribe to Post Shifts
            </Link>
          )
        }
      />

      <div className="mt-8 space-y-4">
        {!subscriptionActive ? (
          <Card variant="muted">
            <p className="text-sm leading-relaxed text-fo-text-muted">
              Your subscription is inactive. You can still manage existing
              shifts, but posting new shifts requires an active subscription.
            </p>
            <Link
              href="/company/billing"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "mt-4",
              })}
            >
              View Billing
            </Link>
          </Card>
        ) : null}

        {shifts.length === 0 ? (
          <Card variant="muted" className="text-center">
            <p className="text-lg font-medium text-fo-text">
              You have not posted any shifts yet.
            </p>
            <p className="mt-2 text-sm text-fo-text-muted">
              Post your first shift to start receiving officer applications.
            </p>
            {subscriptionActive ? (
              <Link
                href="/shifts/create"
                className={buttonClassName({
                  fullWidth: true,
                  className: "mt-6 w-full sm:w-auto",
                })}
              >
                Post a Shift
              </Link>
            ) : (
              <Link
                href="/company/billing"
                className={buttonClassName({
                  fullWidth: true,
                  className: "mt-6 w-full sm:w-auto",
                })}
              >
                View Billing
              </Link>
            )}
          </Card>
        ) : (
          shifts.map((shift) => (
            <CompanyShiftCard
              key={shift.id}
              shiftId={shift.id}
              title={shift.title}
              hourlyRate={shift.hourlyRate}
              location={shift.location}
              startTime={shift.startTime}
              endTime={shift.endTime}
              positionsNeeded={shift.positionsNeeded}
              filledCount={shift.applications.length}
              specialRequirements={shift.specialRequirements}
              status={shift.status}
            />
          ))
        )}
      </div>
    </PageShell>
  );
}
