import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell, SectionHeading } from "@/components/ui";
import {
  companyStaffMemberSelect,
  serializeCompanyStaffMember,
} from "@/lib/company-staff";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { INVITEABLE_SHIFT_STATUSES } from "@/lib/shift-fill-status";
import { CompanyStaffBrowseList } from "./CompanyStaffBrowseList";

export const dynamic = "force-dynamic";

export default async function CompanyStaffPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const company = await prisma.company.findFirst({
    where: {
      user: {
        clerkId: clerkUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    return null;
  }

  const [staffMembers, openShifts, invites] = await Promise.all([
    prisma.companyStaff.findMany({
      where: {
        companyId: company.id,
      },
      select: companyStaffMemberSelect,
      orderBy: {
        addedAt: "desc",
      },
    }),
    prisma.shift.findMany({
      where: {
        status: {
          in: INVITEABLE_SHIFT_STATUSES,
        },
        companyId: company.id,
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
          companyId: company.id,
        },
      },
      select: {
        id: true,
        officerId: true,
        shiftId: true,
        status: true,
      },
    }),
  ]);

  const serializedStaff = staffMembers.map(serializeCompanyStaffMember);
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
        title="Staff"
        subtitle="Officers on your private roster. Invite them to staff-only shifts or any open shift you post."
      />

      <CompanyStaffBrowseList
        staff={serializedStaff}
        openShifts={serializedOpenShifts}
        invites={invites}
      />
    </PageShell>
  );
}
