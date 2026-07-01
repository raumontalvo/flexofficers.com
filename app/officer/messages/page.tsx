import { UserRole } from "@/app/generated/prisma/enums";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { OfficerMessagesEmpty } from "@/components/officer/officer-messages-empty";
import { PageShell } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function OfficerMessagesPage() {
  await requirePageRole(UserRole.OFFICER);

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <TranslatedSectionHeading page="officerMessages" />

      <OfficerMessagesEmpty />
    </PageShell>
  );
}
