import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  ApplicationStatus,
  ShiftStatus,
  ShiftVisibility,
  UserRole,
} from "@/app/generated/prisma/enums";
import { ShiftDetailActions } from "@/components/shifts/shift-detail-actions";
import { ShiftDetailBackLink } from "@/components/shifts/shift-detail-back-link";
import {
  Card,
  PageShell,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import {
  formatDisplayPhone,
  companyHasPublicProfile,
  formatTitleCase,
  sanitizeDisplayValue,
} from "@/lib/company-profile-page-data";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftDateTime,
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
                  select: applicationIdStatusSelect,
                  take: 1,
                },
              },
            },
          },
        })
      : Promise.resolve(null),
  ]);

  if (!shift) {
    notFound();
  }

  const filledCount = shift.applications.length;
  const openPositions = Math.max(shift.positionsNeeded - filledCount, 0);
  const officerApplication = user?.officer?.applications[0] ?? null;
  const applicationId = officerApplication?.id ?? null;
  const applicationStatus = officerApplication?.status ?? null;
  const isAcceptedOfficer = applicationStatus === ApplicationStatus.ACCEPTED;
  const canCancelAssignment =
    isAcceptedOfficer &&
    applicationId !== null &&
    !isAcceptedShiftPastOrClosed(shift.status, shift.endTime);
  const hasBlockingApplication =
    applicationStatus === ApplicationStatus.PENDING ||
    applicationStatus === ApplicationStatus.ACCEPTED;
  const shiftAcceptingApplications = shift.status === ShiftStatus.OPEN;
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
  const companyContactEmail =
    sanitizeDisplayValue(shift.company.email) ||
    sanitizeDisplayValue(shift.company.user.email);
  const companyContactPhone = formatDisplayPhone(shift.company.phone);
  const companyContactName = sanitizeDisplayValue(shift.company.contactName);
  const jobPostingJsonLd =
    shift.visibility === ShiftVisibility.PUBLIC
      ? buildShiftJobPostingJsonLd({
          title: shift.title,
          description: shift.description,
          createdAt: shift.createdAt,
          startTime: shift.startTime,
          hourlyRate: shift.hourlyRate,
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
          hourlyRate: shift.hourlyRate,
          startTime: shift.startTime,
          endTime: shift.endTime,
          positionsNeeded: shift.positionsNeeded,
          status: shift.status,
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
      />

      <div className="hidden md:block">
      <ShiftDetailBackLink />

      <div className="mt-6 space-y-4">
        <Card variant="elevated" className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <ShiftStatusBadge status={shift.status} />
            <StatusBadge variant="info">
              {openPositions} of {shift.positionsNeeded} open
            </StatusBadge>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fo-primary-hover">
              Shift details
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
              {shift.title}
            </h1>

            <p className="text-4xl font-bold text-fo-primary-bright sm:text-5xl">
              {formatHourlyRate(shift.hourlyRate)}
              <span className="ml-1 text-xl font-semibold text-fo-text-muted">
                /hr
              </span>
            </p>

            <p className="text-sm font-medium text-fo-text-muted">
              Estimated pay: {estimatedPay}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Location
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {shift.location}
              </p>
              {locationLabel ? (
                <p className="mt-1 text-sm text-fo-text-muted">{locationLabel}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Positions
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {openPositions} of {shift.positionsNeeded} still open
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Start
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.startTime)}
              </p>
            </div>

            <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                End
              </p>
              <p className="mt-2 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.endTime)}
              </p>
            </div>

            {workTypeLabel ? (
              <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  Work type
                </p>
                <p className="mt-2 text-base font-medium text-fo-text">
                  {workTypeLabel}
                </p>
              </div>
            ) : null}

            {shiftTimeLabel ? (
              <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  Shift time
                </p>
                <p className="mt-2 text-base font-medium text-fo-text">
                  {shiftTimeLabel}
                </p>
              </div>
            ) : null}

            {armedLabel ? (
              <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  Armed requirement
                </p>
                <p className="mt-2 text-base font-medium text-fo-text">
                  {armedLabel}
                </p>
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-fo-text">Description</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text-muted">
            {shift.description?.trim() || "No description provided."}
          </p>
        </Card>

        {requirementChips.length > 0 ? (
          <Card variant="muted" className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">Requirements</h2>
            <ul className="flex flex-wrap gap-2">
              {requirementChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-fo-text"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {shift.specialRequirements?.trim() &&
        requirementChips.length === 0 ? (
          <Card variant="muted" className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">
              Special requirements
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text">
              {shift.specialRequirements}
            </p>
          </Card>
        ) : null}

        {isAcceptedOfficer && shift.reportingInstructions?.trim() ? (
          <Card className="space-y-3">
            <h2 className="text-lg font-semibold text-fo-text">
              Reporting instructions
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text-muted">
              {shift.reportingInstructions}
            </p>
          </Card>
        ) : null}

        <Card className="space-y-3">
          <h2 className="text-lg font-semibold text-fo-text">Company</h2>
          {hasPublicProfile ? (
            <Link
              href={`/companies/${shift.companyId}`}
              className="text-base font-medium text-fo-primary-bright hover:text-fo-primary-hover"
            >
              {displayCompanyName}
            </Link>
          ) : (
            <p className="text-base font-medium text-fo-text">{displayCompanyName}</p>
          )}
          {isAcceptedOfficer ? (
            <dl className="space-y-2 text-sm text-fo-text-muted">
              {companyContactName ? (
                <div>
                  <dt className="font-semibold text-fo-text">Contact</dt>
                  <dd>{companyContactName}</dd>
                </div>
              ) : null}
              {companyContactPhone ? (
                <div>
                  <dt className="font-semibold text-fo-text">Phone</dt>
                  <dd>{companyContactPhone}</dd>
                </div>
              ) : null}
              {companyContactEmail ? (
                <div>
                  <dt className="font-semibold text-fo-text">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${companyContactEmail}`}
                      className="text-fo-primary-bright hover:text-fo-primary-hover"
                    >
                      {companyContactEmail}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-sm leading-relaxed text-fo-text-muted">
              Company contact details are shared after your application is
              accepted.
            </p>
          )}
        </Card>

        <ShiftDetailActions
          shiftId={shift.id}
          companyId={shift.companyId}
          hasPublicProfile={hasPublicProfile}
          canApply={canApply}
          profileIncomplete={profileIncomplete}
          officer={user?.officer ?? null}
          applicationStatus={applicationStatus}
          isSignedIn={Boolean(clerkUser)}
          shiftAcceptingApplications={shiftAcceptingApplications}
        />
      </div>
      </div>
    </PageShell>
  );
}
