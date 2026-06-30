export function normalizePhotoUrl(
  photoUrl: string | null | undefined
): string | null {
  const trimmed = photoUrl?.trim();
  return trimmed || null;
}

export function shouldSyncClerkPhoto(
  storedPhotoUrl: string | null | undefined,
  clerkImageUrl: string | null | undefined
) {
  const clerk = normalizePhotoUrl(clerkImageUrl);
  if (!clerk) {
    return false;
  }

  const stored = normalizePhotoUrl(storedPhotoUrl);
  return !stored || stored !== clerk;
}

export function resolveSyncedPhotoUrl(
  storedPhotoUrl: string | null | undefined,
  clerkImageUrl: string | null | undefined
): string | null {
  const clerk = normalizePhotoUrl(clerkImageUrl);
  const stored = normalizePhotoUrl(storedPhotoUrl);

  if (clerk && shouldSyncClerkPhoto(stored, clerk)) {
    return clerk;
  }

  return stored;
}

export async function syncOfficerProfilePhotoFromClerk(input: {
  officerId: string;
  profilePhotoUrl: string | null | undefined;
  clerkImageUrl: string | null | undefined;
}) {
  const { prisma } = await import("@/lib/prisma");
  const nextUrl = resolveSyncedPhotoUrl(
    input.profilePhotoUrl,
    input.clerkImageUrl
  );
  const currentUrl = normalizePhotoUrl(input.profilePhotoUrl);

  if (nextUrl && nextUrl !== currentUrl) {
    await prisma.officer.update({
      where: {
        id: input.officerId,
      },
      data: {
        profilePhotoUrl: nextUrl,
      },
    });
  }

  return nextUrl;
}

export async function syncCompanyLogoFromClerk(input: {
  companyId: string;
  logoUrl: string | null | undefined;
  clerkImageUrl: string | null | undefined;
}) {
  const { prisma } = await import("@/lib/prisma");
  const nextUrl = resolveSyncedPhotoUrl(input.logoUrl, input.clerkImageUrl);
  const currentUrl = normalizePhotoUrl(input.logoUrl);

  if (nextUrl && nextUrl !== currentUrl) {
    await prisma.company.update({
      where: {
        id: input.companyId,
      },
      data: {
        logoUrl: nextUrl,
      },
    });
  }

  return nextUrl;
}
