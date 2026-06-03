const sampleShifts = [
  {
    title: "Armed Security Officer",
    location: "Fort Myers, FL",
    pay: "$25/hr",
    license: "G License",
    time: "Tonight · 8:00 PM - 4:00 AM",
  },
  {
    title: "Event Security Officer",
    location: "Cape Coral, FL",
    pay: "$20/hr",
    license: "D License",
    time: "Saturday · 2:00 PM - 10:00 PM",
  },
  {
    title: "Retail Security Officer",
    location: "Naples, FL",
    pay: "$22/hr",
    license: "D License",
    time: "Monday · 9:00 AM - 5:00 PM",
  },
];

export default function ShiftsPage() {
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
          {sampleShifts.map((shift) => (
            <div
              key={shift.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">{shift.title}</h2>
                  <p className="mt-2 text-slate-300">{shift.location}</p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      {shift.pay}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      {shift.license}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      {shift.time}
                    </span>
                  </div>
                </div>

                <button className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}