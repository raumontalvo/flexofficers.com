import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyLeadApplyForm } from "@/components/company/company-lead-apply-form";
import { SecurityLeadCard } from "@/components/security-leads/security-lead-card";
import { buttonClassName, PageShell } from "@/components/ui";
import { securityLeadDetailSelect } from "@/lib/security-lead-fields";
import {
  buildPublicLeadsWhere,
  serializeSecurityLeadCard,
} from "@/lib/security-lead-data";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyLeadDetailPage({ params }: PageProps) {
  const clerkUser = await requirePageRole(UserRole.COMPANY);
  const { id } = await params;

  const company = await prisma.company.findFirst({
    where: { user: { clerkId: clerkUser.id } },
    select: { id: true },
  });

  const lead = await prisma.securityLead.findFirst({
    where: { id, ...buildPublicLeadsWhere() },
    select: securityLeadDetailSelect,
  });

  if (!lead) {
    notFound();
  }

  const existingApplication = company
    ? await prisma.securityLeadApplication.findUnique({
        where: {
          securityLeadId_companyId: {
            securityLeadId: lead.id,
            companyId: company.id,
          },
        },
      })
    : null;

  const serialized = serializeSecurityLeadCard({
    ...lead,
    _count: { applications: 0 },
  });

  return (
    <PageShell nav="company" sidebar maxWidth="2xl">
      <div className="space-y-6">
        <Link
          href="/company/leads"
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "self-start",
          })}
        >
          Back to Leads
        </Link>

        <SecurityLeadCard lead={serialized} />

        <div className="fo-glass-card rounded-2xl border border-white/10 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-fo-text">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fo-text-muted">
            {lead.description}
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-fo-text-muted">Address</dt>
              <dd className="font-medium text-fo-text">{lead.address}</dd>
            </div>
            <div>
              <dt className="text-fo-text-muted">Contact</dt>
              <dd className="font-medium text-fo-text">{lead.contactName}</dd>
            </div>
          </dl>
        </div>

        <CompanyLeadApplyForm
          securityLeadId={lead.id}
          alreadyApplied={Boolean(existingApplication)}
        />
      </div>
    </PageShell>
  );
}
