import type { ArmedStatus } from "@/app/generated/prisma/enums";
import { PageShell, StatCard, MobileStatGrid } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebarWidgets } from "@/components/dashboard/dashboard-sidebar-widgets";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { QuickActionsRow } from "@/components/dashboard/quick-actions-row";
import { RecommendedNextStepsCard } from "@/components/dashboard/recommended-next-steps-card";
import {
  AcceptedIcon,
  BrowseIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
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
          <MobileStatGrid desktopColumns={4} className="gap-5 md:gap-3">
            <StatCard
              label="Applications"
              value={applicationsCount}
              hint="Shifts you've applied to"
              tone="purple"
              showChevron
              icon={<ShiftsIcon className="h-5 w-5 md:h-4 md:w-4" />}
            />
            <StatCard
              label="Accepted Shifts"
              value={acceptedCount}
              hint="Assignments you've won"
              tone="green"
              showChevron
              icon={<AcceptedIcon className="h-5 w-5 md:h-4 md:w-4" />}
            />
            <StatCard
              label="Upcoming Shifts"
              value={upcomingCount}
              hint="Accepted shifts starting soon"
              tone="blue"
              showChevron
              icon={<UpcomingIcon className="h-5 w-5 md:h-4 md:w-4" />}
            />
            <StatCard
              label="Available Shifts"
              value={availableShiftsCount}
              hint="Open shifts posted by companies"
              tone="amber"
              showChevron
              icon={<BrowseIcon className="h-5 w-5 md:h-4 md:w-4" />}
            />
          </MobileStatGrid>

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
