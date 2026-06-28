import type { Prisma } from "@/app/generated/prisma/client";
import { companyDashboardSelect } from "@/lib/officer-fields";
import { PageShell } from "@/components/ui";
import { CompanyApplicationsDonut } from "@/components/dashboard/company-applications-donut";
import { CompanyDashboardHeader } from "@/components/dashboard/company-dashboard-header";
import { CompanyProfileCompletionBanner } from "@/components/dashboard/company-profile-completion-banner";
import type { CompanyProfileCompletion } from "@/lib/company-profile-completion";
import { CompanyQuickActions } from "@/components/dashboard/company-quick-actions";
import { CompanyRecentApplications } from "@/components/dashboard/company-recent-applications";
import { CompanyShiftsTable } from "@/components/dashboard/company-shifts-table";
import { CompanySummaryCards } from "@/components/dashboard/company-summary-cards";
import { CompanyUpcomingShifts } from "@/components/dashboard/company-upcoming-shifts";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { canCompanyPostNewShifts } from "@/lib/company-access";
import {
  getCompanyApplicationStats,
  getCompanyApplicationsSummary,
  getCompanyShiftStats,
  getFilledShiftsThisMonth,
  getUpcomingConfirmedShifts,
  serializeCompanyDashboardShift,
} from "@/lib/company-dashboard-data";
import { formatArmedStatuses } from "@/lib/profile-options";
import { prisma } from "@/lib/prisma";

type CompanyDashboardProps = {
  firstName?: string | null;
  company: Prisma.CompanyGetPayload<{ select: typeof companyDashboardSelect }>;
  profileCompletion: CompanyProfileCompletion;
};

export default async function CompanyDashboard({
  firstName,
  company,
  profileCompletion,
}: CompanyDashboardProps) {
  const canPostShifts = canCompanyPostNewShifts(company);
  const displayName = profileCompletion.isComplete
    ? company.companyName.trim()
    : company.companyName?.trim() || firstName?.trim() || "there";
  const now = new Date();

  const [shifts, applications, invitedCount] = await Promise.all([
    prisma.shift.findMany({
      where: {
        companyId: company.id,
      },
      select: {
        id: true,
        title: true,
        location: true,
        city: true,
        state: true,
        startTime: true,
        endTime: true,
        status: true,
        positionsNeeded: true,
        applications: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.application.findMany({
      where: {
        shift: {
          companyId: company.id,
        },
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        shift: {
          select: {
            title: true,
          },
        },
        officer: {
          select: {
            firstName: true,
            lastName: true,
            armedStatuses: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
      take: 20,
    }),
    prisma.shiftInvite.count({
      where: {
        status: "PENDING",
        shift: {
          companyId: company.id,
        },
      },
    }),
  ]);

  const shiftStats = getCompanyShiftStats(shifts, now);
  const applicationStats = getCompanyApplicationStats(applications);
  const applicationsSummary = getCompanyApplicationsSummary({
    applications,
    invitedCount,
  });
  const filledThisMonth = getFilledShiftsThisMonth(shifts, now);
  const upcomingShifts = getUpcomingConfirmedShifts(shifts, now);
  const serializedShifts = shifts.map(serializeCompanyDashboardShift);

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <div className="space-y-5">
        {!profileCompletion.isComplete ? (
          <CompanyProfileCompletionBanner
            completionPercent={profileCompletion.completionPercent}
            missingItems={profileCompletion.missingItems}
          />
        ) : null}

        <CompanyDashboardHeader
          displayName={displayName}
          canPostShifts={canPostShifts}
        />

        <CompanySummaryCards
          shiftStats={shiftStats}
          applicationStats={applicationStats}
          applicationsSummary={applicationsSummary}
          filledThisMonth={filledThisMonth}
          upcomingConfirmedCount={upcomingShifts.length}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <CompanyShiftsTable shifts={serializedShifts} />
          <CompanyUpcomingShifts
            shifts={upcomingShifts.map((shift) => ({
              id: shift.id,
              title: shift.title,
              startTime: shift.startTime.toISOString(),
              city: shift.city,
              state: shift.state,
              location: shift.location,
              openPositions: Math.max(
                shift.positionsNeeded -
                  shift.applications.filter(
                    (application) =>
                      application.status === ApplicationStatus.ACCEPTED
                  ).length,
                0
              ),
            }))}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <CompanyApplicationsDonut
            pendingCount={applicationsSummary.pending}
            invitedCount={applicationsSummary.invited}
            acceptedCount={applicationsSummary.accepted}
          />
          <CompanyQuickActions canPostShifts={canPostShifts} />
          <CompanyRecentApplications
            applications={applications.slice(0, 5).map((application) => ({
              id: application.id,
              officerName:
                `${application.officer.firstName} ${application.officer.lastName}`.trim(),
              officerType: formatArmedStatuses(application.officer.armedStatuses),
              status: application.status,
              shiftTitle: application.shift.title,
            }))}
          />
        </div>
      </div>
    </PageShell>
  );
}
