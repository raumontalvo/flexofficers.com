import Link from "next/link";
import type { ApplicationStatus } from "@/app/generated/prisma/enums";
import { getApplicationDisplayStatus } from "@/lib/company-dashboard-data";
import { Card, StatusBadge } from "@/components/ui";
import type { StatusBadgeVariant } from "@/components/ui";

export type SerializedRecentApplication = {
  id: string;
  officerName: string;
  officerType: string;
  status: ApplicationStatus;
  shiftTitle: string;
};

function applicationBadgeVariant(
  status: ReturnType<typeof getApplicationDisplayStatus>
): StatusBadgeVariant {
  switch (status) {
    case "NEW":
      return "info";
    case "ACCEPTED":
      return "success";
    case "REJECTED":
      return "rejected";
    case "WITHDRAWN":
      return "neutral";
    case "REVIEWED":
    default:
      return "pending";
  }
}

type CompanyRecentApplicationsProps = {
  applications: SerializedRecentApplication[];
};

export function CompanyRecentApplications({
  applications,
}: CompanyRecentApplicationsProps) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className="fo-glass-card h-full border border-white/10 p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-fo-text">Recent Applications</h2>
        <Link
          href="/company/applications"
          className="text-xs font-semibold text-fo-primary-hover hover:underline"
        >
          View All Applications
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {applications.length === 0 ? (
          <p className="text-sm text-fo-text-muted">
            Recent applicants will appear here once officers apply.
          </p>
        ) : (
          applications.map((application) => {
            const displayStatus = getApplicationDisplayStatus(application.status);

            return (
              <div
                key={application.id}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-fo-text">
                      {application.officerName}
                    </p>
                    <p className="mt-0.5 text-xs text-fo-text-muted">
                      {application.officerType}
                    </p>
                    <p className="mt-1 truncate text-xs text-fo-text-subtle">
                      {application.shiftTitle}
                    </p>
                  </div>
                  <StatusBadge variant={applicationBadgeVariant(displayStatus)}>
                    {displayStatus}
                  </StatusBadge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
