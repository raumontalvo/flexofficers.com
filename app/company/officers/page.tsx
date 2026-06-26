import { UserRole } from "@/app/generated/prisma/enums";
import { Card, PageShell, SectionHeading } from "@/components/ui";
import {
  buildOfficerSearchWhere,
  parseOfficerSearchFilters,
} from "@/lib/officer-search";
import { officerSearchCardSelect } from "@/lib/officer-fields";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { OfficerSearchCard } from "./OfficerSearchCard";
import { OfficerSearchFiltersForm } from "./OfficerSearchFiltersForm";

export const dynamic = "force-dynamic";

type CompanyOfficersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompanyOfficersPage({
  searchParams,
}: CompanyOfficersPageProps) {
  const clerkUser = await requirePageRole(UserRole.COMPANY);
  const params = await searchParams;
  const filters = parseOfficerSearchFilters(params);

  const [officers, companyApplications] = await Promise.all([
    prisma.officer.findMany({
      where: buildOfficerSearchWhere(filters),
      select: {
        ...officerSearchCardSelect,
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    prisma.application.findMany({
      where: {
        shift: {
          company: {
            user: {
              clerkId: clerkUser.id,
            },
          },
        },
      },
      select: {
        officerId: true,
      },
    }),
  ]);

  const contactVisibleOfficerIds = new Set(
    companyApplications.map((application) => application.officerId)
  );

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <PageShell nav="company" maxWidth="2xl">
      <SectionHeading
        title="Search Officers"
        subtitle="Find officers by city, experience, and availability."
      />

      <div className="mt-8 space-y-4">
        <OfficerSearchFiltersForm filters={filters} />

        {officers.length === 0 ? (
          <Card variant="muted" className="text-center">
            <p className="text-lg font-medium text-fo-text">
              No officers matched your search.
            </p>
            <p className="mt-2 text-sm text-fo-text-muted">
              {hasActiveFilters
                ? "Try adjusting your filters or clear them to browse all officer profiles."
                : "Officer profiles will appear here as officers join the marketplace."}
            </p>
          </Card>
        ) : (
          <>
            <p className="text-sm text-fo-text-muted">
              {officers.length} officer{officers.length === 1 ? "" : "s"} found
            </p>

            {officers.map((officer) => (
              <OfficerSearchCard
                key={officer.id}
                firstName={officer.firstName}
                lastName={officer.lastName}
                profilePhotoUrl={officer.profilePhotoUrl}
                city={officer.city}
                armedStatuses={officer.armedStatuses}
                experienceYears={officer.experienceYears}
                certifications={officer.certifications}
                availability={officer.availability}
                experienceCategories={officer.experienceCategories}
                introduction={officer.introduction}
                showContact={contactVisibleOfficerIds.has(officer.id)}
                phone={officer.phone}
                email={officer.user.email}
              />
            ))}
          </>
        )}
      </div>
    </PageShell>
  );
}
