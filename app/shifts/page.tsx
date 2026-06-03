import { prisma } from "@/lib/prisma";

export default async function ShiftsPage() {
  const shifts = await prisma.shift.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold">Available Shifts</h1>

            <p className="mt-4 text-slate-300">
              Browse open security shifts from companies looking for licensed
              officers.
            </p>
          </div>

          <a
            href="/shifts/create"
            className="rounded-xl bg-blue-500 px-6 py-3 text-center font-semibold hover:bg-blue-400"
          >
            Post a Shift
          </a>
        </div>

        <div className="mt-10 grid gap-6">
          {shifts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              No shifts posted yet.
            </div>
          ) : (
            shifts.map((shift) => (
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
                    </div>
                  </div>

                  <button className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10">
                    Apply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}