import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { buttonClassName, Card, PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { ApplicationCard } from "./ApplicationCard";

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

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <SectionHeading
        title="My Shifts"
        subtitle="Shifts you've applied to."
        action={
          applications.some((application) => application.status === "ACCEPTED") ? (
            <Link
              href="/officer/accepted-shifts"
              className={buttonClassName({ variant: "secondary", size: "md" })}
            >
              Accepted Shifts
            </Link>
          ) : undefined
        }
      />

      <div className="mt-8 space-y-4">
        {applications.length === 0 ? (
          <Card variant="muted" className="text-center">
            <p className="text-lg font-medium text-fo-text">
              You have not applied to any shifts yet.
            </p>
            <p className="mt-2 text-sm text-fo-text-muted">
              Browse open shifts and apply to start building your schedule.
            </p>
            <Link
              href="/shifts"
              className={buttonClassName({
                fullWidth: true,
                className: "mt-6 w-full sm:w-auto",
              })}
            >
              Browse Shifts
            </Link>
          </Card>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              applicationId={application.id}
              applicationStatus={application.status}
              shiftId={application.shift.id}
              title={application.shift.title}
              hourlyRate={application.shift.hourlyRate}
              companyName={application.shift.company.companyName}
              location={application.shift.location}
              startTime={application.shift.startTime}
              endTime={application.shift.endTime}
              positionsNeeded={application.shift.positionsNeeded}
              specialRequirements={application.shift.specialRequirements}
              shiftStatus={application.shift.status}
            />
          ))
        )}
      </div>
    </PageShell>
  );
}
