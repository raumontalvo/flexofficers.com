import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import type { OfficerAcceptedShiftData } from "@/lib/officer-accepted-shift-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { UpcomingShiftsBrowseList } from "./UpcomingShiftsBrowseList";

export const dynamic = "force-dynamic";

function displayEmail(companyEmail: string | null | undefined, userEmail: string) {
  return companyEmail || userEmail;
}

export default async function OfficerUpcomingShiftsPage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const applications = await prisma.application.findMany({
    where: {
      status: ApplicationStatus.ACCEPTED,
      officer: {
        user: {
          clerkId: clerkUser.id,
        },
      },
    },
    include: {
      shift: {
        include: {
          company: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      shift: {
        startTime: "asc",
      },
    },
  });

  const acceptedShiftData: OfficerAcceptedShiftData[] = applications.map(
    (application) => ({
      id: application.id,
      shift: {
        id: application.shift.id,
        title: application.shift.title,
        hourlyRate: application.shift.hourlyRate.toString(),
        location: application.shift.location,
        city: application.shift.city,
        state: application.shift.state,
        startTime: application.shift.startTime.toISOString(),
        endTime: application.shift.endTime.toISOString(),
        shiftTimeType: application.shift.shiftTimeType,
        requirements: application.shift.requirements,
        otherRequirements: application.shift.otherRequirements,
        specialRequirements: application.shift.specialRequirements,
        status: application.shift.status,
        reportingInstructions: application.shift.reportingInstructions,
      },
      company: {
        companyName: application.shift.company.companyName,
        contactName: application.shift.company.contactName,
        phone: application.shift.company.phone,
        email: displayEmail(
          application.shift.company.email,
          application.shift.company.user.email
        ),
      },
    })
  );

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar>
      <UpcomingShiftsBrowseList applications={acceptedShiftData} />
    </PageShell>
  );
}
