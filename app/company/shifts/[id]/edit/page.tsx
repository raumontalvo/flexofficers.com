import { UserRole } from "@/app/generated/prisma/enums";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, SectionHeading } from "@/components/ui";
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
    specialRequirements: shift.specialRequirements,
    reportingInstructions: shift.reportingInstructions ?? "",
    positionsNeeded: String(shift.positionsNeeded),
  };

  return (
    <PageShell nav="company" maxWidth="lg">
      <Link
        href="/company/shifts"
        className="inline-flex min-h-11 items-center text-sm font-medium text-fo-primary-hover hover:text-fo-primary-bright"
      >
        ← Back to Manage Shifts
      </Link>

      <div className="mt-4">
        <SectionHeading
          title="Edit Shift"
          subtitle="Update this shift posting for your company."
        />
      </div>

      <div className="mt-8">
        <EditShiftForm shiftId={shift.id} initialForm={initialForm} />
      </div>
    </PageShell>
  );
}
