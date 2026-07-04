import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  ApplicationStatus,
  ShiftStatus,
  ShiftVisibility,
  UserRole,
} from "@/app/generated/prisma/enums";
import { ShiftDetailDesktop } from "@/components/shifts/shift-detail-desktop";
import { PageShell } from "@/components/ui";
import {
  formatDisplayPhone,
  companyHasPublicProfile,
  formatTitleCase,
  sanitizeDisplayValue,
} from "@/lib/company-profile-page-data";
import {
  formatEstimatedShiftPay,
  formatShiftCityState,
} from "@/lib/format-shift";
import { prisma } from "@/lib/prisma";
import {
  fromShiftArmedRequirement,
  fromShiftTimeType,
  fromShiftWorkType,
} from "@/lib/shift-form-options";
import { getShiftRequirementChips } from "@/lib/shift-requirements";
import { stripCompanyProfileMeta } from "@/lib/company-profile-meta";
import { officerProfileCompletionSelect } from "@/lib/officer-fields";
import { applicationIdOnlySelect, applicationIdStatusSelect } from "@/lib/application-fields";
import { isOfficerProfileComplete } from "@/lib/officer-profile-completion";
import { isAcceptedShiftPastOrClosed } from "@/lib/officer-application-delete";
import { buildShiftJobPostingJsonLd } from "@/lib/shift-job-posting-json-ld";
import { getShiftStaffingMetrics } from "@/lib/shift-fill-status";
import { ShiftDetailMobile } from "./ShiftDetailMobile";

export const dynamic = "force-dynamic";

export default async function ShiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clerkUser = await currentUser();

  const [shift, user] = await Promise.all([
    prisma.shift.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        companyId: true,
        title: true,
        description: true,
        location: true,
        city: true,
        state: true,
        hourlyRate: true,
        startTime: true,
        endTime: true,
        workType: true,
        shiftTimeType: true,
        armedRequirement: true,
        requirements: true,
        otherRequirements: true,
        specialRequirements: true,
        reportingInstructions: true,
        positionsNeeded: true,
        status: true,
        visibility: true,
        createdAt: true,
        applications: {
          where: {
            status: ApplicationStatus.ACCEPTED,
          },
          select: applicationIdOnlySelect,
        },
        company: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            phone: true,
            email: true,
            website: true,
            address: true,
            city: true,
            state: true,
            description: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    }),
    clerkUser
      ? prisma.user.findUnique({
          where: { clerkId: clerkUser.id },
          select: {
            role: true,
            officer: {
              select: {
                id: true,
                ...officerProfileCompletionSelect,
                applications: {
                  where: {
                    shiftId: id,
                  },
                  select: {
                    ...applicationIdStatusSelect,
                    clockInAt: true,
                    clockOutAt: true,
                  },
                  take: 1,
                },
              },
            },
          },
        })
      : Promise.resolve(null),
  ]);

  // The only reason this page 404s is a shift row that does not exist. The
  // detail page is intentionally viewable for EVERY shift status (open, filled,
  // completed, cancelled) and for every viewer (signed-out, the officer who
  // owns/has an application, and the company that owns the shift). Do not add a
  // status/visibility/ownership guard here — completed and cancelled shifts must
  // still open so officers and companies can review finished/cancelled work.
  if (!shift) {
    notFound();
  }

  const { remainingOpen: openPositions, displayStatus } = getShiftStaffingMetrics({
    storedStatus: shift.status,
    acceptedCount: shift.applications.length,
    positionsNeeded: shift.positionsNeeded,
  });
  const officerApplication = user?.officer?.applications[0] ?? null;
  const applicationId = officerApplication?.id ?? null;
  const applicationStatus = officerApplication?.status ?? null;
  const isAcceptedOfficer = applicationStatus === ApplicationStatus.ACCEPTED;
  // Once the officer clocks in (on the shift) or clocks out (completed), the
  // assignment can no longer be cancelled from the shift detail page.
  const officerClockedIn = Boolean(officerApplication?.clockInAt);
  const officerCompletedShift = Boolean(officerApplication?.clockOutAt);
  const canCancelAssignment =
    isAcceptedOfficer &&
    applicationId !== null &&
    !officerClockedIn &&
    !officerCompletedShift &&
    !isAcceptedShiftPastOrClosed(displayStatus, shift.endTime);
  const hasBlockingApplication =
    applicationStatus === ApplicationStatus.PENDING ||
    applicationStatus === ApplicationStatus.ACCEPTED;
  const shiftAcceptingApplications = displayStatus === ShiftStatus.OPEN;
  const officerWouldApply =
    user?.role === UserRole.OFFICER &&
    shiftAcceptingApplications &&
    !hasBlockingApplication;
  const profileComplete = isOfficerProfileComplete(user?.officer ?? null);
  const profileIncomplete = officerWouldApply && !profileComplete;
  const canApply = officerWouldApply && profileComplete;
  const requirementChips = getShiftRequirementChips(shift, 20);
  const locationLabel = formatShiftCityState(shift);
  const estimatedPay = formatEstimatedShiftPay(
    shift.hourlyRate,
    shift.startTime,
    shift.endTime
  );
  const workTypeLabel = fromShiftWorkType(shift.workType);
  const shiftTimeLabel = fromShiftTimeType(shift.shiftTimeType);
  const armedLabel = fromShiftArmedRequirement(shift.armedRequirement);
  const displayCompanyName =
    formatTitleCase(shift.company.companyName) ?? shift.company.companyName;
  const companyDescription = stripCompanyProfileMeta(shift.company.description);
  const hasPublicProfile = companyHasPublicProfile({
    companyName: shift.company.companyName,
    description: companyDescription,
    city: shift.company.city,
    state: shift.company.state,
    website: shift.company.website,
  });
  // Company contact information is only released to officers with an ACCEPTED
  // application for this shift. Gating happens here on the server so the
  // sensitive values are never sent to the browser for other viewers.
  const companyContactEmail = isAcceptedOfficer
    ? sanitizeDisplayValue(shift.company.email) ||
      sanitizeDisplayValue(shift.company.user.email)
    : null;
  const companyContactPhone = isAcceptedOfficer
    ? formatDisplayPhone(shift.company.phone)
    : null;
  const companyContactName = isAcceptedOfficer
    ? sanitizeDisplayValue(shift.company.contactName)
    : null;
  const companyContactWebsite = isAcceptedOfficer
    ? sanitizeDisplayValue(shift.company.website)
    : null;
  const companyContactAddress = isAcceptedOfficer
    ? sanitizeDisplayValue(shift.company.address)
    : null;
  const companyContactLocationLabel = isAcceptedOfficer
    ? formatShiftCityState({
        city: shift.company.city,
        state: shift.company.state,
        location: "",
      }) || null
    : null;
  const companyContactDescription = isAcceptedOfficer
    ? companyDescription
    : null;
  const jobPostingJsonLd =
    shift.visibility === ShiftVisibility.PUBLIC
      ? buildShiftJobPostingJsonLd({
          title: shift.title,
          description: shift.description,
          createdAt: shift.createdAt,
          startTime: shift.startTime,
          hourlyRate: Number(shift.hourlyRate),
          companyName: shift.company.companyName,
          city: shift.city,
          state: shift.state,
          companyCity: shift.company.city,
          companyState: shift.company.state,
        })
      : null;

  return (
    <PageShell nav="officer" maxWidth="lg" sidebar contentClassName="!pt-2 md:!py-3">
      {jobPostingJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingJsonLd),
          }}
        />
      ) : null}
      <ShiftDetailMobile
        shift={{
          id: shift.id,
          companyId: shift.companyId,
          title: shift.title,
          description: shift.description,
          location: shift.location,
          hourlyRate: Number(shift.hourlyRate),
          startTime: shift.startTime,
          endTime: shift.endTime,
          positionsNeeded: shift.positionsNeeded,
          status: displayStatus,
          requirements: shift.requirements,
          otherRequirements: shift.otherRequirements,
          specialRequirements: shift.specialRequirements,
          reportingInstructions: shift.reportingInstructions,
        }}
        company={{
          companyName: shift.company.companyName,
          description: companyDescription,
        }}
        displayCompanyName={displayCompanyName}
        hasPublicProfile={hasPublicProfile}
        openPositions={openPositions}
        locationLabel={locationLabel}
        estimatedPay={estimatedPay}
        workTypeLabel={workTypeLabel}
        shiftTimeLabel={shiftTimeLabel}
        armedLabel={armedLabel}
        canApply={canApply}
        profileIncomplete={profileIncomplete}
        officer={user?.officer ?? null}
        applicationStatus={applicationStatus}
        applicationId={applicationId}
        canCancelAssignment={canCancelAssignment}
        isSignedIn={Boolean(clerkUser)}
        shiftAcceptingApplications={shiftAcceptingApplications}
        isAcceptedOfficer={isAcceptedOfficer}
        companyContactName={companyContactName}
        companyContactPhone={companyContactPhone}
        companyContactEmail={companyContactEmail}
        companyContactWebsite={companyContactWebsite}
        companyContactAddress={companyContactAddress}
        companyContactLocationLabel={companyContactLocationLabel}
        companyContactDescription={companyContactDescription}
      />

      <ShiftDetailDesktop
        shift={{
          id: shift.id,
          companyId: shift.companyId,
          title: shift.title,
          description: shift.description,
          location: shift.location,
          hourlyRate: Number(shift.hourlyRate),
          startTime: shift.startTime,
          endTime: shift.endTime,
          positionsNeeded: shift.positionsNeeded,
          status: displayStatus,
          specialRequirements: shift.specialRequirements,
          reportingInstructions: shift.reportingInstructions,
        }}
        displayCompanyName={displayCompanyName}
        hasPublicProfile={hasPublicProfile}
        openPositions={openPositions}
        locationLabel={locationLabel}
        estimatedPay={estimatedPay}
        workTypeLabel={workTypeLabel}
        shiftTimeLabel={shiftTimeLabel}
        armedLabel={armedLabel}
        requirementChips={requirementChips}
        isAcceptedOfficer={isAcceptedOfficer}
        companyContactName={companyContactName}
        companyContactPhone={companyContactPhone}
        companyContactEmail={companyContactEmail}
        companyContactWebsite={companyContactWebsite}
        companyContactAddress={companyContactAddress}
        companyContactLocationLabel={companyContactLocationLabel}
        companyContactDescription={companyContactDescription}
        canApply={canApply}
        profileIncomplete={profileIncomplete}
        officer={user?.officer ?? null}
        applicationStatus={applicationStatus}
        isSignedIn={Boolean(clerkUser)}
        shiftAcceptingApplications={shiftAcceptingApplications}
      />
    </PageShell>
  );
}
