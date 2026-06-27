import { UserRole } from "@/app/generated/prisma/enums";
import { FlexOfficersLogoLink } from "@/components/brand";
import { OfficerLicensesList } from "@/components/licenses/officer-licenses-list";
import { Card } from "@/components/ui";
import { adminOfficerLicenseSelect } from "@/lib/officer-fields";
import { LICENSE_DISPLAY_DISCLAIMER } from "@/lib/officer-licenses";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import DashboardSignOutButton from "../dashboard/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requirePageRole(UserRole.ADMIN);

  const officers = await prisma.officer.findMany({
    select: adminOfficerLicenseSelect,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-fo-bg px-6 py-12 text-fo-text">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <FlexOfficersLogoLink href="/" height={40} />
        </div>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>

            <p className="mt-4 text-fo-text-muted">
              View license information officers submit on their profiles.
              FlexOfficers does not confirm license validity.
            </p>
          </div>

          <DashboardSignOutButton />
        </div>

        <div className="mt-10 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Officer licenses</h2>
            <p className="mt-2 text-sm leading-relaxed text-fo-text-muted">
              {LICENSE_DISPLAY_DISCLAIMER}
            </p>
          </div>

          {officers.length === 0 ? (
            <Card variant="muted">
              <p className="text-sm text-fo-text-muted">
                No officer profiles have been submitted yet.
              </p>
            </Card>
          ) : (
            officers.map((officer) => {
              const officerName = `${officer.firstName} ${officer.lastName}`.trim();

              return (
                <Card key={officer.id} variant="elevated" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-fo-text">{officerName}</h3>
                    <p className="mt-1 text-sm text-fo-text-muted">
                      {officer.user.email}
                      {officer.city ? ` · ${officer.city}` : ""}
                      {officer.state ? `, ${officer.state}` : ""}
                    </p>
                  </div>

                  <OfficerLicensesList
                    licenses={officer.licenses}
                    emptyMessage="No licenses submitted"
                  />
                </Card>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
