import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ApplicationStatus } from "@/app/generated/prisma/enums";
import { CompanyProfileView } from "@/components/company/company-profile-view";
import { PageShell } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { serializePublicCompanyProfile } from "@/lib/public-company-profile";

export const dynamic = "force-dynamic";

export default async function PublicCompanyProfilePage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const clerkUser = await currentUser();

  const [company, shifts, acceptedApplication] = await Promise.all([
    prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    }),
    prisma.shift.findMany({
      where: {
        companyId,
      },
      select: {
        requirements: true,
      },
    }),
    // Backend authorization: contact details are only released to an officer
    // who has an ACCEPTED application for one of this company's shifts.
    clerkUser
      ? prisma.application.findFirst({
          where: {
            status: ApplicationStatus.ACCEPTED,
            shift: {
              companyId,
            },
            officer: {
              user: {
                clerkId: clerkUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        })
      : Promise.resolve(null),
  ]);

  if (!company) {
    notFound();
  }

  const canViewContactDetails = Boolean(acceptedApplication);

  const profile = serializePublicCompanyProfile(company, shifts, {
    showContactDetails: canViewContactDetails,
    userEmail: company.user.email,
  });

  if (!profile) {
    notFound();
  }

  return (
    <PageShell nav="officer" maxWidth="full" sidebar>
      <CompanyProfileView
        profile={profile}
        mode="public"
        backHref="/shifts"
        backLabel="← Back to available shifts"
      />
    </PageShell>
  );
}
