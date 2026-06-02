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
      </section>
    </main>
  );
}