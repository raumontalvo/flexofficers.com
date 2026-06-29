import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { dashboardUserSelect } from "@/lib/officer-fields";
import { getCompanyProfileCompletion } from "@/lib/company-profile-completion";
import { resolveProfilePhotoUrl } from "@/lib/profile-photo";
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
    if (!user.company) {
      return (
        <DashboardSetupState
          firstName={clerkUser.firstName}
          variant="company-profile"
        />
      );
    }

    const profileCompletion = getCompanyProfileCompletion(
      user.company,
      user.email
    );

    return (
      <CompanyDashboard
        firstName={clerkUser.firstName}
        logoUrl={resolveProfilePhotoUrl(
          user.company.logoUrl,
          clerkUser.imageUrl
        )}
        company={user.company}
        profileCompletion={profileCompletion}
      />
    );
  }

  if (user.role === UserRole.OFFICER) {
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
