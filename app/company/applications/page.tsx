import { UserRole } from "@/app/generated/prisma/enums";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import ApplicationDetails from "./ApplicationDetails";

export const dynamic = "force-dynamic";

export default async function CompanyApplicationsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const applications = await prisma.application.findMany({
    where: {
      shift: {
        company: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      },
    },
    include: {
      shift: true,
      officer: {
        include: {
          licenses: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
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
                    {application.officer.city || "City not provided"},{" "}
                    {application.officer.state || "State not provided"}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1">
                    Application: {application.status}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1">
                    Shift: {application.shift.status}
                  </span>
                </div>

                <ApplicationDetails
                  applicationId={application.id}
                  applicationStatus={application.status}
                  bio={application.officer.bio}
                  licenses={application.officer.licenses}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}