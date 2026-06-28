"use client";

import Link from "next/link";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import ApplyButton from "@/app/shifts/ApplyButton";
import { buttonClassName } from "@/components/ui";

type ShiftDetailActionsProps = {
  shiftId: string;
  companyId: string;
  hasPublicProfile: boolean;
  canApply: boolean;
  applicationStatus: ApplicationStatus | null;
  isSignedIn: boolean;
  shiftAcceptingApplications: boolean;
};

function actionButtonClassName(variant: "primary" | "secondary" = "primary") {
  return buttonClassName({
    size: "md",
    fullWidth: true,
    variant,
    className: "flex-1",
  });
}

export function ShiftDetailActions({
  shiftId,
  companyId,
  hasPublicProfile,
  canApply,
  applicationStatus,
  isSignedIn,
  shiftAcceptingApplications,
}: ShiftDetailActionsProps) {
  const hasPendingApplication = applicationStatus === ApplicationStatus.PENDING;
  const hasAcceptedApplication = applicationStatus === ApplicationStatus.ACCEPTED;

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-stretch">
      {hasPublicProfile ? (
        <Link
          href={`/companies/${companyId}`}
          className={actionButtonClassName("secondary")}
        >
          View Company Profile
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="This company has not published a public profile yet."
          className={actionButtonClassName("secondary")}
        >
          View Company Profile
        </button>
      )}

      {canApply ? (
        <ApplyButton
          shiftId={shiftId}
          initialHasApplied={hasPendingApplication || hasAcceptedApplication}
          className="flex-1"
        />
      ) : hasAcceptedApplication ? (
        <button
          type="button"
          disabled
          className={actionButtonClassName()}
        >
          Application Accepted
        </button>
      ) : hasPendingApplication ? (
        <button
          type="button"
          disabled
          className={actionButtonClassName()}
        >
          Application Pending
        </button>
      ) : !isSignedIn && shiftAcceptingApplications ? (
        <Link href="/sign-in" className={actionButtonClassName()}>
          Sign in to apply
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={actionButtonClassName()}
        >
          {shiftAcceptingApplications
            ? "Apply to Shift"
            : "Not accepting applications"}
        </button>
      )}
    </div>
  );
}
