import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { ClientApplicantsOverviewCard } from "@/components/dashboard/client-applicants-overview";
import { ClientDashboardCta } from "@/components/dashboard/client-dashboard-cta";
import { ClientDashboardHeader } from "@/components/dashboard/client-dashboard-header";
import { ClientQuickActions } from "@/components/dashboard/client-quick-actions";
import { ClientRecentLeads } from "@/components/dashboard/client-recent-leads";
import { ClientSummaryCards } from "@/components/dashboard/client-summary-cards";
import { ensureClientOnSignup } from "@/lib/client-onboarding";
import {
  getClientApplicantsOverview,
  getClientDashboardStats,
  serializeClientDashboardLead,
} from "@/lib/client-dashboard-data";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { formatSecurityLeadPrice } from "@/lib/security-lead-pricing";

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
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

  const [allLeads, recentLeads, pendingApplicants, applications] =
    await Promise.all([
      prisma.securityLead.findMany({
        where: { clientId: client.id },
        select: {
          status: true,
          paymentStatus: true,
        },
      }),
      prisma.securityLead.findMany({
        where: { clientId: client.id },
        select: {
          id: true,
          serviceNeeded: true,
          city: true,
          state: true,
          dateNeeded: true,
          startTime: true,
          endTime: true,
          status: true,
          paymentStatus: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.securityLeadApplication.count({
        where: {
          securityLead: { clientId: client.id },
          status: "PENDING",
        },
      }),
      prisma.securityLeadApplication.findMany({
        where: {
          securityLead: { clientId: client.id },
        },
        select: {
          status: true,
        },
      }),
    ]);

  const stats = getClientDashboardStats({
    leads: allLeads,
    pendingApplicants,
  });
  const overview = getClientApplicantsOverview(applications);
  const serializedRecentLeads = recentLeads.map(serializeClientDashboardLead);
  const postingFeeLabel = formatSecurityLeadPrice();

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <div className="min-w-0 space-y-5">
        <ClientDashboardHeader />

        <ClientSummaryCards stats={stats} postingFeeLabel={postingFeeLabel} />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <ClientRecentLeads leads={serializedRecentLeads} />
          </div>

          <aside className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-4 xl:self-start">
            <ClientApplicantsOverviewCard overview={overview} />
            <ClientDashboardCta />
            <ClientQuickActions />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
