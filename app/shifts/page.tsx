import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { TranslatedPageHeader } from "@/components/i18n/translated-page-header";
import { TranslatedSectionHeading } from "@/components/i18n/translated-section-heading";
import { PageShell } from "@/components/ui";
import { applicationIdOnlySelect, officerBrowseShiftSelect } from "@/lib/application-fields";
import { prisma } from "@/lib/prisma";
import type { ShiftCardData } from "@/lib/shift-card-data";
import { ShiftsBrowseList } from "./ShiftsBrowseList";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { officerProfileCompletionSelect } from "@/lib/officer-fields";
import { isOfficerProfileComplete } from "@/lib/officer-profile-completion";
import { buildOfficerBrowseShiftsWhere } from "@/lib/company-staff";

export const dynamic = "force-dynamic";

export default async function ShiftsPage() {
  const clerkUser = await currentUser();

  const [shifts, user] = await Promise.all([
    prisma.shift.findMany({
      where: buildOfficerBrowseShiftsWhere(null),
      select: {
        ...officerBrowseShiftSelect,
        applications: {
          where: {
            status: ApplicationStatus.ACCEPTED,
          },
          select: applicationIdOnlySelect,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    clerkUser
      ? prisma.user.findUnique({
          where: { clerkId: clerkUser.id },
          select: {
            role: true,
            officer: {
              select: officerProfileCompletionSelect,
            },
          },
        })
      : Promise.resolve(null),
  ]);

  const browseShifts: ShiftCardData[] = shifts.map((shift) => ({
    id: shift.id,
    title: shift.title,
    hourlyRate: shift.hourlyRate.toString(),
    companyName: shift.company.companyName,
    location: shift.location,
    city: shift.city,
    state: shift.state,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime.toISOString(),
    createdAt: shift.createdAt.toISOString(),
    positionsNeeded: shift.positionsNeeded,
    filledCount: shift.applications.length,
    workType: shift.workType,
    shiftTimeType: shift.shiftTimeType,
    armedRequirement: shift.armedRequirement,
    requirements: shift.requirements,
    otherRequirements: shift.otherRequirements,
    specialRequirements: shift.specialRequirements,
    status: shift.status,
  }));

  const showProfileApplyNotice =
    user?.role === UserRole.OFFICER &&
    !isOfficerProfileComplete(user.officer ?? null);

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar contentClassName="!pt-2 md:!pt-5">
      <TranslatedPageHeader
        page="shifts"
        className="md:hidden"
        titleClassName="text-xl lg:text-xl"
        subtitleClassName="text-sm leading-snug lg:text-sm"
      />

      <TranslatedSectionHeading page="shifts" className="hidden md:flex" />

      <div className="mt-2 md:mt-3">
        <ShiftsBrowseList
          shifts={browseShifts}
          showProfileApplyNotice={showProfileApplyNotice}
          officer={user?.officer ?? null}
        />
      </div>
    </PageShell>
  );
}
