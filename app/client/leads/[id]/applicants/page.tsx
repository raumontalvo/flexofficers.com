import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { ClientLeadApplicantCard } from "@/components/client/client-lead-applicant-card";
import { buttonClassName, PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { leadApplicationListSelect } from "@/lib/security-lead-fields";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { serializeLeadApplicant } from "@/lib/security-lead-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientLeadApplicantsPage({ params }: PageProps) {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const { id } = await params;

  const lead = await prisma.securityLead.findFirst({
    where: { id, clientId: auth.client.id },
    select: { id: true, serviceNeeded: true },
  });

  if (!lead) {
    notFound();
  }

  const applications = await prisma.securityLeadApplication.findMany({
    where: { securityLeadId: lead.id },
    select: leadApplicationListSelect,
    orderBy: { createdAt: "desc" },
  });

  const applicants = applications.map((application) =>
    serializeLeadApplicant({
      ...application,
      company: { ...application.company, id: application.company.id },
    })
  );

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fo-text sm:text-3xl">Applicants</h1>
            <p className="mt-1.5 text-sm text-fo-text-muted">{lead.serviceNeeded}</p>
          </div>
          <Link
            href="/client/leads"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0 self-start",
            })}
          >
            Back to Leads
          </Link>
        </div>

        {applicants.length === 0 ? (
          <div className="fo-glass-card rounded-2xl border border-white/10 p-6 text-sm text-fo-text-muted">
            No company applications yet.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {applicants.map((applicant) => (
              <ClientLeadApplicantCard
                key={applicant.id}
                leadId={lead.id}
                applicant={applicant}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
