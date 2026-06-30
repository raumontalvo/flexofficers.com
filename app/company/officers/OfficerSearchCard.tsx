import type { ReactNode } from "react";
import {
  Card,
  ProfileAvatar,
  StatusBadge,
} from "@/components/ui";
import type { SerializedOfficerSearchResult } from "@/lib/company-officers-page";
import {
  OfficerProfileName,
  officerProfileNameLabel,
} from "@/components/company/officer-profile-name";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";
import { normalizeExperienceCategories } from "@/lib/profile-options";

type OfficerSearchCardProps = {
  officer: SerializedOfficerSearchResult;
  actions?: ReactNode;
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

export function OfficerSearchCard({ officer, actions }: OfficerSearchCardProps) {
  const experienceBadgeLabel =
    officer.experienceYears !== null && officer.experienceYears !== undefined
      ? `${officer.experienceYears} yrs experience`
      : "Experience not provided";

  return (
    <Card variant="elevated" className="space-y-5">
      <div className="flex items-start gap-4">
        <OfficerPhotoPreview
          name={officerProfileNameLabel(officer.firstName, officer.lastName)}
          photoUrl={officer.profilePhotoUrl}
        />

        <div className="min-w-0 flex-1 space-y-2">
          <OfficerProfileName
            firstName={officer.firstName}
            lastName={officer.lastName}
          />
          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="info">{officer.cityStateLabel}</StatusBadge>
            <StatusBadge variant="neutral">{officer.armedStatusLabel}</StatusBadge>
            <StatusBadge variant="neutral">{experienceBadgeLabel}</StatusBadge>
          </div>
        </div>
      </div>

      <TagList label="Certifications" values={officer.certifications} />
      <TagList label="Availability" values={officer.availabilityLabels} />
      <TagList
        label="Experience categories"
        values={normalizeExperienceCategories(officer.experienceCategories)}
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
          Licenses
        </p>
        {officer.licenses.length > 0 ? (
          <div className="space-y-3">
            {officer.licenses.map((license) => (
              <div
                key={license.id}
                className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4"
              >
                <p className="text-sm font-semibold text-fo-text">
                  {license.licenseType}
                </p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                      License Number
                    </dt>
                    <dd className="mt-1 text-fo-text">{license.licenseNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                      Issuing State
                    </dt>
                    <dd className="mt-1 text-fo-text">{license.issuingState}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                      Expiration Date
                    </dt>
                    <dd className="mt-1 text-fo-text">
                      {license.expirationDateLabel}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-fo-text-muted">Not provided</p>
        )}
        <p className="text-xs leading-relaxed text-fo-text-muted">
          {LICENSE_DISPLAY_DISCLAIMER}
        </p>
      </div>

      {officer.introduction ? (
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
            Introduction
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fo-text">
            {officer.introduction}
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

      {actions ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{actions}</div>
      ) : null}
    </Card>
  );
}
