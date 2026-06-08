import { UserRole } from "@/app/generated/prisma/enums";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import ReviewLicenseButton from "./ReviewLicenseButton";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) {
    return "Not provided";
  }

  return value.toLocaleDateString();
}

export default async function AdminLicensesPage() {
  await requirePageRole(UserRole.ADMIN);

  const licenses = await prisma.license.findMany({
    where: {
      documentKey: {
        not: null,
      },
    },
    include: {
      officer: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: [{ documentUploadedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">License Review Queue</h1>

        <p className="mt-4 text-slate-300">
          Review uploaded officer license documents and mark each license as
          verified or rejected.
        </p>

        <div className="mt-10 grid gap-6">
          {licenses.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              No uploaded license documents found.
            </div>
          ) : (
            licenses.map((license) => (
              <div
                key={license.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {license.officer.firstName} {license.officer.lastName}
                      </h2>

                      <p className="mt-2 text-slate-300">
                        Officer email: {license.officer.user.email}
                      </p>
                    </div>

                    <div className="grid gap-2 text-sm text-slate-200">
                      <p>License type: {license.licenseType}</p>
                      <p>License number: {license.licenseNumber}</p>
                      <p>Issuing state: {license.issuingState}</p>
                      <p>
                        Expiration date: {formatDate(license.expirationDate)}
                      </p>
                      <p>
                        Uploaded file: {license.documentFileName || "Unknown"}
                      </p>
                      <p>Verification status: {license.verificationStatus}</p>
                      <p>
                        Review notes: {license.verificationNotes || "None"}
                      </p>
                    </div>
                  </div>

                  <ReviewLicenseButton
                    licenseId={license.id}
                    verificationStatus={license.verificationStatus}
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