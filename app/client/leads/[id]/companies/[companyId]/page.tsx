import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyProfileView } from "@/components/company/company-profile-view";
import { buttonClassName, PageShell } from "@/components/ui";
import { serializeCompanyProfile } from "@/lib/company-profile-page-data";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string; companyId: string }>;
};

export default async function ClientCompanyProfilePage({ params }: PageProps) {
  await requirePageRole(UserRole.CLIENT);
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return null;
  }

  const { id: leadId, companyId } = await params;

  const application = await prisma.securityLeadApplication.findFirst({
    where: {
      securityLeadId: leadId,
      companyId,
      securityLead: { clientId: auth.client.id },
    },
  });

  if (!application) {
    notFound();
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: { select: { email: true } },
      shifts: { select: { requirements: true }, take: 1 },
    },
  });

  if (!company) {
    notFound();
  }

  const profile = serializeCompanyProfile({
    company,
    userEmail: company.user.email,
    shifts: company.shifts,
    showContactDetails: application.status === "ACCEPTED",
  });

  return (
    <PageShell nav="client" sidebar maxWidth="full">
      <div className="space-y-5">
        <Link
          href={`/client/leads/${leadId}/applicants`}
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "self-start",
          })}
        >
          Back to Applicants
        </Link>
        <CompanyProfileView profile={profile} mode="public" />
      </div>
    </PageShell>
  );
}
