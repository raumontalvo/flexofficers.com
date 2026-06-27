import type { ApplicationStatus, ArmedStatus, ShiftStatus } from "@/app/generated/prisma/enums";
import {
  ApplicationStatusBadge,
  Card,
  ProfileAvatar,
  ShiftStatusBadge,
  StatusBadge,
} from "@/components/ui";
import { OfficerLicensesList } from "@/components/licenses/officer-licenses-list";
import type { OfficerLicenseSnapshot } from "@/lib/officer-licenses";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";
import { formatArmedStatuses } from "@/lib/profile-options";
import { formatHourlyRate, formatShiftDateTime } from "@/lib/format-shift";
import ApplicationStatusButtons from "./ApplicationStatusButtons";

type ApplicantCardProps = {
  applicationId: string;
  applicationStatus: ApplicationStatus;
  shiftTitle: string;
  shiftStatus: ShiftStatus;
  hourlyRate: { toString: () => string };
  location: string;
  startTime: Date;
  endTime: Date;
  officerFirstName: string;
  officerLastName: string;
  profilePhotoUrl?: string | null;
  city?: string | null;
  armedStatuses: ArmedStatus[];
  experienceYears?: number | null;
  certifications: string[];
  experienceCategories: string[];
  introduction?: string | null;
  licenses: OfficerLicenseSnapshot[];
};

function TagList({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
        {label}
      </p>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <StatusBadge key={value} variant="neutral">
              {value}
            </StatusBadge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-fo-text-muted">Not provided</p>
      )}
    </div>
  );
}

function OfficerPhotoPreview({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  if (photoUrl?.trim()) {
    return (
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-fo-border-strong bg-fo-bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return <ProfileAvatar name={name} size="lg" />;
}

export function ApplicantCard({
  applicationId,
  applicationStatus,
  shiftTitle,
  shiftStatus,
  hourlyRate,
  location,
  startTime,
  endTime,
  officerFirstName,
  officerLastName,
  profilePhotoUrl,
  city,
  armedStatuses,
  experienceYears,
  certifications,
  experienceCategories,
  introduction,
  licenses,
}: ApplicantCardProps) {
  const officerName = `${officerFirstName} ${officerLastName}`.trim();
  const isPending = applicationStatus === "PENDING";
  const isAccepted = applicationStatus === "ACCEPTED";
  const isRejected = applicationStatus === "REJECTED";
  const isWithdrawn = applicationStatus === "WITHDRAWN";

  return (
    <Card
      variant={isWithdrawn ? "muted" : "elevated"}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <ApplicationStatusBadge status={applicationStatus} />
        <ShiftStatusBadge status={shiftStatus} />
      </div>

      <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
          Applied for
        </p>
        <h2 className="mt-2 text-lg font-bold text-fo-text sm:text-xl">
          {shiftTitle}
        </h2>
        <p className="mt-3 text-2xl font-bold text-fo-primary-bright sm:text-3xl">
          {formatHourlyRate(hourlyRate)}
          <span className="ml-1 text-base font-semibold text-fo-text-muted">
            /hr
          </span>
        </p>
        <p className="mt-2 text-sm text-fo-text">{location}</p>
        <div className="mt-2 space-y-1 text-sm text-fo-text-muted">
          <p>Starts {formatShiftDateTime(startTime)}</p>
          <p>Ends {formatShiftDateTime(endTime)}</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <OfficerPhotoPreview name={officerName} photoUrl={profilePhotoUrl} />

        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-xl font-bold text-fo-text">{officerName}</h3>
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="info">{city || "City not provided"}</StatusBadge>
            <StatusBadge variant="neutral">
              {formatArmedStatuses(armedStatuses)}
            </StatusBadge>
            <StatusBadge variant="neutral">
              {experienceYears !== null && experienceYears !== undefined
                ? `${experienceYears} yrs experience`
                : "Experience not provided"}
            </StatusBadge>
          </div>
        </div>
      </div>

      <TagList label="Certifications" values={certifications} />
      <TagList label="Experience categories" values={experienceCategories} />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
          Licenses
        </p>
        <OfficerLicensesList licenses={licenses} />
        <p className="text-xs leading-relaxed text-fo-text-muted">
          {LICENSE_DISPLAY_DISCLAIMER}
        </p>
      </div>

      {introduction ? (
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
            Introduction
          </p>
          <p className="mt-2 text-sm leading-relaxed text-fo-text">
            {introduction}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
            Introduction
          </p>
          <p className="mt-2 text-sm text-fo-text-muted">Not provided</p>
        </div>
      )}

      {isAccepted ? (
        <div className="rounded-2xl border border-green-500/20 bg-fo-success-bg p-4">
          <p className="text-sm leading-relaxed text-fo-success">
            You accepted this officer for the shift. They can view your company
            contact details on their Accepted Shifts page.
          </p>
        </div>
      ) : null}

      {isRejected ? (
        <div className="rounded-2xl border border-red-500/20 bg-fo-rejected-bg p-4">
          <p className="text-sm leading-relaxed text-fo-rejected">
            This application was rejected. Accept and reject actions are no
            longer available.
          </p>
        </div>
      ) : null}

      {isWithdrawn ? (
        <div className="rounded-2xl border border-fo-border-strong bg-fo-neutral-bg p-4">
          <p className="text-sm leading-relaxed text-fo-text-muted">
            This officer withdrew their application. Accept and reject actions
            are no longer available.
          </p>
        </div>
      ) : null}

      {isPending ? (
        <ApplicationStatusButtons
          applicationId={applicationId}
          status={applicationStatus}
        />
      ) : null}
    </Card>
  );
}
