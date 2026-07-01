"use client";

import Link from "next/link";
import { CancelAssignmentButton } from "@/app/officer/CancelAssignmentButton";
import { ApplicationStatus, type ArmedStatus } from "@/app/generated/prisma/enums";
import ApplyButton from "@/app/shifts/ApplyButton";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { OfficerProfileApplyNotice } from "@/components/officer/officer-profile-apply-notice";
import { buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

type ShiftDetailActionsProps = {
  shiftId: string;
  companyId: string;
  hasPublicProfile: boolean;
  canApply: boolean;
  profileIncomplete?: boolean;
  officer?: {
    phone?: string | null;
    armedStatuses?: ArmedStatus[];
    experienceCategories?: string[];
    experienceYears?: number | null;
    licenses?: Array<{
      id: string;
      licenseType: string;
      licenseNumber: string;
      issuingState: string;
      expirationDate: Date;
    }>;
  } | null;
  applicationStatus: ApplicationStatus | null;
  applicationId?: string | null;
  canCancelAssignment?: boolean;
  isSignedIn: boolean;
  shiftAcceptingApplications: boolean;
  layout?: "default" | "mobile";
};

function actionButtonClassName(
  variant: "primary" | "secondary" = "primary",
  mobile = false
) {
  return buttonClassName({
    size: "md",
    fullWidth: true,
    variant,
    className: cn("flex-1", mobile && "min-h-12 rounded-xl text-sm"),
  });
}

export function ShiftDetailActions({
  shiftId,
  companyId,
  hasPublicProfile,
  canApply,
  profileIncomplete = false,
  officer = null,
  applicationStatus,
  applicationId = null,
  canCancelAssignment = false,
  isSignedIn,
  shiftAcceptingApplications,
  layout = "default",
}: ShiftDetailActionsProps) {
  const { t } = useLandingLanguage();
  const actions = t.shiftDetail.actions;
  const mobile = layout === "mobile";
  const hasPendingApplication = applicationStatus === ApplicationStatus.PENDING;
  const hasAcceptedApplication = applicationStatus === ApplicationStatus.ACCEPTED;

  const applyControl = canApply ? (
    <ApplyButton
      shiftId={shiftId}
      initialHasApplied={hasPendingApplication || hasAcceptedApplication}
      className={cn("flex-1", mobile && "!min-h-12 rounded-xl text-sm")}
    />
  ) : hasAcceptedApplication ? (
    <button type="button" disabled className={actionButtonClassName("primary", mobile)}>
      {actions.applicationAccepted}
    </button>
  ) : hasPendingApplication ? (
    <button type="button" disabled className={actionButtonClassName("primary", mobile)}>
      {actions.applicationPending}
    </button>
  ) : profileIncomplete ? (
    <Link href="/officer/profile" className={actionButtonClassName("primary", mobile)}>
      {actions.completeProfileToApply}
    </Link>
  ) : !isSignedIn && shiftAcceptingApplications ? (
    <Link href="/sign-in" className={actionButtonClassName("primary", mobile)}>
      {actions.signInToApply}
    </Link>
  ) : (
    <button type="button" disabled className={actionButtonClassName("primary", mobile)}>
      {shiftAcceptingApplications ? actions.apply : actions.notAccepting}
    </button>
  );

  const companyControl = hasPublicProfile ? (
    <Link
      href={`/companies/${companyId}`}
      className={cn(
        actionButtonClassName("secondary", mobile),
        mobile &&
          "border-white/15 bg-transparent text-fo-text hover:bg-white/[0.04]"
      )}
    >
      {actions.viewCompanyProfile}
    </Link>
  ) : (
    <button
      type="button"
      disabled
      title={t.shiftDetail.company.noPublicProfile}
      className={cn(
        actionButtonClassName("secondary", mobile),
        mobile &&
          "border-white/15 bg-transparent text-fo-text hover:bg-white/[0.04]"
      )}
    >
      {actions.viewCompanyProfile}
    </button>
  );

  if (mobile) {
    return (
      <div className="flex flex-col gap-2 pb-4">
        {profileIncomplete ? (
          <OfficerProfileApplyNotice officer={officer} compact />
        ) : null}
        {applyControl}
        {companyControl}
        {canCancelAssignment && applicationId ? (
          <CancelAssignmentButton
            applicationId={applicationId}
            className="min-h-12 rounded-xl text-sm"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {profileIncomplete ? (
        <OfficerProfileApplyNotice officer={officer} />
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-stretch">
        {companyControl}
        {applyControl}
      </div>
    </div>
  );
}
