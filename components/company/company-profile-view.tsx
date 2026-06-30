import Link from "next/link";
import { buttonClassName, ProfileAvatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SerializedCompanyProfile } from "@/lib/company-profile-page-data";

export type CompanyProfileViewMode = "owner" | "public" | "preview";

type CompanyProfileViewProps = {
  profile: SerializedCompanyProfile;
  mode: CompanyProfileViewMode;
  backHref?: string;
  backLabel?: string;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 10.2 8.8 12 13 7.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailValue({ value }: { value: string | null | undefined }) {
  const trimmed = value?.trim();
  const display =
    !trimmed || trimmed.toLowerCase() === "none" ? "Not provided" : trimmed;

  return <span className="text-sm text-fo-text">{display}</span>;
}

function EmptyValue() {
  return <span className="text-sm text-fo-text-muted">Not provided</span>;
}

function ProfileSectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "fo-glass-card h-auto self-start rounded-xl border border-white/10 p-3 sm:p-4 md:p-5",
        className
      )}
    >
      <h2 className="text-base font-semibold text-fo-text">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ServiceChipGrid({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <EmptyValue />;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-100"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function WorkEnvironmentGrid({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <EmptyValue />;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-fo-text"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function BenefitIcon({ label }: { label: string }) {
  const className = "h-4 w-4 text-blue-300";

  switch (label) {
    case "Weekly Pay":
      return (
        <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
          <rect x="2" y="4" width="12" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 8h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "Flexible Scheduling":
      return (
        <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 2.5v2M11 2.5v2M2.5 6.5h11" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "Advancement Opportunities":
      return (
        <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
          <path d="M3 12 8 4l5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "Overtime Available":
      return (
        <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5v3.2l2 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "Training Provided":
      return (
        <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
          <path d="M3 6.5 8 3.5l5 3v5.5H3V6.5Z" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
          <rect x="2.5" y="4" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5.5 8h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}

function BenefitGrid({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <EmptyValue />;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <BenefitIcon label={item} />
          </span>
          <span className="text-sm font-medium text-fo-text">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SidebarDetails({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-fo-text-muted">{label}</dt>
      <dd className="mt-1">
        <DetailValue value={value} />
      </dd>
    </div>
  );
}

function ProfileSidebar({ profile }: { profile: SerializedCompanyProfile }) {
  return (
    <aside className="space-y-4 self-start">
      <ProfileSectionCard title="License Information">
        <dl className="space-y-3">
          <SidebarDetails label="License Number" value={profile.license.licenseNumber} />
          <SidebarDetails label="License Type" value={profile.license.licenseType} />
          <SidebarDetails label="State Issued" value={profile.license.licenseState} />
          <SidebarDetails label="Issue Date" value={profile.license.issueDate} />
          <SidebarDetails
            label="Expiration Date"
            value={profile.license.expirationDate}
          />
        </dl>
      </ProfileSectionCard>

      <ProfileSectionCard title="Company Details">
        <dl className="space-y-3">
          <SidebarDetails label="Industry" value={profile.details.industry} />
          <SidebarDetails label="Company Size" value={profile.details.companySize} />
          <SidebarDetails label="Established" value={profile.details.established} />
          <SidebarDetails label="Website" value={profile.details.website} />
          {profile.showContactDetails ? (
            <>
              <SidebarDetails
                label="Contact Email"
                value={profile.details.contactEmail}
              />
              <SidebarDetails label="Phone" value={profile.details.phone} />
            </>
          ) : (
            <>
              <SidebarDetails label="Contact Email" value={null} />
              <SidebarDetails label="Phone" value={null} />
            </>
          )}
        </dl>
      </ProfileSectionCard>

      <ProfileSectionCard title="Support & Contact">
        <dl className="space-y-3">
          <SidebarDetails
            label="Business Hours"
            value={profile.support.businessHours}
          />
          <SidebarDetails
            label="Email"
            value={profile.showContactDetails ? profile.support.email : null}
          />
          <SidebarDetails
            label="Phone"
            value={profile.showContactDetails ? profile.support.phone : null}
          />
        </dl>
      </ProfileSectionCard>
    </aside>
  );
}

function ProfileHero({ profile }: { profile: SerializedCompanyProfile }) {
  return (
    <section className="fo-glass-card h-auto self-start rounded-xl border border-white/10 p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ProfileAvatar
            name={profile.displayCompanyName}
            src={profile.logoUrl}
            size="xl"
            className="h-16 w-16 text-xl sm:h-24 sm:w-24 sm:text-2xl"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-fo-text sm:text-2xl">
                {profile.displayCompanyName}
              </h2>
              {profile.verified ? (
                <CheckIcon className="h-5 w-5 text-blue-400" />
              ) : null}
            </div>

            <p className="mt-1 text-sm text-blue-100">
              {profile.categoryLabel || "Not provided"}
            </p>

            <p className="mt-2 text-sm text-fo-text-muted">{profile.locationLabel}</p>

            {profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-blue-200 hover:text-blue-100"
              >
                {profile.website}
              </a>
            ) : (
              <p className="mt-1 text-sm text-fo-text-muted">Not provided</p>
            )}

            <p className="mt-2 text-sm text-fo-text-muted">
              Member since {profile.memberSinceLabel}
            </p>

            {profile.showLicensedInsuredBadge ? (
              <div className="mt-3">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                  Licensed & Insured
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-sm leading-relaxed text-fo-text-muted">
            {profile.introduction?.trim() || "Not provided"}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CompanyProfileView({
  profile,
  mode,
  backHref,
  backLabel,
}: CompanyProfileViewProps) {
  return (
    <div className="space-y-4">
      {mode === "owner" ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <nav aria-label="Breadcrumb" className="text-sm text-fo-text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link
                    href="/dashboard"
                    className="transition hover:text-fo-primary-hover"
                  >
                    Dashboard
                  </Link>
                </li>
                <li aria-hidden="true">&gt;</li>
                <li className="text-fo-text">Company Profile</li>
              </ol>
            </nav>
            <h1 className="text-2xl font-bold text-fo-text">Company Profile</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/company/profile/edit"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
              })}
            >
              Edit Profile
            </Link>
            {profile.hasPublicProfile ? (
              <Link
                href="/company/profile/preview"
                className={buttonClassName({
                  variant: "secondary",
                  size: "md",
                })}
              >
                View Public Profile
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {mode === "preview" ? (
        <nav aria-label="Breadcrumb" className="text-sm text-fo-text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/dashboard" className="transition hover:text-fo-primary-hover">
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link
                href="/company/profile"
                className="transition hover:text-fo-primary-hover"
              >
                Company Profile
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-fo-text">Public Preview</li>
          </ol>
        </nav>
      ) : null}

      {mode === "public" && backHref ? (
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center text-sm font-medium text-fo-primary-hover hover:text-fo-primary-bright"
        >
          {backLabel ?? "← Back"}
        </Link>
      ) : null}

      {mode === "public" && !backHref ? (
        <h1 className="text-2xl font-bold text-fo-text">Company Profile</h1>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="space-y-4">
          <ProfileHero profile={profile} />

          <ProfileSectionCard title="About Us">
            <p className="text-sm leading-relaxed text-fo-text-muted">
              {profile.aboutDescription?.trim() || "Not provided"}
            </p>
          </ProfileSectionCard>

          <ProfileSectionCard title="Services We Provide">
            <ServiceChipGrid items={profile.services} />
          </ProfileSectionCard>

          <ProfileSectionCard title="Why Officers Choose Us">
            <BenefitGrid items={profile.officerBenefits} />
          </ProfileSectionCard>

          <ProfileSectionCard title="Work Environment">
            <WorkEnvironmentGrid items={profile.workEnvironment} />
          </ProfileSectionCard>
        </div>

        <ProfileSidebar profile={profile} />
      </div>

      {mode === "preview" ? (
        <Link
          href="/company/profile"
          className={buttonClassName({
            variant: "secondary",
            size: "md",
          })}
        >
          Back to Company Profile
        </Link>
      ) : null}
    </div>
  );
}
