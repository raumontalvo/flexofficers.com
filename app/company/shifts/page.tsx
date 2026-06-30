import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import { MobilePrimaryButton } from "@/components/ui/mobile";
import { MyShiftsTable } from "@/components/company/my-shifts-table";
import {
  canCompanyPostNewShifts,
  getCompanyPostingBlockMessage,
} from "@/lib/company-access";
import { serializeCompanyShiftRow } from "@/lib/company-shifts-page";
import { getShiftWorkforceMap } from "@/lib/shift-workforce";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

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

  const canPostShifts = company ? canCompanyPostNewShifts(company) : false;
  const postingBlockMessage = company
    ? getCompanyPostingBlockMessage(company)
    : null;

  const shifts = await prisma.shift.findMany({
    where: {
      company: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    },
    select: {
      id: true,
      title: true,
      location: true,
      city: true,
      state: true,
      startTime: true,
      endTime: true,
      hourlyRate: true,
      status: true,
      positionsNeeded: true,
      applications: {
        select: {
          status: true,
          officer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      shiftInvites: {
        select: {
          status: true,
          officer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedShifts = shifts.map(serializeCompanyShiftRow);
  const workforceByShiftId = getShiftWorkforceMap(shifts);

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <div className="space-y-4 md:space-y-0">
        <div className="space-y-4 md:hidden">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fo-text">
              My Shifts
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-fo-text-muted">
              Track, manage, and update your posted shifts.
            </p>
          </div>

          <MobilePrimaryButton
            href={canPostShifts ? "/shifts/create" : "/company/billing"}
          >
            Post a Shift
          </MobilePrimaryButton>
        </div>

        <SectionHeading
          className="hidden md:flex"
          title="My Shifts"
          subtitle="Track, manage, and update your posted shifts."
          action={
            canPostShifts ? (
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

        {!canPostShifts ? (
          <Card variant="muted" className="md:mt-6">
            <p className="text-sm leading-relaxed text-fo-text-muted">
              {postingBlockMessage ??
                "Your trial or subscription is inactive. You can still manage existing shifts, but posting new shifts requires active access."}
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

        <MyShiftsTable
          shifts={serializedShifts}
          workforceByShiftId={workforceByShiftId}
          canPostShifts={canPostShifts}
        />
      </div>
    </PageShell>
  );
}
