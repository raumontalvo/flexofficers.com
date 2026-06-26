import { UserRole } from "@/app/generated/prisma/enums";
import { FlexOfficersLogoLink } from "@/components/brand";
import { requirePageRole } from "@/lib/page-rbac";
import DashboardSignOutButton from "../dashboard/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requirePageRole(UserRole.ADMIN);

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
              FlexOfficers admin area. Marketplace verification tools have been
              removed for Version 1.0.
            </p>
          </div>

          <DashboardSignOutButton />
        </div>

        <div className="mt-10 rounded-3xl border border-white/[0.06] bg-fo-surface/35 p-8">
          <h2 className="text-2xl font-bold">Admin tools</h2>

          <p className="mt-4 text-slate-300">
            No admin review queues are active right now. Companies verify officer
            credentials through their own hiring process.
          </p>

          <p className="mt-4 text-sm text-fo-text-subtle">
            Subscription and platform management tools will be added here in a
            later release.
          </p>
        </div>
      </section>
    </main>
  );
}
