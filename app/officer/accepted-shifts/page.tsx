import Link from "next/link";
import { ApplicationStatus, UserRole } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { AcceptedShiftCard } from "./AcceptedShiftCard";

export const dynamic = "force-dynamic";

function displayEmail(companyEmail: string | null | undefined, userEmail: string) {
  return companyEmail || userEmail;
}

export default async function OfficerAcceptedShiftsPage() {
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
      appliedAt: "desc",
    },
  });

  return (
    <PageShell nav="officer" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Accepted Shifts"
        subtitle="Company contact details unlock after acceptance."
        action={
          <Link
            href="/officer/applications"
            className={buttonClassName({ variant: "secondary", size: "md" })}
          >
            My Shifts
          </Link>
        }
      />

      {applications.length > 0 ? (
        <Card variant="muted" className="mt-6">
          <p className="text-sm leading-relaxed text-fo-text-muted">
            These companies have accepted your application. Contact them
            directly to confirm shift details, arrival instructions, and any
            site-specific requirements.
          </p>
        </Card>
      ) : null}

      <div className="mt-8 space-y-4">
        {applications.length === 0 ? (
          <Card variant="muted" className="text-center">
            <p className="text-lg font-medium text-fo-text">
              You do not have any accepted shifts yet.
            </p>
            <p className="mt-2 text-sm text-fo-text-muted">
              Apply to open shifts and check back here once a company accepts
              you.
            </p>
            <Link
              href="/shifts"
              className={buttonClassName({
                fullWidth: true,
                className: "mt-6 w-full sm:w-auto",
              })}
            >
              Browse Available Shifts
            </Link>
          </Card>
        ) : (
          applications.map((application) => {
            const { shift } = application;
            const { company } = shift;

            return (
              <AcceptedShiftCard
                key={application.id}
                shiftId={shift.id}
                title={shift.title}
                hourlyRate={shift.hourlyRate}
                companyName={company.companyName}
                contactName={company.contactName}
                phone={company.phone}
                email={displayEmail(company.email, company.user.email)}
                address={company.address}
                website={company.website}
                location={shift.location}
                startTime={shift.startTime}
                endTime={shift.endTime}
                positionsNeeded={shift.positionsNeeded}
                specialRequirements={shift.specialRequirements}
                reportingInstructions={shift.reportingInstructions}
                shiftStatus={shift.status}
              />
            );
          })
        )}
      </div>
    </PageShell>
  );
}
