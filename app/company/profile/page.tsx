import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyProfilePageContent } from "@/components/company/company-profile-page-content";
import { PageShell } from "@/components/ui";
import { serializeCompanyProfile } from "@/lib/company-profile-page-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    include: {
      company: true,
    },
  });

  const company = user?.company;

  if (!company) {
    return (
      <PageShell nav="company" maxWidth="full" sidebar>
        <p className="text-sm text-fo-text-muted">Company profile not found.</p>
      </PageShell>
    );
  }

  const shifts = await prisma.shift.findMany({
    where: {
      companyId: company.id,
    },
    select: {
      requirements: true,
    },
  });

  const profile = serializeCompanyProfile({
    company,
    userEmail: user.email,
    shifts,
    showContactDetails: true,
  });

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <CompanyProfilePageContent profile={profile} />
    </PageShell>
  );
}
