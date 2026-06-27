import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { dashboardUserSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import CompanyDashboard from "./CompanyDashboard";
import { DashboardSetupState } from "./DashboardSetupState";
import OfficerDashboard from "./OfficerDashboard";

function getCompanyMissingItems(
  company: {
    companyName: string | null;
    contactName: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  } | null | undefined,
  userEmail: string
) {
  return [
    !company?.companyName ? "Add your company name" : null,
    !company?.contactName ? "Add your contact person" : null,
    !company?.phone ? "Add your company phone number" : null,
    !company?.email && !userEmail ? "Add your company email" : null,
    !company?.address ? "Add your company address" : null,
  ].filter((item): item is string => Boolean(item));
}

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

    return (
      <CompanyDashboard
        firstName={clerkUser.firstName}
        company={user.company}
        missingItems={getCompanyMissingItems(user.company, user.email)}
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
