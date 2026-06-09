import Link from "next/link";
import {
  LicenseVerificationStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import DashboardSignOutButton from "../dashboard/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requirePageRole(UserRole.ADMIN);

  const [pendingCompanies, pendingLicenses] = await Promise.all([
    prisma.company.count({
      where: {
        verified: false,
      },
    }),
    prisma.license.count({
      where: {
        documentKey: {
          not: null,
        },
        verificationStatus: LicenseVerificationStatus.PENDING,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>

            <p className="mt-4 text-slate-300">
              Manage FlexOfficers verification tools and review queues.
            </p>
          </div>

          <DashboardSignOutButton />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-400">
              Pending License Reviews
            </p>
            <p className="mt-3 text-5xl font-bold">{pendingLicenses}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-400">
              Pending Company Verifications
            </p>
            <p className="mt-3 text-5xl font-bold">{pendingCompanies}</p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Admin Tools</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/licenses"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold">Review Licenses</h3>
            <p className="mt-3 text-slate-300">
              Review uploaded officer license documents.
            </p>
          </Link>

          <Link
            href="/admin/companies"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold">Verify Companies</h3>
            <p className="mt-3 text-slate-300">
              Review and verify company accounts.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}