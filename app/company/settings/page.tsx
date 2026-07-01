import { UserRole } from "@/app/generated/prisma/enums";
import { SettingsPageContent } from "@/components/settings/settings-page-content";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function CompanySettingsPage() {
  await requirePageRole(UserRole.COMPANY);

  return <SettingsPageContent role="company" nav="company" />;
}
