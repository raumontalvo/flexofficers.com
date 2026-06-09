import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import OnboardingRoleChoice from "./OnboardingRoleChoice";

type OnboardingPageProps = {
  searchParams?: Promise<{
    force?: string;
    role?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  const forceRoleChoice = params?.force === "1";
  const selectedRole =
    params?.role === UserRole.OFFICER || params?.role === UserRole.COMPANY
      ? params.role
      : null;

  const clerkUser = await currentUser();

  if (clerkUser && !forceRoleChoice && !selectedRole) {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        role: true,
      },
    });

    if (user?.role === UserRole.ADMIN) {
      redirect("/admin");
    }

    if (user?.role === UserRole.OFFICER || user?.role === UserRole.COMPANY) {
      redirect("/dashboard");
    }
  }

  return <OnboardingRoleChoice initialRole={selectedRole} />;
}