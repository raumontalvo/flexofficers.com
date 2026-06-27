import { UserRole } from "@/app/generated/prisma/enums";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import {
  fromShiftArmedRequirement,
  fromShiftTimeType,
  fromShiftWorkType,
} from "@/lib/shift-form-options";
import { parseShiftRequirementChips } from "@/lib/shift-requirements";
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

  const knownRequirements = new Set([
    "D License",
    "G License",
    "K9",
    "Firearms",
    "CPR",
    "AED",
  ]);
  const parsedRequirements = parseShiftRequirementChips(shift.specialRequirements, 20);
  const requirements =
    shift.requirements.length > 0
      ? shift.requirements
      : parsedRequirements.filter((entry) => knownRequirements.has(entry));
  const otherRequirements =
    shift.otherRequirements ??
    (shift.requirements.length === 0
      ? parsedRequirements.filter((entry) => !knownRequirements.has(entry)).join(", ")
      : "");

  const initialForm = {
    title: shift.title,
    description: shift.description ?? "",
    city: shift.city ?? "",
    state: shift.state ?? "",
    location: shift.location,
    startTime: toDateTimeLocalValue(shift.startTime),
    endTime: toDateTimeLocalValue(shift.endTime),
    hourlyRate: shift.hourlyRate.toString(),
    workType: fromShiftWorkType(shift.workType),
    shiftTimeType: fromShiftTimeType(shift.shiftTimeType),
    armedRequirement: fromShiftArmedRequirement(shift.armedRequirement),
    requirements,
    otherRequirements,
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
