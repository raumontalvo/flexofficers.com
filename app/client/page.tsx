import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { buttonClassName, PageShell } from "@/components/ui";
import { ensureClientOnSignup } from "@/lib/client-onboarding";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import {
  formatLeadDateLabel,
  serializeClientLeadCard,
} from "@/lib/security-lead-data";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  await requirePageRole(UserRole.CLIENT);
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/client/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { client: true },
  });

  if (!user) {
    redirect("/client/sign-in");
  }

  if (!user.client) {
    await prisma.$transaction(async (tx) => {
      await ensureClientOnSignup(tx, {
        userId: user.id,
        email: user.email,
        firstName: clerkUser.firstName,
      });
    });
  }

  const client = await prisma.client.findUnique({
    where: { userId: user.id },
  });

  if (!client) {
    redirect("/client/sign-in");
  }

  const leads = await prisma.securityLead.findMany({
    where: { clientId: client.id },
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
    take: 5,
  });

  const pendingApplicants = await prisma.securityLeadApplication.count({
    where: {
      securityLead: { clientId: client.id },
      status: "PENDING",
    },
  });

  const serializedLeads = leads.map(serializeClientLeadCard);

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
              Client Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-fo-text-muted">
              Post security needs and review company applicants.
            </p>
          </div>
          <Link
            href="/client/leads/new"
            className={buttonClassName({ size: "md", className: "shrink-0 self-start" })}
          >
            Create Lead
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="fo-glass-card rounded-2xl border border-white/10 p-4">
            <p className="text-sm text-fo-text-muted">My Leads</p>
            <p className="mt-1 text-2xl font-bold text-fo-text">{leads.length}</p>
          </div>
          <div className="fo-glass-card rounded-2xl border border-white/10 p-4">
            <p className="text-sm text-fo-text-muted">Pending Applicants</p>
            <p className="mt-1 text-2xl font-bold text-fo-text">{pendingApplicants}</p>
          </div>
          <div className="fo-glass-card rounded-2xl border border-white/10 p-4">
            <p className="text-sm text-fo-text-muted">Posting Fee</p>
            <p className="mt-1 text-2xl font-bold text-fo-text">$5</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-fo-text">Recent Leads</h2>
            <Link href="/client/leads" className="text-sm font-medium text-fo-primary-hover">
              View all
            </Link>
          </div>

          {serializedLeads.length === 0 ? (
            <div className="fo-glass-card rounded-2xl border border-white/10 p-6 text-sm text-fo-text-muted">
              No leads yet. Create your first security lead for $5.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {serializedLeads.map((lead) => (
                <article
                  key={lead.id}
                  className="fo-glass-card rounded-2xl border border-white/10 p-4"
                >
                  <h3 className="font-semibold text-fo-text">{lead.serviceNeeded}</h3>
                  <p className="mt-1 text-sm text-fo-text-muted">
                    {formatLeadDateLabel(lead.dateNeeded)} · {lead.city} · {lead.budgetOffer}
                  </p>
                  <p className="mt-2 text-sm text-fo-text-muted">
                    {lead.applicantCount} applicant{lead.applicantCount === 1 ? "" : "s"} ·{" "}
                    {lead.paymentStatus === "PAID" ? "Published" : "Payment pending"}
                  </p>
                  <Link
                    href={`/client/leads/${lead.id}/applicants`}
                    className={buttonClassName({
                      variant: "secondary",
                      size: "md",
                      className: "mt-4",
                    })}
                  >
                    View Applicants
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
