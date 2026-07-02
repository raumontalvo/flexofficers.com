import { UserRole } from "@/app/generated/prisma/enums";
import { ClientProfilePageContent } from "@/components/client/client-profile-page-content";
import { PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { serializeClientProfile } from "@/lib/client-profile-page-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage() {
  const clerkUser = await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const [client, user, leads] = await Promise.all([
    prisma.client.findUnique({
      where: { id: auth.client.id },
    }),
    prisma.user.findUnique({
      where: { id: auth.client.userId },
      select: {
        email: true,
        emailNotificationsEnabled: true,
      },
    }),
    prisma.securityLead.findMany({
      where: { clientId: auth.client.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        serviceNeeded: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        applications: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            createdAt: true,
            company: {
              select: { companyName: true },
            },
          },
        },
      },
    }),
  ]);

  if (!client || !user) {
    return null;
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (entry) => entry.id === clerkUser.primaryEmailAddressId
  );
  const emailVerified = primaryEmail?.verification?.status === "verified";

  const profile = serializeClientProfile({
    client,
    user,
    clerkImageUrl: clerkUser.imageUrl,
    emailVerified,
    leads,
  });

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <ClientProfilePageContent profile={profile} />
    </PageShell>
  );
}
