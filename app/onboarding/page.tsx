import { UserRole } from "@/app/generated/prisma/enums";
import { setRole } from "./actions/set-role";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-bold">Choose Your Role</h1>

        <p className="mt-4 text-slate-300">
          Tell us how you will use FlexOfficers.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold">Security Officer</h2>

            <p className="mt-4 text-slate-300">
              Browse shifts, apply for opportunities, and build your profile.
            </p>

            <form action={async () => {
              "use server";
              await setRole(UserRole.OFFICER);
            }}>
              <button className="mt-8 w-full rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400">
                Continue as Officer
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-bold">Security Company</h2>

            <p className="mt-4 text-slate-300">
              Post shifts, review applicants, and manage staffing needs.
            </p>

            <form action={async () => {
              "use server";
              await setRole(UserRole.COMPANY);
            }}>
              <button className="mt-8 w-full rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400">
                Continue as Company
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}