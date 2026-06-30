import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { officerApplicationListSelect } from "@/lib/application-fields";
import { mapOfficerApplication } from "@/lib/officer-application-data";
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
    select: officerApplicationListSelect,
    orderBy: {
      appliedAt: "desc",
    },
  });

  const applicationData = applications.map(mapOfficerApplication);

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar contentClassName="!pt-2 md:!pt-5">
      <ApplicationsBrowseList applications={applicationData} />
    </PageShell>
  );
}
