import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyApplicantsPageContent } from "@/components/company/company-applicants-page-content";
import { PageShell, SectionHeading } from "@/components/ui";
import { serializeCompanyApplicant, companyApplicationListSelect } from "@/lib/company-applications-page";
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
    select: companyApplicationListSelect,
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
