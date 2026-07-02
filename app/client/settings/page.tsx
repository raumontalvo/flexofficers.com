import { UserRole } from "@/app/generated/prisma/enums";
import { ClientSettingsPageContent } from "@/components/client/client-settings-page-content";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function ClientSettingsPage() {
  await requirePageRole(UserRole.CLIENT);

  return <ClientSettingsPageContent />;
}
