import Link from "next/link";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import CancelShiftButton from "./CancelShiftButton";
import DeleteShiftButton from "./DeleteShiftButton";

export const dynamic = "force-dynamic";

export default async function CompanyShiftsPage() {
  const clerkUser = await currentUser();

  const shifts = clerkUser
    ? await prisma.shift.findMany({
        where: {
          company: {
            user: {
              clerkId: clerkUser.id,
            },
          },
        },
        include: {
          applications: {
            where: {
              status: ApplicationStatus.ACCEPTED,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold">Manage Shifts</h1>

            <p className="mt-4 text-slate-300">
              View, track, cancel, and delete shifts posted by your company.
            </p>
          </div>

          <Link
            href="/shifts/create"
            className="rounded-xl bg-blue-500 px-6 py-3 text-center font-semibold hover:bg-blue-400"
          >
            Post a Shift
          </Link>
        </div>

        <div className="mt-10 grid gap-6">
          {shifts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              You have not posted any shifts yet.
            </div>
          ) : (
            shifts.map((shift) => {
              const filledCount = shift.applications.length;

              return (
                <div
                  key={shift.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold">{shift.title}</h2>

                      <p className="mt-2 text-slate-300">{shift.location}</p>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                        <span className="rounded-full bg-white/10 px-3 py-1">
                          ${shift.hourlyRate.toString()}/hr
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1">
                          {shift.requiredLicense}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1">
                          {filledCount} of {shift.positionsNeeded} filled
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1">
                          {shift.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/company/shifts/${shift.id}/edit`}
                        className="rounded-xl border border-white/20 px-5 py-3 text-center font-semibold hover:bg-white/10"
                      >
                        Edit Shift
                      </Link>
                      <CancelShiftButton shiftId={shift.id} />
                      <DeleteShiftButton shiftId={shift.id} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}