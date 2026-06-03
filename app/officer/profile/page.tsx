export default function OfficerProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Officer Profile</h1>

        <p className="mt-4 text-slate-300">
          Add your license, experience, location, and availability so companies
          can review your profile.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <form className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="First name"
              />

              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="Last name"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="City"
              />

              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
                placeholder="State"
              />
            </div>

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="License type, example: D License, G License"
            />

            <textarea
              className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Brief experience summary"
            />

            <button className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400">
              Save Officer Profile
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}