import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { buttonClassName, PageShell, StatusBadge } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import {
  formatLeadDateLabel,
  formatLeadStatusLabel,
  serializeClientLeadCard,
} from "@/lib/security-lead-data";

export const dynamic = "force-dynamic";

export default async function ClientLeadsPage() {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const leads = await prisma.securityLead.findMany({
    where: { clientId: auth.client.id },
    select: {
      id: true,
      serviceNeeded: true,
      city: true,
      dateNeeded: true,
      budgetOffer: true,
      status: true,
      paymentStatus: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = leads.map(serializeClientLeadCard);

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fo-text sm:text-3xl">My Leads</h1>
            <p className="mt-1.5 text-sm text-fo-text-muted">
              Manage your posted security needs.
            </p>
          </div>
          <Link
            href="/client/leads/new"
            className={buttonClassName({ size: "md", className: "shrink-0 self-start" })}
          >
            Create Lead
          </Link>
        </div>

        {serialized.length === 0 ? (
          <div className="fo-glass-card rounded-2xl border border-white/10 p-6 text-sm text-fo-text-muted">
            No leads yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serialized.map((lead) => (
              <article
                key={lead.id}
                className="fo-glass-card flex flex-col rounded-2xl border border-white/10 p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-fo-text">{lead.serviceNeeded}</h2>
                  <StatusBadge
                    variant={
                      lead.paymentStatus === "PAID" ? "success" : "pending"
                    }
                  >
                    {lead.paymentStatus === "PAID"
                      ? formatLeadStatusLabel(lead.status)
                      : "Unpaid"}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-sm text-fo-text-muted">
                  {formatLeadDateLabel(lead.dateNeeded)} · {lead.city}
                </p>
                <p className="mt-1 text-sm font-medium text-fo-text">{lead.budgetOffer}</p>
                <p className="mt-2 text-sm text-fo-text-muted">
                  {lead.applicantCount} applicant{lead.applicantCount === 1 ? "" : "s"}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link
                    href={`/client/leads/${lead.id}/applicants`}
                    className={buttonClassName({
                      size: "md",
                      className: "min-w-0 flex-1",
                    })}
                  >
                    View Applicants
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
