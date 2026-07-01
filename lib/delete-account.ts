import type { Prisma } from "@/app/generated/prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type TransactionClient = Prisma.TransactionClient;

async function deleteOfficerData(tx: TransactionClient, officerId: string) {
  await tx.application.deleteMany({ where: { officerId } });
  await tx.shiftInvite.deleteMany({ where: { officerId } });
  await tx.companyStaff.deleteMany({ where: { officerId } });
  await tx.license.deleteMany({ where: { officerId } });
  await tx.officer.delete({ where: { id: officerId } });
}

async function deleteCompanyData(tx: TransactionClient, companyId: string) {
  const shifts = await tx.shift.findMany({
    where: { companyId },
    select: { id: true },
  });
  const shiftIds = shifts.map((shift) => shift.id);

  if (shiftIds.length > 0) {
    await tx.application.deleteMany({ where: { shiftId: { in: shiftIds } } });
    await tx.shiftInvite.deleteMany({ where: { shiftId: { in: shiftIds } } });
    await tx.shift.deleteMany({ where: { companyId } });
  }

  await tx.companyStaff.deleteMany({ where: { companyId } });
  await tx.company.delete({ where: { id: companyId } });
}

export async function deleteAppUserDataByClerkId(clerkId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { clerkId },
      include: {
        officer: { select: { id: true } },
        company: { select: { id: true } },
      },
    });

    if (!user) {
      return { deleted: false as const, reason: "not_found" as const };
    }

    await tx.notification.deleteMany({ where: { userId: user.id } });

    if (user.officer) {
      await deleteOfficerData(tx, user.officer.id);
    }

    if (user.company) {
      await deleteCompanyData(tx, user.company.id);
    }

    await tx.user.delete({ where: { id: user.id } });

    return { deleted: true as const, userId: user.id };
  });
}

export async function deleteClerkUser(clerkId: string) {
  const client = await clerkClient();
  await client.users.deleteUser(clerkId);
}

export async function deleteAccount(clerkId: string) {
  const result = await deleteAppUserDataByClerkId(clerkId);

  if (!result.deleted) {
    return result;
  }

  await deleteClerkUser(clerkId);

  return { deleted: true as const, userId: result.userId };
}
