export default function CompanyProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Company Profile</h1>

        <p className="mt-4 text-slate-300">
          Add your company details so officers can learn who they are applying
          to work with.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <form className="grid gap-6">
            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Company name"
            />

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Contact name"
            />

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Phone number"
            />

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Website"
            />

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

            <textarea
              className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Company description"
            />

            <button className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400">
              Save Company Profile
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}