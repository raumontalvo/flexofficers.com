import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyApplicantsPageContent } from "@/components/company/company-applicants-page-content";
import { PageShell, SectionHeading } from "@/components/ui";
import { serializeCompanyApplicant } from "@/lib/company-applications-page";
import { officerApplicantSelect, officerUserSummarySelect } from "@/lib/officer-fields";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CompanyApplicationsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const applications = await prisma.application.findMany({
    where: {
      shift: {
        company: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      },
    },
    include: {
      shift: {
        select: {
          id: true,
          title: true,
          location: true,
          city: true,
          state: true,
          startTime: true,
          endTime: true,
          status: true,
          hourlyRate: true,
          positionsNeeded: true,
          workType: true,
          requirements: true,
          otherRequirements: true,
          armedRequirement: true,
        },
      },
      officer: {
        select: {
          ...officerApplicantSelect,
          phone: true,
          availability: true,
          state: true,
          user: {
            select: officerUserSummarySelect,
          },
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  const serializedApplications = applications.map(serializeCompanyApplicant);

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <SectionHeading
        title="Applicants"
        subtitle="Manage applicants who have applied to your shifts."
      />

      <div className="min-w-0 overflow-x-hidden">
        <CompanyApplicantsPageContent applications={serializedApplications} />
      </div>
    </PageShell>
  );
}
