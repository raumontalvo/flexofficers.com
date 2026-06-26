import Link from "next/link";
import {
  ApplicationStatus,
  ShiftStatus,
} from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  CardDescription,
  CardTitle,
  PageShell,
  SectionHeading,
  StatCard,
} from "@/components/ui";
import { prisma } from "@/lib/prisma";
import DashboardSignOutButton from "./SignOutButton";

type OfficerDashboardProps = {
  firstName?: string | null;
  officerId?: string | null;
  missingItems: string[];
};

function QuickActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full transition hover:border-fo-border-strong hover:bg-fo-surface-hover">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </Card>
    </Link>
  );
}

export default async function OfficerDashboard({
  firstName,
  officerId,
  missingItems,
}: OfficerDashboardProps) {
  const [applicationsCount, acceptedCount, availableShiftsCount] =
    await Promise.all([
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
      prisma.shift.count({
        where: {
          status: ShiftStatus.OPEN,
        },
      }),
    ]);

  return (
    <PageShell nav="officer" maxWidth="2xl">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          title={`Welcome${firstName ? `, ${firstName}` : ""}`}
          subtitle="Your home for browsing shifts, tracking applications, and getting hired."
          className="flex-1"
        />
        <DashboardSignOutButton />
      </div>

      <div className="mt-8 space-y-4">
        {missingItems.length > 0 ? (
          <Card className="border-yellow-500/20 bg-fo-pending-bg">
            <CardTitle className="text-lg text-fo-pending">
              Complete your profile
            </CardTitle>
            <CardDescription className="mt-2 text-fo-text">
              Finish these items so companies can review you:
            </CardDescription>
            <ul className="mt-4 space-y-2 text-sm text-fo-text">
              {missingItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fo-pending" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/officer/profile"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "mt-5 border-yellow-500/30 text-fo-pending hover:bg-yellow-500/10",
              })}
            >
              Complete Profile
            </Link>
          </Card>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Applications"
            value={applicationsCount}
            hint="Shifts you've applied to"
          />
          <StatCard
            label="Accepted Shifts"
            value={acceptedCount}
            hint="Assignments you've won"
          />
          <StatCard
            label="Available Shifts"
            value={availableShiftsCount}
            hint="Open shifts to browse now"
          />
        </div>

        <Link
          href="/shifts"
          className={buttonClassName({ fullWidth: true, className: "w-full" })}
        >
          Browse Available Shifts
        </Link>

        <div>
          <h2 className="text-lg font-semibold text-fo-text">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <QuickActionCard
              href="/officer/applications"
              title="My Shifts"
              description="Track pending, accepted, and withdrawn applications."
            />
            <QuickActionCard
              href="/officer/accepted-shifts"
              title="Accepted Shifts"
              description="View company contact details for accepted assignments."
            />
            <QuickActionCard
              href="/officer/profile"
              title="Officer Profile"
              description="Update your experience, availability, and introduction."
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
