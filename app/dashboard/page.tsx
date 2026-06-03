import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="mt-4 text-slate-300">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}. Manage your
          FlexOfficers account and marketplace activity.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <a
            href="/officer/profile"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-semibold">Officer Profile</h2>

            <p className="mt-3 text-slate-300">
              Add licenses, experience, location, and availability.
            </p>
          </a>

          <a
            href="/company/profile"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-semibold">Company Profile</h2>

            <p className="mt-3 text-slate-300">
              Manage company information and staffing needs.
            </p>
          </a>

          <a
            href="/shifts"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="text-xl font-semibold">Shift Board</h2>

            <p className="mt-3 text-slate-300">
              Browse, post, apply, and manage security shifts.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}