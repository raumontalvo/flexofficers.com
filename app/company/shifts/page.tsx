import { UserRole } from "@/app/generated/prisma/enums";
import {
  CompanyShiftsPageHeader,
  CompanyShiftsPostingBlockCard,
} from "@/components/company/company-shifts-page-header";
import { Card, PageShell } from "@/components/ui";
import { MyShiftsTable } from "@/components/company/my-shifts-table";
import { canCompanyPostNewShifts } from "@/lib/company-access";
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
        <CompanyShiftsPageHeader canPostShifts={canPostShifts} />

        {!canPostShifts && company ? (
          <Card variant="muted" className="md:mt-6">
            <CompanyShiftsPostingBlockCard company={company} />
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
