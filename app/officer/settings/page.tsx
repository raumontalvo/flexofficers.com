import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { OfficerSettingsContent } from "./OfficerSettingsContent";

export const dynamic = "force-dynamic";

export default async function OfficerSettingsPage() {
  await requirePageRole(UserRole.OFFICER);

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Settings"
        subtitle="Manage your account preferences and security."
      />

      <div className="mt-8">
        <OfficerSettingsContent />
      </div>
    </PageShell>
  );
}
