import type { Prisma } from "@/app/generated/prisma/client";
import { companyDashboardSelect } from "@/lib/officer-fields";
import { PageShell } from "@/components/ui";
import { CompanyApplicationsDonut } from "@/components/dashboard/company-applications-donut";
import { CompanyDashboardHeader } from "@/components/dashboard/company-dashboard-header";
import { CompanyProfileCompletionBanner } from "@/components/dashboard/company-profile-completion-banner";
import type { CompanyProfileCompletion } from "@/lib/company-profile-completion";
import { CompanyQuickActions } from "@/components/dashboard/company-quick-actions";
import { CompanyRecentApplications } from "@/components/dashboard/company-recent-applications";
import { CompanySummaryCards } from "@/components/dashboard/company-summary-cards";
import { CompanyUpcomingShifts } from "@/components/dashboard/company-upcoming-shifts";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { canCompanyPostNewShifts } from "@/lib/company-access";
import {
  getCompanyApplicationStats,
  getCompanyApplicationsSummary,
  getCompanyShiftStats,
  getFilledShiftsThisMonth,
  getNextUpcomingConfirmedShifts,
  getUpcomingConfirmedShifts,
} from "@/lib/company-dashboard-data";
import { formatArmedStatuses } from "@/lib/profile-options";
import { prisma } from "@/lib/prisma";

type CompanyDashboardProps = {
  firstName?: string | null;
  logoUrl?: string | null;
  company: Prisma.CompanyGetPayload<{ select: typeof companyDashboardSelect }>;
  profileCompletion: CompanyProfileCompletion;
};

export default async function CompanyDashboard({
  firstName,
  logoUrl,
  company,
  profileCompletion,
}: CompanyDashboardProps) {
  const canPostShifts = canCompanyPostNewShifts(company);
  const displayName = profileCompletion.isComplete
    ? company.companyName.trim()
    : company.companyName?.trim() || firstName?.trim() || "there";
  const now = new Date();

  const [shifts, applications, invitedCount, unreadNotificationCount] =
    await Promise.all([
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
    prisma.notification.count({
      where: {
        userId: company.userId,
        read: false,
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
  const nextUpcomingShifts = getNextUpcomingConfirmedShifts(shifts, now, 2);

  function serializeUpcomingShift(
    shift: (typeof shifts)[number]
  ) {
    return {
      id: shift.id,
      title: shift.title,
      startTime: shift.startTime.toISOString(),
      endTime: shift.endTime.toISOString(),
      city: shift.city,
      state: shift.state,
      location: shift.location,
      openPositions: Math.max(
        shift.positionsNeeded -
          shift.applications.filter(
            (application) => application.status === ApplicationStatus.ACCEPTED
          ).length,
        0
      ),
    };
  }

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <div className="space-y-5 pb-3 lg:pb-0">
        {!profileCompletion.isComplete ? (
          <CompanyProfileCompletionBanner
            completionPercent={profileCompletion.completionPercent}
            missingItems={profileCompletion.missingItems}
          />
        ) : null}

        <CompanyDashboardHeader
          displayName={displayName}
          logoUrl={logoUrl}
          canPostShifts={canPostShifts}
          unreadNotificationCount={unreadNotificationCount}
        />

        <CompanySummaryCards
          shiftStats={shiftStats}
          applicationStats={applicationStats}
          applicationsSummary={applicationsSummary}
          filledThisMonth={filledThisMonth}
          upcomingConfirmedCount={upcomingShifts.length}
        />

        <CompanyUpcomingShifts
          shifts={upcomingShifts.map(serializeUpcomingShift)}
          mobileShifts={nextUpcomingShifts.map(serializeUpcomingShift)}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <CompanyApplicationsDonut
            pendingCount={applicationsSummary.pending}
            invitedCount={applicationsSummary.invited}
            acceptedCount={applicationsSummary.accepted}
          />
          <CompanyQuickActions canPostShifts={canPostShifts} />
          <div className="hidden lg:block">
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
      </div>
    </PageShell>
  );
}
