import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import ApplyButton from "../ApplyButton";

export const dynamic = "force-dynamic";

export default async function ShiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const shift = await prisma.shift.findUnique({
    where: {
      id,
    },
    include: {
      applications: {
        where: {
          status: ApplicationStatus.ACCEPTED,
        },
      },
      company: true,
    },
  });

  if (!shift) {
    notFound();
  }

  const filledCount = shift.applications.length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/shifts"
          className="text-sm text-blue-300 hover:text-blue-200"
        >
          ← Back to available shifts
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            Shift Details
          </p>

          <h1 className="mt-3 text-4xl font-bold">{shift.title}</h1>

          <p className="mt-4 text-slate-300">{shift.location}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full bg-white/10 px-3 py-1">
              ${shift.hourlyRate.toString()}/hr
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1">
              {shift.requiredLicense}
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1">
              {filledCount} of {shift.positionsNeeded} filled
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1">
              {shift.status}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h2 className="font-semibold">Start Time</h2>
              <p className="mt-2 text-slate-300">
                {shift.startTime.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <h2 className="font-semibold">End Time</h2>
              <p className="mt-2 text-slate-300">
                {shift.endTime.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h2 className="font-semibold">Company</h2>

            <p className="mt-3 text-slate-300">
              {shift.company.companyName}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">
                {shift.company.city || "City not provided"},{" "}
                {shift.company.state || "State not provided"}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1">
                License: {shift.company.licenseType || "Not provided"}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1">
                License #: {shift.company.licenseNumber || "Not provided"}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1">
                Issuing state: {shift.company.licenseState || "Not provided"}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h2 className="font-semibold">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-300">
              {shift.description || "No description provided."}
            </p>
          </div>

          <div className="mt-8">
            <ApplyButton shiftId={shift.id} />
          </div>
        </div>
      </section>
    </main>
  );
}