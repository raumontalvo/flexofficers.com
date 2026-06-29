import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedCompany() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { error: "unauthorized" as const };
  }

  const company = await prisma.company.findFirst({
    where: {
      user: {
        clerkId: clerkUser.id,
        role: UserRole.COMPANY,
      },
    },
    select: {
      id: true,
      companyName: true,
      userId: true,
    },
  });

  if (!company) {
    return { error: "forbidden" as const };
  }

  return { clerkUser, company };
}
