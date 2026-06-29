import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import type { OfficerApplicationData } from "@/lib/officer-application-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { ApplicationsBrowseList } from "./ApplicationsBrowseList";

export const dynamic = "force-dynamic";

export default async function OfficerApplicationsPage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const applications = await prisma.application.findMany({
    where: {
      officer: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    },
    include: {
      shift: {
        include: {
          company: {
            select: {
              companyName: true,
            },
          },
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  const applicationData: OfficerApplicationData[] = applications.map(
    (application) => ({
      id: application.id,
      status: application.status,
      appliedAt: application.appliedAt.toISOString(),
      shift: {
        id: application.shift.id,
        title: application.shift.title,
        hourlyRate: application.shift.hourlyRate.toString(),
        companyName: application.shift.company.companyName,
        location: application.shift.location,
        city: application.shift.city,
        state: application.shift.state,
        startTime: application.shift.startTime.toISOString(),
        endTime: application.shift.endTime.toISOString(),
        shiftTimeType: application.shift.shiftTimeType,
        requirements: application.shift.requirements,
        otherRequirements: application.shift.otherRequirements,
        specialRequirements: application.shift.specialRequirements,
        status: application.shift.status,
      },
    })
  );

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar contentClassName="!pt-2 md:!pt-5">
      <ApplicationsBrowseList applications={applicationData} />
    </PageShell>
  );
}
