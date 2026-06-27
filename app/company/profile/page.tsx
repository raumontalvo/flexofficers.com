import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import CompanyProfileForm from "./CompanyProfileForm";

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

  const initialForm = {
    logoUrl: company?.logoUrl ?? "",
    companyName: company?.companyName ?? "",
    contactName: company?.contactName ?? "",
    phone: company?.phone ?? "",
    email: company?.email ?? user?.email ?? clerkUser.emailAddresses[0]?.emailAddress ?? "",
    address: company?.address ?? "",
    website: company?.website ?? "",
  };

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <SectionHeading
        title="Company Profile"
        subtitle="Keep your company contact information ready for accepted officers."
      />

      <div className="mt-8">
        <CompanyProfileForm initialForm={initialForm} />
      </div>
    </PageShell>
  );
}
