import { notFound } from "next/navigation";
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

  const [company, shifts] = await Promise.all([
    prisma.company.findUnique({
      where: {
        id: companyId,
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
  ]);

  if (!company) {
    notFound();
  }

  const profile = serializePublicCompanyProfile(company, shifts);

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
