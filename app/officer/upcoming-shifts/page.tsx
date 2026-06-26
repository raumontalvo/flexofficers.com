import { UserRole } from "@/app/generated/prisma/enums";
import { Card, PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function OfficerUpcomingShiftsPage() {
  await requirePageRole(UserRole.OFFICER);

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Upcoming Shifts"
        subtitle="Accepted assignments with future start dates will appear here."
      />

      <Card variant="muted" className="fo-glass-card mt-8 text-center">
        <p className="text-lg font-medium text-fo-text">
          Upcoming shift scheduling is coming soon.
        </p>
        <p className="mt-2 text-sm text-fo-text-muted">
          For now, view accepted assignments on the Accepted Shifts page.
        </p>
      </Card>
    </PageShell>
  );
}
