import { UserRole } from "@/app/generated/prisma/enums";
import { ClientSecurityRequestsPage } from "@/components/client/client-security-requests-page";
import { PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import {
  getClientLeadsPageStats,
  serializeClientSecurityRequest,
} from "@/lib/client-leads-page";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { securityLeadClientListSelect } from "@/lib/security-lead-fields";

export const dynamic = "force-dynamic";

type ClientLeadsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function getInitialTab(status?: string) {
  if (status === "active") return "active" as const;
  if (status === "pending") return "pending" as const;
  if (status === "completed") return "completed" as const;
  if (status === "cancelled") return "cancelled" as const;
  return "all" as const;
}

export default async function ClientLeadsPage({ searchParams }: ClientLeadsPageProps) {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const { status } = await searchParams;
  const initialTab = getInitialTab(status);

  const leads = await prisma.securityLead.findMany({
    where: { clientId: auth.client.id },
    select: securityLeadClientListSelect,
    orderBy: { createdAt: "desc" },
  });

  const requests = leads.map(serializeClientSecurityRequest);
  const stats = getClientLeadsPageStats(leads);

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <ClientSecurityRequestsPage
        requests={requests}
        stats={stats}
        initialTab={initialTab}
      />
    </PageShell>
  );
}
