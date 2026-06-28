import Link from "next/link";
import { Card, StatCard, buttonClassName } from "@/components/ui";
import { adminCompanySelect } from "@/lib/officer-fields";
import { getAdminCompanyStats, serializeAdminCompany } from "@/lib/admin-companies";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [companies, officerCount, shiftCount, applicationCount] =
    await Promise.all([
      prisma.company.findMany({
        select: adminCompanySelect,
      }),
      prisma.officer.count(),
      prisma.shift.count(),
      prisma.application.count(),
    ]);

  const serializedCompanies = companies.map((company) =>
    serializeAdminCompany(company)
  );
  const companyStats = getAdminCompanyStats(serializedCompanies);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-fo-text-muted">
          Business control center for company access, workforce, and operations.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Companies" value={companyStats.total} tone="blue" />
        <StatCard label="Officers" value={officerCount} tone="green" />
        <StatCard label="Shifts" value={shiftCount} tone="purple" />
        <StatCard label="Applications" value={applicationCount} tone="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="elevated" className="fo-glass-card space-y-4 border border-white/10 p-4">
          <div>
            <h2 className="text-lg font-semibold text-fo-text">Company access</h2>
            <p className="mt-1 text-sm text-fo-text-muted">
              Manage trials, paid access, and expirations from one screen.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-fo-text-muted">Active</dt>
              <dd className="mt-1 text-xl font-bold text-fo-text">
                {companyStats.active}
              </dd>
            </div>
            <div>
              <dt className="text-fo-text-muted">On trial</dt>
              <dd className="mt-1 text-xl font-bold text-fo-text">
                {companyStats.onTrial}
              </dd>
            </div>
            <div>
              <dt className="text-fo-text-muted">Expired</dt>
              <dd className="mt-1 text-xl font-bold text-fo-text">
                {companyStats.expired}
              </dd>
            </div>
          </dl>
          <Link
            href="/admin/companies"
            className={buttonClassName({ size: "md", className: "inline-flex" })}
          >
            Open Companies
          </Link>
        </Card>

        <Card variant="elevated" className="fo-glass-card space-y-4 border border-white/10 p-4">
          <div>
            <h2 className="text-lg font-semibold text-fo-text">Quick links</h2>
            <p className="mt-1 text-sm text-fo-text-muted">
              Jump into the main admin workspaces.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/companies", label: "Companies" },
              { href: "/admin/officers", label: "Officers" },
              { href: "/admin/shifts", label: "Shifts" },
              { href: "/admin/applications", label: "Applications" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm font-medium text-fo-text transition hover:bg-white/[0.06]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
