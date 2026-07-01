import { UserRole } from "@/app/generated/prisma/enums";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { Card, PageShell } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function CompanyReportsPage() {
  await requirePageRole(UserRole.COMPANY);

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <TranslatedSectionHeading page="companyReports" />

      <Card variant="muted" className="fo-glass-card mt-8 border border-white/10">
        <p className="text-sm text-fo-text-muted">Coming soon.</p>
      </Card>
    </PageShell>
  );
}
