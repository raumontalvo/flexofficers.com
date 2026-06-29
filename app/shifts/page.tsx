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
    <PageShell nav="officer" maxWidth="6xl" sidebar contentClassName="!pt-2 md:!pt-5">
      <div className="space-y-0.5 md:hidden">
        <h1 className="text-xl font-bold tracking-tight text-fo-text">Open Shifts</h1>
        <p className="text-sm leading-snug text-fo-text-muted">
          Browse open shifts posted by companies.
        </p>
      </div>

      <SectionHeading
        title="Open Shifts"
        subtitle="Browse open shifts posted by companies."
        className="hidden md:flex"
      />

      <div className="mt-2 md:mt-3">
        <ShiftsBrowseList shifts={browseShifts} />
      </div>
    </PageShell>
  );
}
