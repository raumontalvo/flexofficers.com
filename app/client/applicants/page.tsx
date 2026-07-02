import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { ClientLeadApplicantCard } from "@/components/client/client-lead-applicant-card";
import { PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { leadApplicationListSelect } from "@/lib/security-lead-fields";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { serializeLeadApplicant } from "@/lib/security-lead-data";

export const dynamic = "force-dynamic";

export default async function ClientApplicantsPage() {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const applications = await prisma.securityLeadApplication.findMany({
    where: {
      securityLead: { clientId: auth.client.id },
    },
    select: {
      ...leadApplicationListSelect,
      securityLeadId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-fo-text sm:text-3xl">Applicants</h1>
          <p className="mt-1.5 text-sm text-fo-text-muted">
            All company applications across your security leads.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="fo-glass-card rounded-2xl border border-white/10 p-6 text-sm text-fo-text-muted">
            No applicants yet.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {applications.map((application) => (
              <div key={application.id} className="space-y-2">
                <Link
                  href={`/client/leads/${application.securityLeadId}/applicants`}
                  className="text-xs font-medium uppercase tracking-wide text-fo-primary-hover"
                >
                  View lead applicants
                </Link>
                <ClientLeadApplicantCard
                  leadId={application.securityLeadId}
                  applicant={serializeLeadApplicant(application)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
