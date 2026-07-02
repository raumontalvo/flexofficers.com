import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { StatusBadge, buttonClassName, PageShell } from "@/components/ui";
import { companyLeadApplicationListSelect } from "@/lib/security-lead-fields";
import {
  formatLeadApplicationStatusLabel,
  formatLeadDateLabel,
} from "@/lib/security-lead-data";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function CompanyLeadApplicationsPage() {
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

  return (
    <PageShell nav="company" sidebar maxWidth="full">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fo-text sm:text-3xl">
              My Lead Applications
            </h1>
            <p className="mt-1.5 text-sm text-fo-text-muted">
              Track applications you submitted to client security leads.
            </p>
          </div>
          <Link
            href="/company/leads"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0 self-start",
            })}
          >
            Browse Leads
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="fo-glass-card rounded-2xl border border-white/10 p-6 text-sm text-fo-text-muted">
            You have not applied to any leads yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((application) => {
              const statusVariant =
                application.status === "ACCEPTED"
                  ? "success"
                  : application.status === "REJECTED"
                    ? "rejected"
                    : "pending";

              return (
                <article
                  key={application.id}
                  className="fo-glass-card rounded-2xl border border-white/10 p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-fo-text">
                        {application.securityLead.serviceNeeded}
                      </h2>
                      <p className="mt-1 text-sm text-fo-text-muted">
                        {application.securityLead.city}, {application.securityLead.state}
                      </p>
                    </div>
                    <StatusBadge variant={statusVariant}>
                      {formatLeadApplicationStatusLabel(application.status)}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-fo-text-muted">
                    {formatLeadDateLabel(application.securityLead.dateNeeded.toISOString())} ·{" "}
                    {application.securityLead.budgetOffer}
                  </p>
                  {application.message ? (
                    <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-fo-text-muted">
                      {application.message}
                    </p>
                  ) : null}
                  <Link
                    href={`/company/leads/${application.securityLead.id}`}
                    className={buttonClassName({
                      variant: "secondary",
                      size: "md",
                      className: "mt-4",
                    })}
                  >
                    View Lead
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
