import { UserRole } from "@/app/generated/prisma/enums";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import EditShiftForm from "./EditShiftForm";

export const dynamic = "force-dynamic";

function toDateTimeLocalValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function EditCompanyShiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clerkUser = await requirePageRole(UserRole.COMPANY);
  const { id } = await params;

  const shift = await prisma.shift.findFirst({
    where: {
      id,
      company: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    },
  });

  if (!shift) {
    notFound();
  }

  const initialForm = {
    title: shift.title,
    description: shift.description ?? "",
    location: shift.location,
    startTime: toDateTimeLocalValue(shift.startTime),
    endTime: toDateTimeLocalValue(shift.endTime),
    hourlyRate: shift.hourlyRate.toString(),
    requiredLicense: shift.requiredLicense,
    positionsNeeded: String(shift.positionsNeeded),
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/company/shifts"
          className="text-sm text-blue-300 hover:text-blue-200"
        >
          ← Back to Manage Shifts
        </Link>

        <h1 className="mt-6 text-4xl font-bold">Edit Shift</h1>

        <p className="mt-4 text-slate-300">
          Update this shift posting for your company.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <EditShiftForm shiftId={shift.id} initialForm={initialForm} />
        </div>
      </section>
    </main>
  );
}
