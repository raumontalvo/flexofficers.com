import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import {
  mapOfficerAcceptedShiftApplication,
  officerAcceptedShiftListSelect,
} from "@/lib/officer-accepted-shift-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { UpcomingShiftsBrowseList } from "./UpcomingShiftsBrowseList";

export const dynamic = "force-dynamic";

export default async function OfficerUpcomingShiftsPage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const applications = await prisma.application.findMany({
    where: {
      status: ApplicationStatus.ACCEPTED,
      officer: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    },
    select: officerAcceptedShiftListSelect,
    orderBy: {
      shift: {
        startTime: "asc",
      },
    },
  });

  const acceptedShiftData = applications.map(mapOfficerAcceptedShiftApplication);

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar>
      <UpcomingShiftsBrowseList applications={acceptedShiftData} />
    </PageShell>
  );
}
