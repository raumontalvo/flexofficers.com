import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { buttonClassName, Card } from "@/components/ui";
import { formatTitleCase } from "@/lib/company-profile-page-data";
import {
  formatEstimatedShiftPay,
  formatHourlyRate,
  formatShiftCityState,
  formatShiftDateTime,
} from "@/lib/format-shift";
import { buildJobPageSlug } from "@/lib/job-page-slug";
import {
  findPublicJobShiftBySlug,
  getPublicJobShiftOpenPositions,
} from "@/lib/public-job-page-data";
import { buildShiftJobPostingJsonLd } from "@/lib/shift-job-posting-json-ld";
import { fromShiftWorkType } from "@/lib/shift-form-options";
import { getShiftRequirementChips } from "@/lib/shift-requirements";
import { SITEMAP_BASE_URL } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function buildJobPageMetadata(shift: {
  title: string;
  description: string | null;
  city: string | null;
  state: string | null;
  location: string;
  id: string;
}) {
  const slug = buildJobPageSlug(shift);
  const locationLabel = formatShiftCityState(shift);
  const title = locationLabel
    ? `${shift.title} in ${locationLabel}`
    : shift.title;
  const description =
    shift.description?.trim() ||
    `Apply for ${shift.title}${locationLabel ? ` in ${locationLabel}` : ""} on FlexOfficers.`;
  const canonicalUrl = `${SITEMAP_BASE_URL}/jobs/${slug}`;

  return {
    title,
    description,
    canonicalUrl,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website" as const,
      siteName: "FlexOfficers",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await findPublicJobShiftBySlug(slug);

  if (!result) {
    return {
      title: "Job Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const metadata = buildJobPageMetadata(result.shift);

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: metadata.canonicalUrl,
    },
    openGraph: metadata.openGraph,
    twitter: metadata.twitter,
  };
}

export default async function PublicJobPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await findPublicJobShiftBySlug(slug);

  if (!result) {
    notFound();
  }

  if (!result.slugMatches) {
    redirect(`/jobs/${result.canonicalSlug}`);
  }

  const { shift } = result;
  const locationLabel = formatShiftCityState(shift);
  const openPositions = getPublicJobShiftOpenPositions(shift);
  const workTypeLabel = fromShiftWorkType(shift.workType);
  const requirementChips = getShiftRequirementChips(shift, 20);
  const displayCompanyName =
    formatTitleCase(shift.company.companyName) ?? shift.company.companyName;
  const estimatedPay = formatEstimatedShiftPay(
    shift.hourlyRate,
    shift.startTime,
    shift.endTime
  );
  const metadata = buildJobPageMetadata(shift);
  const jobPostingJsonLd = buildShiftJobPostingJsonLd({
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
    pageUrl: metadata.canonicalUrl,
  });

  return (
    <main className="min-h-screen bg-fo-bg text-fo-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingJsonLd),
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-fo-primary-hover"
          >
            FlexOfficers
          </Link>
        </header>

        <article className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-fo-text-muted">
              {displayCompanyName}
              {locationLabel ? ` · ${locationLabel}` : ""}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl">
              {shift.title}
            </h1>
            <p className="text-3xl font-bold text-fo-primary-bright">
              {formatHourlyRate(shift.hourlyRate)}
              <span className="ml-1 text-lg font-semibold text-fo-text-muted">
                /hr
              </span>
            </p>
            <p className="text-sm text-fo-text-muted">
              Estimated pay: {estimatedPay}
            </p>
          </div>

          <Card className="grid gap-4 sm:grid-cols-2">
            {locationLabel ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  Location
                </p>
                <p className="mt-1 text-base font-medium text-fo-text">
                  {locationLabel}
                </p>
              </div>
            ) : null}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Positions open
              </p>
              <p className="mt-1 text-base font-medium text-fo-text">
                {openPositions} of {shift.positionsNeeded}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                Start
              </p>
              <p className="mt-1 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.startTime)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                End
              </p>
              <p className="mt-1 text-base font-medium text-fo-text">
                {formatShiftDateTime(shift.endTime)}
              </p>
            </div>

            {workTypeLabel ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fo-text-subtle">
                  Work type
                </p>
                <p className="mt-1 text-base font-medium text-fo-text">
                  {workTypeLabel}
                </p>
              </div>
            ) : null}
          </Card>

          {shift.description?.trim() ? (
            <Card className="space-y-2">
              <h2 className="text-lg font-semibold text-fo-text">Description</h2>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-fo-text-muted">
                {shift.description}
              </p>
            </Card>
          ) : null}

          {requirementChips.length > 0 ? (
            <Card className="space-y-3">
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

          <div className="pt-2">
            <Link
              href={`/shifts/${shift.id}`}
              className={buttonClassName({ size: "lg" })}
            >
              Apply for this shift
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
