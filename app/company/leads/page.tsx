import { UserRole } from "@/app/generated/prisma/enums";
import { CompanySecurityLeadsPage } from "@/components/company/company-security-leads-page";
import { PageShell } from "@/components/ui";
import {
  getCompanyLeadsPageStats,
  serializeCompanySecurityLead,
  type CompanyLeadsPageTab,
} from "@/lib/company-leads-page";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { securityLeadBrowseSelect } from "@/lib/security-lead-fields";
import { buildCompanyPublicLeadsBrowseWhere } from "@/lib/security-lead-data";

export const dynamic = "force-dynamic";

type CompanyLeadsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function getInitialTab(status?: string): CompanyLeadsPageTab {
  if (status === "active") return "active";
  if (status === "filled") return "filled";
  if (status === "closed") return "closed";
  if (status === "cancelled") return "cancelled";
  return "all";
}

export default async function CompanyLeadsPage({ searchParams }: CompanyLeadsPageProps) {
  await requirePageRole(UserRole.COMPANY);

  const { status } = await searchParams;
  const initialTab = getInitialTab(status);

  const leads = await prisma.securityLead.findMany({
    where: buildCompanyPublicLeadsBrowseWhere(),
    select: securityLeadBrowseSelect,
    orderBy: { createdAt: "desc" },
  });

  const serialized = leads.map((lead) => serializeCompanySecurityLead(lead));
  const stats = getCompanyLeadsPageStats(leads);

  return (
    <PageShell nav="company" sidebar maxWidth="full">
      <CompanySecurityLeadsPage leads={serialized} stats={stats} initialTab={initialTab} />
    </PageShell>
  );
}
