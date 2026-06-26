import { UserRole } from "@/app/generated/prisma/enums";
import { Card, PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function OfficerNotificationsPage() {
  await requirePageRole(UserRole.OFFICER);

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Notifications"
        subtitle="Application updates and shift alerts will appear here."
      />

      <Card variant="muted" className="fo-glass-card mt-8 text-center">
        <p className="text-lg font-medium text-fo-text">No notifications yet.</p>
        <p className="mt-2 text-sm text-fo-text-muted">
          Notification delivery is not active in Version 1.0.
        </p>
      </Card>
    </PageShell>
  );
}
