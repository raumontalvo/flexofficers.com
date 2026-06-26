import type { ArmedStatus } from "@/app/generated/prisma/enums";
import {
  Card,
  ProfileAvatar,
  StatusBadge,
} from "@/components/ui";
import { formatArmedStatuses } from "@/lib/profile-options";

type OfficerSearchCardProps = {
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string | null;
  city?: string | null;
  armedStatuses: ArmedStatus[];
  experienceYears?: number | null;
  certifications: string[];
  availability: string[];
  experienceCategories: string[];
  introduction?: string | null;
  showContact: boolean;
  phone?: string | null;
  email?: string | null;
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

export function OfficerSearchCard({
  firstName,
  lastName,
  profilePhotoUrl,
  city,
  armedStatuses,
  experienceYears,
  certifications,
  availability,
  experienceCategories,
  introduction,
  showContact,
  phone,
  email,
}: OfficerSearchCardProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Card variant="elevated" className="space-y-5">
      <div className="flex items-start gap-4">
        <OfficerPhotoPreview name={fullName} photoUrl={profilePhotoUrl} />

        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-xl font-bold text-fo-text sm:text-2xl">{fullName}</h2>
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
      <TagList label="Availability" values={availability} />
      <TagList label="Experience categories" values={experienceCategories} />

      {introduction ? (
        <div className="rounded-2xl border border-fo-border bg-fo-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
            Introduction
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fo-text">
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

      {showContact ? (
        <div className="rounded-2xl border border-green-500/20 bg-fo-success-bg p-4">
          <p className="text-sm font-semibold text-fo-success">
            Contact available
          </p>
          <p className="mt-1 text-xs text-fo-success/90">
            Visible because this officer applied to one of your shifts.
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-fo-text">Phone</dt>
              <dd className="mt-1 text-fo-text-muted">
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="text-fo-primary-hover hover:text-fo-primary-bright"
                  >
                    {phone}
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-fo-text">Email</dt>
              <dd className="mt-1 break-all text-fo-text-muted">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-fo-primary-hover hover:text-fo-primary-bright"
                  >
                    {email}
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </Card>
  );
}
