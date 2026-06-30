import { clerkClient } from "@clerk/nextjs/server";

export function normalizeEmail(email: string | null | undefined) {
  const trimmed = email?.trim();
  return trimmed || null;
}

export function resolveOfficerProfileEmail(
  storedEmail: string | null | undefined,
  clerkEmail: string | null | undefined
) {
  return normalizeEmail(storedEmail) ?? normalizeEmail(clerkEmail);
}

export async function syncUserEmailFromClerk(input: {
  userId: string;
  storedEmail: string | null | undefined;
  clerkEmail: string | null | undefined;
}) {
  const stored = normalizeEmail(input.storedEmail);
  if (stored) {
    return stored;
  }

  const clerk = normalizeEmail(input.clerkEmail);
  if (!clerk) {
    return null;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.update({
      where: {
        id: input.userId,
      },
      data: {
        email: clerk,
      },
    });

    return clerk;
  } catch {
    return null;
  }
}

export async function resolveOfficerNotificationEmail(input: {
  userId: string;
  clerkId: string;
  storedEmail: string | null | undefined;
}) {
  const stored = normalizeEmail(input.storedEmail);
  if (stored) {
    return stored;
  }

  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(input.clerkId);
    const clerkEmail = normalizeEmail(
      clerkUser.emailAddresses.find(
        (address) => address.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress
    );

    if (!clerkEmail) {
      return null;
    }

    return syncUserEmailFromClerk({
      userId: input.userId,
      storedEmail: input.storedEmail,
      clerkEmail,
    });
  } catch {
    return null;
  }
}
