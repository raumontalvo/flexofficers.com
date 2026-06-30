import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { buildShiftWorkforceGroups } from "@/lib/company-workforce-data";
import { companyWorkforceApplicationSelect } from "@/lib/application-fields";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { CompanyWorkforceBrowseList } from "../accepted-officers/CompanyWorkforceBrowseList";

export const dynamic = "force-dynamic";

export default async function CompanyCompletedShiftsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const applications = await prisma.application.findMany({
    where: {
      status: ApplicationStatus.ACCEPTED,
      shift: {
        company: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      },
    },
    select: companyWorkforceApplicationSelect,
    orderBy: {
      shift: {
        startTime: "desc",
      },
    },
  });

  const groups = buildShiftWorkforceGroups(applications);

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <CompanyWorkforceBrowseList groups={groups} mode="completed" />
    </PageShell>
  );
}
