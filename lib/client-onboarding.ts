import type { Prisma } from "@/app/generated/prisma/client";

export function getDefaultClientName(
  email: string,
  firstName?: string | null
) {
  const trimmedFirst = firstName?.trim();

  if (trimmedFirst) {
    return trimmedFirst;
  }

  const localPart = email.split("@")[0]?.trim();

  if (localPart) {
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  return "Client";
}

export async function ensureClientOnSignup(
  tx: Prisma.TransactionClient,
  input: {
    userId: string;
    email: string;
    firstName?: string | null;
  }
) {
  const existing = await tx.client.findUnique({
    where: { userId: input.userId },
    select: { id: true },
  });

  if (existing) {
    return existing;
  }

  return tx.client.create({
    data: {
      userId: input.userId,
      contactName: getDefaultClientName(input.email, input.firstName),
      email: input.email,
    },
    select: { id: true },
  });
}
