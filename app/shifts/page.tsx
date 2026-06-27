import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { PageShell, SectionHeading } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import type { ShiftCardData } from "@/lib/shift-card-data";
import { ShiftsBrowseList } from "./ShiftsBrowseList";

export const dynamic = "force-dynamic";

export default async function ShiftsPage() {
  const shifts = await prisma.shift.findMany({
    where: {
      status: ShiftStatus.OPEN,
    },
    include: {
      company: {
        select: {
          companyName: true,
        },
      },
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

  const browseShifts: ShiftCardData[] = shifts.map((shift) => ({
    id: shift.id,
    title: shift.title,
    hourlyRate: shift.hourlyRate.toString(),
    companyName: shift.company.companyName,
    location: shift.location,
    city: shift.city,
    state: shift.state,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime.toISOString(),
    createdAt: shift.createdAt.toISOString(),
    positionsNeeded: shift.positionsNeeded,
    filledCount: shift.applications.length,
    workType: shift.workType,
    shiftTimeType: shift.shiftTimeType,
    armedRequirement: shift.armedRequirement,
    requirements: shift.requirements,
    otherRequirements: shift.otherRequirements,
    specialRequirements: shift.specialRequirements,
    status: shift.status,
  }));

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar>
      <SectionHeading
        title="Open Shifts"
        subtitle="Browse open shifts posted by companies."
      />

      <div className="mt-3">
        <ShiftsBrowseList shifts={browseShifts} />
      </div>
    </PageShell>
  );
}
