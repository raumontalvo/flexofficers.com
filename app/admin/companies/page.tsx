import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";
import VerifyCompanyButton from "./VerifyCompanyButton";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const clerkUser = await currentUser();

  const adminUser = clerkUser
    ? await prisma.user.findUnique({
        where: {
          clerkId: clerkUser.id,
        },
      })
    : null;

  if (adminUser?.role !== UserRole.ADMIN) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <section className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold">Admin Access Required</h1>
          <p className="mt-4 text-slate-300">
            You do not have permission to view this page.
          </p>
        </section>
      </main>
    );
  }

  const companies = await prisma.company.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Company Verification</h1>

        <p className="mt-4 text-slate-300">
          Review company license information and mark companies as verified.
        </p>

        <div className="mt-10 grid gap-6">
          {companies.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              No companies found.
            </div>
          ) : (
            companies.map((company) => (
              <div
                key={company.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {company.companyName}
                    </h2>

                    <p className="mt-2 text-slate-300">
                      Account email: {company.user.email}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        {company.city || "City not provided"},{" "}
                        {company.state || "State not provided"}
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1">
                        Status: {company.verified ? "Verified" : "Not verified"}
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900 p-4">
                      <h3 className="font-semibold">License Information</h3>

                      <div className="mt-3 grid gap-2 text-sm text-slate-300">
                        <p>
                          Type: {company.licenseType || "Not provided"}
                        </p>
                        <p>
                          Number: {company.licenseNumber || "Not provided"}
                        </p>
                        <p>
                          Issuing state:{" "}
                          {company.licenseState || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <VerifyCompanyButton
                    companyId={company.id}
                    verified={company.verified}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}