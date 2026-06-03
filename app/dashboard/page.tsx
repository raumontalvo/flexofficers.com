import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="mt-4 text-slate-300">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}. Manage your
          FlexOfficers marketplace activity.
        </p>

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

        <h2 className="mt-16 text-2xl font-bold">Company Tools</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <a
            href="/company/profile"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold">Company Profile</h3>
            <p className="mt-3 text-slate-300">Manage company information.</p>
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
            href="/company/applications"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold">Applicants</h3>
            <p className="mt-3 text-slate-300">
              Review and manage applicants.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}