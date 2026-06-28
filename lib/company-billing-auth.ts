import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { companyDashboardSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedCompanyForBilling() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { error: "unauthorized" as const };
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      email: true,
      role: true,
      company: {
        select: companyDashboardSelect,
      },
    },
  });

  if (!user || user.role !== UserRole.COMPANY || !user.company) {
    return { error: "forbidden" as const };
  }

  return {
    clerkUserId: clerkUser.id,
    user,
    company: user.company,
  };
}
