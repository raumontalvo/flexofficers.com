import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  const user = clerkUser
    ? await prisma.user.findUnique({
        where: {
          clerkId: clerkUser.id,
        },
      })
    : null;

  const role = user?.role;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="mt-4 text-slate-300">
          Welcome{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}.
          Manage your FlexOfficers marketplace activity.
        </p>

        {!role && (
          <div className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <h2 className="text-2xl font-bold">Complete onboarding</h2>

            <p className="mt-3 text-yellow-100">
              Choose whether you are joining as an officer or a company before
              using the dashboard.
            </p>

            <a
              href="/onboarding"
              className="mt-5 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-slate-950 hover:bg-yellow-400"
            >
              Go to Onboarding
            </a>
          </div>
        )}

        {role === "OFFICER" && (
          <>
            <h2 className="mt-12 text-2xl font-bold">Officer Tools</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <a
                href="/officer/profile"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Officer Profile</h3>
                <p className="mt-3 text-slate-300">
                  Manage licenses, experience, and availability.
                </p>
              </a>

              <a
                href="/shifts"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Available Shifts</h3>
                <p className="mt-3 text-slate-300">
                  Browse and apply to open shifts.
                </p>
              </a>

              <a
                href="/officer/applications"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">My Applications</h3>
                <p className="mt-3 text-slate-300">
                  Track application status and decisions.
                </p>
              </a>
            </div>
          </>
        )}

        {role === "COMPANY" && (
          <>
            <h2 className="mt-12 text-2xl font-bold">Company Tools</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <a
                href="/company/profile"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Company Profile</h3>
                <p className="mt-3 text-slate-300">
                  Manage company information.
                </p>
              </a>

              <a
                href="/shifts/create"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Post a Shift</h3>
                <p className="mt-3 text-slate-300">
                  Create new security opportunities.
                </p>
              </a>

              <a
                href="/company/shifts"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Manage Shifts</h3>
                <p className="mt-3 text-slate-300">
                  View and delete shifts your company posted.
                </p>
              </a>

              <a
                href="/company/applications"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Applicants</h3>
                <p className="mt-3 text-slate-300">
                  Review and manage applicants.
                </p>
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}