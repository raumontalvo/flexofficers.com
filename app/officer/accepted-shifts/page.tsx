import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import {
  mapOfficerAcceptedShiftApplication,
  officerAcceptedShiftListSelect,
} from "@/lib/officer-accepted-shift-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { AcceptedShiftsBrowseList } from "./AcceptedShiftsBrowseList";

export const dynamic = "force-dynamic";

export default async function OfficerAcceptedShiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; shiftId?: string }>;
}) {
  const clerkUser = await requirePageRole(UserRole.OFFICER);
  const { tab, shiftId } = await searchParams;
  const initialTab =
    tab === "upcoming" || tab === "completed" || tab === "cancelled"
      ? tab
      : undefined;

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
      appliedAt: "desc",
    },
  });

  const acceptedShiftData = applications.map(mapOfficerAcceptedShiftApplication);

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar>
      <AcceptedShiftsBrowseList
        applications={acceptedShiftData}
        initialTab={initialTab}
        focusShiftId={shiftId ?? null}
      />
    </PageShell>
  );
}
