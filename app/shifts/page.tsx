import { ApplicationStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import { Card, PageShell, SectionHeading } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { ShiftCard } from "./ShiftCard";

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

  return (
    <PageShell nav="officer" maxWidth="2xl">
      <SectionHeading
        title="Available Shifts"
        subtitle="Find open security shifts near you."
      />

      <div className="mt-8 space-y-4">
        {shifts.length === 0 ? (
          <Card variant="muted" className="text-center">
            <p className="text-lg font-medium text-fo-text">No shifts posted yet.</p>
            <p className="mt-2 text-sm text-fo-text-muted">
              Check back soon for new security opportunities.
            </p>
          </Card>
        ) : (
          shifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              id={shift.id}
              title={shift.title}
              hourlyRate={shift.hourlyRate}
              companyName={shift.company.companyName}
              location={shift.location}
              startTime={shift.startTime}
              endTime={shift.endTime}
              positionsNeeded={shift.positionsNeeded}
              filledCount={shift.applications.length}
              specialRequirements={shift.specialRequirements}
              status={shift.status}
            />
          ))
        )}
      </div>
    </PageShell>
  );
}
