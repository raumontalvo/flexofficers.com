import { UserRole } from "@/app/generated/prisma/enums";
import { ClientLeadApplicationsPage } from "@/components/client/client-lead-applications-page";
import { PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import {
  getClientApplicationsPageStats,
  serializeClientLeadApplication,
} from "@/lib/client-applications-page";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import { clientLeadApplicationListSelect } from "@/lib/security-lead-fields";

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
    select: clientLeadApplicationListSelect,
    orderBy: { createdAt: "desc" },
  });

  const serialized = applications.map(serializeClientLeadApplication);
  const stats = getClientApplicationsPageStats(applications);

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <ClientLeadApplicationsPage applications={serialized} stats={stats} />
    </PageShell>
  );
}
