import type { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
  StatCard,
} from "@/components/ui";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { RecommendedShiftCard } from "@/components/dashboard/recommended-shift-card";
import { rankRecommendedShifts } from "@/lib/recommended-shifts";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";

type OfficerDashboardProps = {
  firstName?: string | null;
  officer: {
    id: string;
    phone?: string | null;
    armedStatuses: ArmedStatus[];
    experienceCategories: string[];
    experienceYears?: number | null;
    licenseExpirationDate?: Date | null;
  } | null;
};

export default async function OfficerDashboard({
  firstName,
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
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-fo-primary-hover">
            Officer Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="max-w-2xl text-base text-fo-text-muted">
            Browse real company shifts, track applications, and keep your profile
            ready for hiring managers.
          </p>
        </div>

        <ProfileCompletionCard officer={officer} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            className="fo-glass-card"
            label="Applications"
            value={applicationsCount}
            hint="Shifts you've applied to"
          />
          <StatCard
            className="fo-glass-card"
            label="Accepted Shifts"
            value={acceptedCount}
            hint="Assignments you've won"
          />
          <StatCard
            className="fo-glass-card"
            label="Upcoming Shifts"
            value={upcomingCount}
            hint="Accepted shifts starting soon"
          />
          <StatCard
            className="fo-glass-card"
            label="Available Shifts"
            value={availableShiftsCount}
            hint="Open shifts posted by companies"
          />
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-fo-text sm:text-2xl">
                Recommended Shifts
              </h2>
              <p className="mt-1 text-sm text-fo-text-muted">
                Real open shifts from companies on FlexOfficers, ranked by fit,
                rate, and start date.
              </p>
            </div>
            <Link
              href="/shifts"
              className={buttonClassName({ variant: "secondary", size: "md" })}
            >
              Browse All Shifts
            </Link>
          </div>

          {recommendedShifts.length === 0 ? (
            <Card variant="muted" className="fo-glass-card text-center">
              <p className="text-lg font-medium text-fo-text">
                No open shifts available right now.
              </p>
              <p className="mt-2 text-sm text-fo-text-muted">
                Check back soon as companies post new security assignments.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
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
      </div>
    </PageShell>
  );
}
