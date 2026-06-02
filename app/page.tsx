export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-4 rounded-full border border-blue-400/30 px-4 py-2 text-sm text-blue-300">
          FlexOfficers Marketplace
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Fill security shifts with licensed officers faster.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          FlexOfficers connects security companies with qualified officers who
          are ready to claim flexible shifts, cover call-outs, and keep posts
          protected.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/post-shift"
            className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-400"
          >
            Post a Shift
          </a>

          <a
            href="/shifts"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            View Available Shifts
          </a>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold">1. Post a Shift</h3>
            <p className="mt-3 text-slate-300">
              Security companies create open shifts and specify requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold">2. Officers Apply</h3>
            <p className="mt-3 text-slate-300">
              Licensed officers browse opportunities and submit applications.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold">3. Fill the Post</h3>
            <p className="mt-3 text-slate-300">
              Companies review applicants and assign qualified officers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}