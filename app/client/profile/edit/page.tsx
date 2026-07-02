import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { ClientProfileEditForm } from "@/components/client/client-profile-edit-form";
import { PageShell } from "@/components/ui";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { buildClientProfileEditFormState } from "@/lib/client-profile-page-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientProfileEditPage() {
  const clerkUser = await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const [client, user] = await Promise.all([
    prisma.client.findUnique({
      where: { id: auth.client.id },
    }),
    prisma.user.findUnique({
      where: { id: auth.client.userId },
      select: { email: true },
    }),
  ]);

  if (!client || !user) {
    return null;
  }

  const initialForm = buildClientProfileEditFormState({
    client,
    userEmail: user.email,
    clerkImageUrl: clerkUser.imageUrl,
  });

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-fo-text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/client" className="transition hover:text-fo-primary-hover">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <Link href="/client/profile" className="transition hover:text-fo-primary-hover">
              Profile
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="text-fo-text">Edit</li>
        </ol>
      </nav>

      <ClientProfileEditForm initialForm={initialForm} />
    </PageShell>
  );
}
