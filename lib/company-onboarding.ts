import type { Prisma } from "@/app/generated/prisma/client";
import {
  getDefaultCompanyName,
  getDefaultTrialFields,
} from "@/lib/company-trial";

export async function ensureCompanyOnSignup(
  tx: Prisma.TransactionClient,
  input: {
    userId: string;
    email: string;
    firstName?: string | null;
    now?: Date;
  }
) {
  const existing = await tx.company.findUnique({
    where: { userId: input.userId },
    select: { id: true },
  });

  if (existing) {
    return existing;
  }

  const now = input.now ?? new Date();
  const trialFields = getDefaultTrialFields(now);

  return tx.company.create({
    data: {
      userId: input.userId,
      companyName: getDefaultCompanyName(input.email, input.firstName),
      email: input.email,
      ...trialFields,
    },
    select: { id: true },
  });
}
