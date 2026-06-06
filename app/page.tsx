import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          FlexOfficers
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#how-it-works" className="hover:text-white">
            How It Works
          </a>
          <a href="#companies" className="hover:text-white">
            For Companies
          </a>
          <a href="#officers" className="hover:text-white">
            For Officers
          </a>
        </div>

        <Link
          href="/sign-up"
          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Get Started
        </Link>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
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
          <Link
            href="/shifts/create"
            className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-400"
          >
            Post a Shift
          </Link>

          <Link
            href="/shifts"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            View Available Shifts
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Security staffing in three simple steps.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h3 className="text-xl font-bold">1. Post a Shift</h3>
            <p className="mt-3 text-slate-300">
              Security companies create open shifts and specify requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h3 className="text-xl font-bold">2. Officers Apply</h3>
            <p className="mt-3 text-slate-300">
              Licensed officers browse opportunities and submit applications.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h3 className="text-xl font-bold">3. Fill the Post</h3>
            <p className="mt-3 text-slate-300">
              Companies review applicants and assign qualified officers.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div
            id="companies"
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-3xl font-bold">For Security Companies</h2>

            <ul className="mt-6 space-y-4 text-slate-300">
              <li>✓ Fill open shifts faster</li>
              <li>✓ Reduce overtime costs</li>
              <li>✓ Access licensed officers</li>
              <li>✓ Cover last-minute callouts</li>
              <li>✓ Simplify staffing operations</li>
            </ul>
          </div>

          <div
            id="officers"
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-3xl font-bold">For Security Officers</h2>

            <ul className="mt-6 space-y-4 text-slate-300">
              <li>✓ Flexible schedules</li>
              <li>✓ More earning opportunities</li>
              <li>✓ Find shifts near you</li>
              <li>✓ Apply quickly</li>
              <li>✓ Build experience and reputation</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 md:flex-row">
          <p>© 2026 FlexOfficers. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>

            <a href="#" className="hover:text-white">
              Terms
            </a>

            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}