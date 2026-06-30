import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { buttonClassName, PageShell } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import {
  fromShiftArmedRequirement,
  fromShiftWorkType,
} from "@/lib/shift-form-options";
import { shiftToPostShiftFormValues } from "@/lib/shift-create-form";
import EditShiftForm from "./EditShiftForm";

export const dynamic = "force-dynamic";

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

  const initialForm = shiftToPostShiftFormValues({
    title: shift.title,
    description: shift.description,
    location: shift.location,
    city: shift.city,
    state: shift.state,
    startTime: shift.startTime,
    endTime: shift.endTime,
    hourlyRate: shift.hourlyRate,
    workType: fromShiftWorkType(shift.workType),
    requirements: shift.requirements,
    otherRequirements: shift.otherRequirements,
    armedRequirement: fromShiftArmedRequirement(shift.armedRequirement),
    positionsNeeded: shift.positionsNeeded,
    visibility: shift.visibility === "STAFF_ONLY" ? "STAFF_ONLY" : "PUBLIC",
  });

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <div className="space-y-5">
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-fo-text-muted"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/dashboard"
                className="transition hover:text-fo-primary-hover"
              >
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link
                href="/company/shifts"
                className="transition hover:text-fo-primary-hover"
              >
                My Shifts
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-fo-text">Edit Shift</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
              Edit Shift
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fo-text-muted">
              Update the details below and save your changes.
            </p>
          </div>

          <Link
            href="/company/shifts"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0 self-start",
            })}
          >
            Back to My Shifts
          </Link>
        </div>

        <EditShiftForm
          shiftId={shift.id}
          initialForm={initialForm}
          reportingInstructions={shift.reportingInstructions}
        />
      </div>
    </PageShell>
  );
}
