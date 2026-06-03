export default function CreateShiftPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Post a Shift</h1>

        <p className="mt-4 text-slate-300">
          Create a security shift and make it available to qualified officers.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <form className="grid gap-6">
            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Shift Title"
            />

            <textarea
              className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Shift Description"
            />

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Location"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <input
                type="datetime-local"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              />

              <input
                type="datetime-local"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              />
            </div>

            <input
              type="number"
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Hourly Rate"
            />

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Required License"
            />

            <button className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400">
              Create Shift
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}