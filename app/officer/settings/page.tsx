import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { buttonClassName, Card, CardTitle, PageShell, SectionHeading } from "@/components/ui";
import DashboardSignOutButton from "@/app/dashboard/SignOutButton";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function OfficerSettingsPage() {
  await requirePageRole(UserRole.OFFICER);

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Settings"
        subtitle="Manage account preferences and profile details."
      />

      <div className="mt-8 space-y-4">
        <Card variant="elevated" className="fo-glass-card space-y-4">
          <CardTitle className="text-lg">Profile</CardTitle>
          <p className="text-sm text-fo-text-muted">
            Profile and qualification settings are managed on your officer profile
            page.
          </p>
          <Link
            href="/officer/profile"
            className={buttonClassName({ variant: "primary", size: "md" })}
          >
            Go to My Profile
          </Link>
        </Card>

        <Card variant="elevated" className="fo-glass-card space-y-4">
          <CardTitle className="text-lg">Account</CardTitle>
          <p className="text-sm text-fo-text-muted">
            Sign out of your FlexOfficers account on this device.
          </p>
          <DashboardSignOutButton />
        </Card>
      </div>
    </PageShell>
  );
}
