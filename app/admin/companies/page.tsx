import { CompaniesControlCenter } from "@/components/admin/companies-control-center";
import { serializeAdminCompany } from "@/lib/admin-companies";
import { adminCompanySelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({
    select: adminCompanySelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  const adminIds = [
    ...new Set(
      companies
        .map((company) => company.trialExtendedByAdminId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const admins =
    adminIds.length > 0
      ? await prisma.user.findMany({
          where: {
            id: {
              in: adminIds,
            },
          },
          select: {
            id: true,
            email: true,
          },
        })
      : [];

  const adminEmailById = new Map(admins.map((admin) => [admin.id, admin.email]));

  const serializedCompanies = companies.map((company) =>
    serializeAdminCompany(
      company,
      company.trialExtendedByAdminId
        ? (adminEmailById.get(company.trialExtendedByAdminId) ?? null)
        : null
    )
  );

  return <CompaniesControlCenter companies={serializedCompanies} />;
}
