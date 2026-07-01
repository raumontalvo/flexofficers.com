import type { ArmedStatus } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebarWidgets } from "@/components/dashboard/dashboard-sidebar-widgets";
import { OfficerDashboardStats } from "@/components/dashboard/officer-dashboard-stats";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { QuickActionsRow } from "@/components/dashboard/quick-actions-row";
import { RecommendedNextStepsCard } from "@/components/dashboard/recommended-next-steps-card";
import { prisma } from "@/lib/prisma";
import { buildOfficerBrowseShiftsWhere } from "@/lib/company-staff";
import { ApplicationStatus } from "@/app/generated/prisma/enums";

type OfficerDashboardProps = {
  firstName?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  officer: {
    id: string;
    phone?: string | null;
    armedStatuses: ArmedStatus[];
    experienceCategories: string[];
    experienceYears?: number | null;
    licenses?: Array<{
      id: string;
      licenseType: string;
      licenseNumber: string;
      issuingState: string;
      expirationDate: Date;
    }>;
  } | null;
};

export default async function OfficerDashboard({
  firstName,
  fullName,
  imageUrl,
  officer,
}: OfficerDashboardProps) {
  const officerId = officer?.id ?? null;
  const now = new Date();

  const [
    applicationsCount,
    acceptedCount,
    upcomingCount,
    availableShiftsCount,
  ] = await Promise.all([
    officerId
      ? prisma.application.count({
          where: { officerId },
        })
      : Promise.resolve(0),
    officerId
      ? prisma.application.count({
          where: {
            officerId,
            status: ApplicationStatus.ACCEPTED,
          },
        })
      : Promise.resolve(0),
    officerId
      ? prisma.application.count({
          where: {
            officerId,
            status: ApplicationStatus.ACCEPTED,
            shift: {
              startTime: {
                gte: now,
              },
            },
          },
        })
      : Promise.resolve(0),
    prisma.shift.count({
      where: buildOfficerBrowseShiftsWhere(officerId),
    }),
  ]);

  return (
    <PageShell nav="officer" maxWidth="full" sidebar>
      <div className="space-y-5 pb-3 md:space-y-4 md:pb-0">
        <DashboardHeader
          firstName={firstName}
          fullName={fullName}
          imageUrl={imageUrl}
        />

        <div className="grid gap-5 md:gap-3 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <OfficerDashboardStats
            applicationsCount={applicationsCount}
            acceptedCount={acceptedCount}
            upcomingCount={upcomingCount}
            availableShiftsCount={availableShiftsCount}
          />

          <ProfileCompletionCard officer={officer} compact />
        </div>

        <RecommendedNextStepsCard officer={officer} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-5">
          <div className="min-w-0">
            <QuickActionsRow />
          </div>

          <aside className="min-w-0 xl:sticky xl:top-4 xl:self-start">
            <DashboardSidebarWidgets upcomingCount={upcomingCount} />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
