import { UserRole } from "@/app/generated/prisma/enums";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { Card, PageShell } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function OfficerMessagesPage() {
  await requirePageRole(UserRole.OFFICER);

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <TranslatedSectionHeading page="officerMessages" />

      <Card variant="muted" className="fo-glass-card mt-8 text-center">
        <p className="text-lg font-medium text-fo-text">No messages yet.</p>
        <p className="mt-2 text-sm text-fo-text-muted">
          Company messaging is not active in Version 1.0.
        </p>
      </Card>
    </PageShell>
  );
}
