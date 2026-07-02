import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyLeadsBrowse } from "@/components/company/company-leads-browse";
import { buttonClassName, PageShell } from "@/components/ui";
import { securityLeadBrowseSelect } from "@/lib/security-lead-fields";
import {
  buildPublicLeadsWhere,
  serializeSecurityLeadCard,
} from "@/lib/security-lead-data";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function CompanyLeadsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const company = await prisma.company.findFirst({
    where: { user: { clerkId: clerkUser.id } },
    select: { id: true },
  });

  const [leads, applications] = await Promise.all([
    prisma.securityLead.findMany({
      where: buildPublicLeadsWhere(),
      select: securityLeadBrowseSelect,
      orderBy: { createdAt: "desc" },
    }),
    company
      ? prisma.securityLeadApplication.findMany({
          where: { companyId: company.id },
          select: { securityLeadId: true },
        })
      : Promise.resolve([]),
  ]);

  const serialized = leads.map(serializeSecurityLeadCard);
  const appliedLeadIds = applications.map((item) => item.securityLeadId);

  return (
    <PageShell nav="company" sidebar maxWidth="full">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fo-text sm:text-3xl">
              Security Leads
            </h1>
            <p className="mt-1.5 text-sm text-fo-text-muted">
              Browse public security needs posted by clients.
            </p>
          </div>
          <Link
            href="/company/lead-applications"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0 self-start",
            })}
          >
            My Applications
          </Link>
        </div>

        <CompanyLeadsBrowse leads={serialized} appliedLeadIds={appliedLeadIds} />
      </div>
    </PageShell>
  );
}
