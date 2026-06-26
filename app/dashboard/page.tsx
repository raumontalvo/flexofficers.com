import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FlexOfficersLogoLink } from "@/components/brand";
import { dashboardUserSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import CompanyDashboard from "./CompanyDashboard";
import DashboardSignOutButton from "./SignOutButton";
import OfficerDashboard from "./OfficerDashboard";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  const user = clerkUser
    ? await prisma.user.findUnique({
        where: {
          clerkId: clerkUser.id,
        },
        select: dashboardUserSelect,
      })
    : null;

  const role = user?.role;

  if (role === "ADMIN") {
    redirect("/admin");
  }

  const companyMissingItems =
    role === "COMPANY"
      ? ([
          !user?.company?.companyName ? "Add your company name" : null,
          !user?.company?.contactName ? "Add your contact person" : null,
          !user?.company?.phone ? "Add your company phone number" : null,
          !user?.company?.email && !user?.email ? "Add your company email" : null,
          !user?.company?.address ? "Add your company address" : null,
        ].filter((item): item is string => Boolean(item)))
      : [];

  if (role === "COMPANY" && user?.company) {
    return (
      <CompanyDashboard
        firstName={clerkUser?.firstName}
        company={user.company}
        missingItems={companyMissingItems}
      />
    );
  }

  if (role === "OFFICER") {
    return (
      <OfficerDashboard
        firstName={clerkUser?.firstName}
        officer={user?.officer ?? null}
      />
    );
  }

  return (
    <main className="min-h-screen bg-fo-bg px-6 py-12 text-fo-text">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <FlexOfficersLogoLink href="/" height={40} />
        </div>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <p className="mt-4 text-fo-text-muted">
              Welcome{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}.
              Manage your FlexOfficers marketplace activity.
            </p>
          </div>

          <DashboardSignOutButton />
        </div>

        {!role && (
          <div className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <h2 className="text-2xl font-bold">Complete onboarding</h2>

            <p className="mt-3 text-yellow-100">
              Choose whether you are joining as an officer or a company before
              using the dashboard.
            </p>

            <Link
              href="/onboarding"
              className="mt-5 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-slate-950 hover:bg-yellow-400"
            >
              Go to Onboarding
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
