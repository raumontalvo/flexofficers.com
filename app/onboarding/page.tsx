import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import OnboardingRoleChoice from "./OnboardingRoleChoice";

export default async function OnboardingPage() {
  const clerkUser = await currentUser();

  if (clerkUser) {
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

  return <OnboardingRoleChoice />;
}