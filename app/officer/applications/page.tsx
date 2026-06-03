import { prisma } from "@/lib/prisma";

export default async function OfficerApplicationsPage() {
  const applications = await prisma.application.findMany({
    where: {
      officer: {
        user: {
          clerkId: "test-officer-user",
        },
      },
    },
    include: {
      shift: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">My Applications</h1>

        <p className="mt-4 text-slate-300">
          Track the shifts you applied to and see whether companies accepted or
          rejected your application.
        </p>

        <div className="mt-10 grid gap-6">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              You have not applied to any shifts yet.
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h2 className="text-2xl font-bold">
                  {application.shift.title}
                </h2>

                <p className="mt-2 text-slate-300">
                  {application.shift.location}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    ${application.shift.hourlyRate.toString()}/hr
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {application.shift.requiredLicense}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {application.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}