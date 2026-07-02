import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyLeadApplicationsPage } from "@/components/company/company-lead-applications-page";
import { PageShell } from "@/components/ui";
import {
  getCompanyApplicationsPageStats,
  serializeCompanyLeadApplication,
} from "@/lib/company-lead-applications-page";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { companyLeadApplicationListSelect } from "@/lib/security-lead-fields";

export const dynamic = "force-dynamic";

export default async function CompanyLeadApplicationsRoute() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const company = await prisma.company.findFirst({
    where: { user: { clerkId: clerkUser.id } },
    select: { id: true },
  });

  if (!company) {
    return null;
  }

  const applications = await prisma.securityLeadApplication.findMany({
    where: { companyId: company.id },
    select: companyLeadApplicationListSelect,
    orderBy: { createdAt: "desc" },
  });

  const serialized = applications.map(serializeCompanyLeadApplication);
  const stats = getCompanyApplicationsPageStats(applications);

  return (
    <PageShell nav="company" sidebar maxWidth="full">
      <CompanyLeadApplicationsPage applications={serialized} stats={stats} />
    </PageShell>
  );
}
