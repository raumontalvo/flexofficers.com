import { UserRole } from "@/app/generated/prisma/enums";
import {
  AccountSettingsContent,
  COMPANY_PRIVACY_ITEMS,
} from "@/components/settings/account-settings-content";
import { PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function CompanySettingsPage() {
  await requirePageRole(UserRole.COMPANY);

  return (
    <PageShell nav="company" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Settings"
        subtitle="Manage your account preferences and security."
      />

      <div className="mt-8">
        <AccountSettingsContent
          privacyItems={COMPANY_PRIVACY_ITEMS}
          deleteDescription="This action will permanently delete your account and all associated data, including your company profile, shifts, and applicant records. This action cannot be undone."
        />
      </div>
    </PageShell>
  );
}
