"use client";

import { StatCard, MobileStatGrid } from "@/components/ui";
import {
  AcceptedIcon,
  BrowseIcon,
  ShiftsIcon,
  UpcomingIcon,
} from "@/components/nav/icons";
import { useLandingLanguage } from "@/components/landing/landing-language-context";

type OfficerDashboardStatsProps = {
  applicationsCount: number;
  acceptedCount: number;
  upcomingCount: number;
  availableShiftsCount: number;
};

export function OfficerDashboardStats({
  applicationsCount,
  acceptedCount,
  upcomingCount,
  availableShiftsCount,
}: OfficerDashboardStatsProps) {
  const { t } = useLandingLanguage();
  const copy = t.dashboard.officer;

  return (
    <MobileStatGrid desktopColumns={4} className="gap-5 md:gap-3">
      <StatCard
        label={copy.statApplications}
        value={applicationsCount}
        hint={copy.statApplicationsHint}
        tone="purple"
        icon={<ShiftsIcon className="h-5 w-5 md:h-4 md:w-4" />}
      />
      <StatCard
        label={copy.statAccepted}
        value={acceptedCount}
        hint={copy.statAcceptedHint}
        tone="green"
        icon={<AcceptedIcon className="h-5 w-5 md:h-4 md:w-4" />}
      />
      <StatCard
        label={copy.statUpcoming}
        value={upcomingCount}
        hint={copy.statUpcomingHint}
        tone="blue"
        icon={<UpcomingIcon className="h-5 w-5 md:h-4 md:w-4" />}
      />
      <StatCard
        label={copy.statAvailable}
        value={availableShiftsCount}
        hint={copy.statAvailableHint}
        tone="amber"
        icon={<BrowseIcon className="h-5 w-5 md:h-4 md:w-4" />}
      />
    </MobileStatGrid>
  );
}
