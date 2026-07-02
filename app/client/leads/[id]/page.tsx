import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientLeadDetailPage({ params }: PageProps) {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    redirect("/client/sign-in");
  }

  const { id } = await params;

  const lead = await prisma.securityLead.findFirst({
    where: { id, clientId: auth.client.id },
    select: { id: true },
  });

  if (!lead) {
    redirect("/client/leads");
  }

  redirect(`/client/leads/${lead.id}/applicants`);
}
