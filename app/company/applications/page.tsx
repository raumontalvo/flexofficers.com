import { prisma } from "@/lib/prisma";
import ApplicationStatusButtons from "./ApplicationStatusButtons";

export default async function CompanyApplicationsPage() {
  const applications = await prisma.application.findMany({
    include: {
      shift: true,
      officer: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Applicants</h1>

        <p className="mt-4 text-slate-300">
          Review officers who applied to your shifts.
        </p>

        <div className="mt-10 grid gap-6">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              No applications yet.
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h2 className="text-2xl font-bold">
                  {application.officer.firstName}{" "}
                  {application.officer.lastName}
                </h2>

                <p className="mt-2 text-slate-300">
                  Applied for: {application.shift.title}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {application.officer.city}, {application.officer.state}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {application.status}
                  </span>
                </div>

                <ApplicationStatusButtons
                  applicationId={application.id}
                  status={application.status}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}