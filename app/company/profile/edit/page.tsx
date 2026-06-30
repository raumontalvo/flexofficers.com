import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { CompanyProfileEditForm } from "@/components/company/company-profile-edit-form";
import { PageShell } from "@/components/ui";
import { companyHasPublicProfile } from "@/lib/company-profile-page-data";
import { buildCompanyProfileEditFormState } from "@/lib/company-profile-edit-data";
import { syncCompanyLogoFromClerk } from "@/lib/clerk-photo-sync";
import { stripCompanyProfileMeta } from "@/lib/company-profile-meta";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditCompanyProfilePage() {
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

  const logoUrl =
    (await syncCompanyLogoFromClerk({
      companyId: company.id,
      logoUrl: company.logoUrl,
      clerkImageUrl: clerkUser.imageUrl,
    })) ?? "";

  const initialForm = {
    ...buildCompanyProfileEditFormState({
      company,
      userEmail: user.email,
      shifts,
      hasPublicProfile: companyHasPublicProfile({
        companyName: company.companyName,
        description: stripCompanyProfileMeta(company.description),
        city: company.city,
        state: company.state,
        website: company.website,
      }),
    }),
    logoUrl,
  };

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-fo-text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/dashboard" className="transition hover:text-fo-primary-hover">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <Link
              href="/company/profile"
              className="transition hover:text-fo-primary-hover"
            >
              Company Profile
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="text-fo-text">Edit Profile</li>
        </ol>
      </nav>

      <CompanyProfileEditForm initialForm={initialForm} />
    </PageShell>
  );
}
