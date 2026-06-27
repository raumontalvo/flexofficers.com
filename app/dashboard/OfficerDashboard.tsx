import type { ArmedStatus } from "@/app/generated/prisma/enums";
import { PageShell, StatCard } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebarWidgets } from "@/components/dashboard/dashboard-sidebar-widgets";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { QuickActionsRow } from "@/components/dashboard/quick-actions-row";
import { RecommendedNextStepsCard } from "@/components/dashboard/recommended-next-steps-card";
import {
  EmptyShiftsCard,
  RecommendedShiftCard,
} from "@/components/dashboard/recommended-shift-card";
import {
  AcceptedIcon,
  BrowseIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { rankRecommendedShifts } from "@/lib/recommended-shifts";
import { prisma } from "@/lib/prisma";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";

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
    openShifts,
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
      where: {
        status: ShiftStatus.OPEN,
        startTime: {
          gte: now,
        },
      },
    }),
    prisma.shift.findMany({
      where: {
        status: ShiftStatus.OPEN,
        startTime: {
          gte: now,
        },
      },
      include: {
        company: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: 20,
    }),
  ]);

  const recommendedShifts = rankRecommendedShifts(
    openShifts,
    officer
      ? {
          armedStatuses: officer.armedStatuses,
          experienceCategories: officer.experienceCategories,
        }
      : null
  );

  return (
    <PageShell nav="officer" maxWidth="full" sidebar>
      <div className="space-y-4">
        <DashboardHeader
          firstName={firstName}
          fullName={fullName}
          imageUrl={imageUrl}
        />

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              label="Applications"
              value={applicationsCount}
              hint="Shifts you've applied to"
              tone="purple"
              icon={<ShiftsIcon className="h-4 w-4" />}
            />
            <StatCard
              label="Accepted Shifts"
              value={acceptedCount}
              hint="Assignments you've won"
              tone="green"
              icon={<AcceptedIcon className="h-4 w-4" />}
            />
            <StatCard
              label="Upcoming Shifts"
              value={upcomingCount}
              hint="Accepted shifts starting soon"
              tone="blue"
              icon={<UpcomingIcon className="h-4 w-4" />}
            />
            <StatCard
              label="Available Shifts"
              value={availableShiftsCount}
              hint="Open shifts posted by companies"
              tone="amber"
              icon={<BrowseIcon className="h-4 w-4" />}
            />
          </div>

          <ProfileCompletionCard officer={officer} compact />
        </div>

        <RecommendedNextStepsCard officer={officer} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-5">
          <div className="min-w-0 space-y-4">
            <section className="space-y-3">
              <div>
                <h2 className="text-base font-bold text-fo-text sm:text-lg">
                  Recommended Shifts
                </h2>
                <p className="mt-0.5 text-xs text-fo-text-muted sm:text-sm">
                  Open shifts ranked by fit, rate, and start date.
                </p>
              </div>

              {recommendedShifts.length === 0 ? (
                <EmptyShiftsCard />
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {recommendedShifts.map((shift) => (
                    <RecommendedShiftCard
                      key={shift.id}
                      id={shift.id}
                      title={shift.title}
                      companyName={shift.company.companyName}
                      location={shift.location}
                      hourlyRate={shift.hourlyRate}
                      startTime={shift.startTime}
                      endTime={shift.endTime}
                      status={shift.status}
                    />
                  ))}
                </div>
              )}
            </section>

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
