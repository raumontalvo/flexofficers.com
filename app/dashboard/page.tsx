import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { dashboardUserSelect, companyDashboardSelect } from "@/lib/officer-fields";
import { getCompanyProfileCompletion } from "@/lib/company-profile-completion";
import { syncCompanyLogoFromClerk, syncOfficerProfilePhotoFromClerk } from "@/lib/clerk-photo-sync";
import { ensureCompanyOnSignup } from "@/lib/company-onboarding";
import { getTrialStartUpdateIfEligible } from "@/lib/company-trial";
import { prisma } from "@/lib/prisma";
import CompanyDashboard from "./CompanyDashboard";
import { DashboardSetupState } from "./DashboardSetupState";
import OfficerDashboard from "./OfficerDashboard";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: dashboardUserSelect,
  });

  if (!user?.role) {
    return (
      <DashboardSetupState
        firstName={clerkUser.firstName}
        variant="onboarding"
      />
    );
  }

  if (user.role === UserRole.ADMIN) {
    redirect("/admin");
  }

  if (user.role === UserRole.COMPANY) {
    let company = user.company;

    if (!company) {
      await prisma.$transaction(async (tx) => {
        await ensureCompanyOnSignup(tx, {
          userId: user.id,
          email: user.email,
          firstName: clerkUser.firstName,
        });
      });

      const refreshedUser = await prisma.user.findUnique({
        where: {
          clerkId: clerkUser.id,
        },
        select: dashboardUserSelect,
      });

      company = refreshedUser?.company ?? null;
    }

    if (!company) {
      return (
        <DashboardSetupState
          firstName={clerkUser.firstName}
          variant="company-profile"
        />
      );
    }

    const trialUpdate = getTrialStartUpdateIfEligible(company);
    if (Object.keys(trialUpdate).length > 0) {
      company = await prisma.company.update({
        where: { id: company.id },
        data: trialUpdate,
        select: companyDashboardSelect,
      });
    }

    const logoUrl =
      (await syncCompanyLogoFromClerk({
        companyId: company.id,
        logoUrl: company.logoUrl,
        clerkImageUrl: clerkUser.imageUrl,
      })) ?? "";

    const profileCompletion = getCompanyProfileCompletion(company, user.email);

    return (
      <CompanyDashboard
        firstName={clerkUser.firstName}
        logoUrl={logoUrl}
        company={company}
        profileCompletion={profileCompletion}
      />
    );
  }

  if (user.role === UserRole.OFFICER) {
    if (user.officer && clerkUser.imageUrl) {
      await syncOfficerProfilePhotoFromClerk({
        officerId: user.officer.id,
        profilePhotoUrl: user.officer.profilePhotoUrl,
        clerkImageUrl: clerkUser.imageUrl,
      });
    }

    if (!user.officer) {
      return (
        <DashboardSetupState
          firstName={clerkUser.firstName}
          variant="officer-profile"
        />
      );
    }

    return (
      <OfficerDashboard
        firstName={clerkUser.firstName}
        fullName={clerkUser.fullName}
        imageUrl={clerkUser.imageUrl}
        officer={user.officer}
      />
    );
  }

  return (
    <DashboardSetupState
      firstName={clerkUser.firstName}
      variant="onboarding"
    />
  );
}
