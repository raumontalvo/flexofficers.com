import { UserRole, ApplicationStatus } from "@/app/generated/prisma/enums";
import { CompanyOfficersPageContent } from "@/components/company/company-officers-page-content";
import { PageShell, SectionHeading } from "@/components/ui";
import { serializeOfficerSearchResult } from "@/lib/company-officers-page";
import { officerSearchCardSelect, officerUserSummarySelect } from "@/lib/officer-fields";
import {
  buildOfficerSearchWhere,
  parseOfficerSearchFilters,
} from "@/lib/officer-search";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { INVITEABLE_SHIFT_STATUSES } from "@/lib/shift-fill-status";

export const dynamic = "force-dynamic";

type CompanyOfficersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompanyOfficersPage({
  searchParams,
}: CompanyOfficersPageProps) {
  const clerkUser = await requirePageRole(UserRole.COMPANY);
  const params = await searchParams;
  const filters = parseOfficerSearchFilters(params);

  const [officers, openShifts, invites, staffMembers, acceptedAssignments] =
    await Promise.all([
    prisma.officer.findMany({
      where: buildOfficerSearchWhere(filters),
      select: {
        ...officerSearchCardSelect,
        user: {
          select: officerUserSummarySelect,
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    prisma.shift.findMany({
      where: {
        status: {
          in: INVITEABLE_SHIFT_STATUSES,
        },
        company: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        startTime: true,
        visibility: true,
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.shiftInvite.findMany({
      where: {
        shift: {
          company: {
            user: {
              clerkId: clerkUser.id,
            },
          },
        },
      },
      select: {
        id: true,
        officerId: true,
        shiftId: true,
        status: true,
      },
    }),
    prisma.company.findFirst({
      where: {
        user: {
          clerkId: clerkUser.id,
        },
      },
      select: {
        id: true,
        staffMembers: {
          select: {
            officerId: true,
          },
        },
      },
    }),
    prisma.application.findMany({
      where: {
        status: ApplicationStatus.ACCEPTED,
        shift: {
          company: {
            user: {
              clerkId: clerkUser.id,
            },
          },
          status: {
            in: INVITEABLE_SHIFT_STATUSES,
          },
        },
      },
      select: {
        officerId: true,
        shiftId: true,
      },
    }),
  ]);

  const serializedOfficers = officers.map(serializeOfficerSearchResult);
  const hasActiveFilters = Object.keys(filters).length > 0;
  const serializedOpenShifts = openShifts.map((shift) => ({
    id: shift.id,
    title: shift.title,
    city: shift.city,
    state: shift.state,
    startTime: shift.startTime.toISOString(),
    visibility: shift.visibility,
  }));

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <SectionHeading
        title="Officers"
        subtitle="Find qualified officers near your shifts and invite them to apply."
      />

      <CompanyOfficersPageContent
        officers={serializedOfficers}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        openShifts={serializedOpenShifts}
        invites={invites}
        acceptedAssignments={acceptedAssignments}
        staffOfficerIds={
          staffMembers?.staffMembers.map((member) => member.officerId) ?? []
        }
      />
    </PageShell>
  );
}
