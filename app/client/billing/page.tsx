import { LeadPaymentStatus, UserRole } from "@/app/generated/prisma/enums";
import {
  buildClientBillingHistoryItems,
  formatClientTotalSpent,
} from "@/lib/client-billing-page-data";
import { ClientBillingPageContent } from "@/components/client/client-billing-page-content";
import { PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientBillingPage() {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const paidLeads = await prisma.securityLead.findMany({
    where: {
      clientId: auth.client.id,
      paymentStatus: LeadPaymentStatus.PAID,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      serviceNeeded: true,
      createdAt: true,
    },
  });

  const items = buildClientBillingHistoryItems(paidLeads);
  const totalSpentLabel = formatClientTotalSpent(paidLeads.length);

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <ClientBillingPageContent items={items} totalSpentLabel={totalSpentLabel} />
    </PageShell>
  );
}
