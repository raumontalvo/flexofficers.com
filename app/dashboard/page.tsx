import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  const user = clerkUser
    ? await prisma.user.findUnique({
        where: {
          clerkId: clerkUser.id,
        },
        include: {
          officer: {
            include: {
              licenses: true,
            },
          },
          company: true,
          notifications: {
            where: {
              read: false,
            },
          },
        },
      })
    : null;

  const role = user?.role;

  if (role === "ADMIN") {
    redirect("/admin");
  }

  const unreadCount = user?.notifications.length ?? 0;

  const officerMissingItems =
    role === "OFFICER"
      ? [
          !user?.officer?.city || !user?.officer?.state
            ? "Add your city and state"
            : null,
          !user?.officer?.bio ? "Add your experience summary" : null,
          !user?.officer?.licenses.length ? "Add at least one license" : null,
        ].filter(Boolean)
      : [];

  const companyMissingItems =
    role === "COMPANY"
      ? [
          !user?.company?.companyName ? "Add your company name" : null,
          !user?.company?.city || !user?.company?.state
            ? "Add your company city and state"
            : null,
          !user?.company?.licenseType ? "Add your company license type" : null,
          !user?.company?.licenseNumber
            ? "Add your company license number"
            : null,
          !user?.company?.licenseState
            ? "Add your company license issuing state"
            : null,
        ].filter(Boolean)
      : [];

  const missingItems =
    role === "OFFICER" ? officerMissingItems : companyMissingItems;

  const profileLink =
    role === "OFFICER" ? "/officer/profile" : "/company/profile";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <p className="mt-4 text-slate-300">
              Welcome{clerkUser?.firstName ? `, ${clerkUser.firstName}` : ""}.
              Manage your FlexOfficers marketplace activity.
            </p>
          </div>

          <DashboardSignOutButton />
        </div>

        {!role && (
          <div className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <h2 className="text-2xl font-bold">Complete onboarding</h2>

            <p className="mt-3 text-yellow-100">
              Choose whether you are joining as an officer or a company before
              using the dashboard.
            </p>

            <Link
              href="/onboarding"
              className="mt-5 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-slate-950 hover:bg-yellow-400"
            >
              Go to Onboarding
            </Link>
          </div>
        )}

        {role && missingItems.length > 0 && (
          <div className="mt-10 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <h2 className="text-2xl font-bold">Complete your profile</h2>

            <p className="mt-3 text-yellow-100">
              Finish these items so your account is ready:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-yellow-100">
              {missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <Link
              href={profileLink}
              className="mt-5 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-slate-950 hover:bg-yellow-400"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {role === "OFFICER" && (
          <>
            <h2 className="mt-12 text-2xl font-bold">Officer Tools</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Link
                href="/officer/profile"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Officer Profile</h3>
                <p className="mt-3 text-slate-300">
                  Manage licenses, experience, and availability.
                </p>
              </Link>

              <Link
                href="/shifts"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Available Shifts</h3>
                <p className="mt-3 text-slate-300">
                  Browse and apply to open shifts.
                </p>
              </Link>

              <Link
                href="/officer/applications"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">My Applications</h3>
                <p className="mt-3 text-slate-300">
                  Track application status and decisions.
                </p>
              </Link>

              <Link
                href="/notifications"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Notifications</h3>
                <p className="mt-3 text-slate-300">Unread: {unreadCount}</p>
              </Link>
            </div>
          </>
        )}

        {role === "COMPANY" && (
          <>
            <h2 className="mt-12 text-2xl font-bold">Company Tools</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Link
                href="/company/profile"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Company Profile</h3>
                <p className="mt-3 text-slate-300">
                  Manage company information.
                </p>
              </Link>

              <Link
                href="/shifts/create"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Post a Shift</h3>
                <p className="mt-3 text-slate-300">
                  Create new security opportunities.
                </p>
              </Link>

              <Link
                href="/company/shifts"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Manage Shifts</h3>
                <p className="mt-3 text-slate-300">
                  View, cancel, and delete shifts your company posted.
                </p>
              </Link>

              <Link
                href="/company/applications"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Applicants</h3>
                <p className="mt-3 text-slate-300">
                  Review and manage applicants.
                </p>
              </Link>

              <Link
                href="/notifications"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">Notifications</h3>
                <p className="mt-3 text-slate-300">Unread: {unreadCount}</p>
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}