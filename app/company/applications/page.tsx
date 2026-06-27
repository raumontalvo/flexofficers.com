import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import { Card, PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { officerApplicantSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "./ApplicantCard";

export const dynamic = "force-dynamic";

export default async function CompanyApplicationsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const applications = await prisma.application.findMany({
    where: {
      status: ApplicationStatus.PENDING,
      shift: {
        company: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      },
    },
    include: {
      shift: true,
      officer: {
        select: officerApplicantSelect,
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <SectionHeading
        title="Applicants"
        subtitle="Review officers who applied to your shifts. Accepted officers move to Accepted Officers."
      />

      <div className="mt-8 space-y-4">
        {applications.length === 0 ? (
          <Card variant="muted" className="text-center">
            <p className="text-lg font-medium text-fo-text">No applications yet.</p>
            <p className="mt-2 text-sm text-fo-text-muted">
              When officers apply to your shifts, they will appear here for
              review.
            </p>
          </Card>
        ) : (
          applications.map((application) => (
            <ApplicantCard
              key={application.id}
              applicationId={application.id}
              applicationStatus={application.status}
              shiftTitle={application.shift.title}
              shiftStatus={application.shift.status}
              hourlyRate={application.shift.hourlyRate}
              location={application.shift.location}
              startTime={application.shift.startTime}
              endTime={application.shift.endTime}
              officerFirstName={application.officer.firstName}
              officerLastName={application.officer.lastName}
              profilePhotoUrl={application.officer.profilePhotoUrl}
              city={application.officer.city}
              armedStatuses={application.officer.armedStatuses}
              experienceYears={application.officer.experienceYears}
              certifications={application.officer.certifications}
              experienceCategories={application.officer.experienceCategories}
              introduction={application.officer.introduction}
              licenses={application.officer.licenses}
            />
          ))
        )}
      </div>
    </PageShell>
  );
}
