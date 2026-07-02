import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { resolveAuthenticatedUserRole } from "@/lib/page-rbac";

export async function getAuthenticatedOfficer() {
  const resolved = await resolveAuthenticatedUserRole();

  if (!resolved) {
    return { error: "unauthorized" as const };
  }

  if (resolved.role !== UserRole.OFFICER) {
    return { error: "forbidden" as const };
  }

  const officer = await prisma.officer.findFirst({
    where: {
      user: {
        clerkId: resolved.clerkUser.id,
        role: UserRole.OFFICER,
      },
    },
    select: {
      id: true,
      userId: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!officer) {
    return { error: "forbidden" as const };
  }

  return { clerkUser: resolved.clerkUser, officer };
}

export async function getAuthenticatedCompany() {
  const resolved = await resolveAuthenticatedUserRole();

  if (!resolved) {
    return { error: "unauthorized" as const };
  }

  if (resolved.role !== UserRole.COMPANY) {
    return { error: "forbidden" as const };
  }

  const company = await prisma.company.findFirst({
    where: {
      user: {
        clerkId: resolved.clerkUser.id,
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

  return { clerkUser: resolved.clerkUser, company };
}

export async function getAuthenticatedClient() {
  const resolved = await resolveAuthenticatedUserRole();

  if (!resolved) {
    return { error: "unauthorized" as const };
  }

  if (resolved.role !== UserRole.CLIENT) {
    return { error: "forbidden" as const };
  }

  const client = await prisma.client.findFirst({
    where: {
      user: {
        clerkId: resolved.clerkUser.id,
        role: UserRole.CLIENT,
      },
    },
    select: {
      id: true,
      userId: true,
      contactName: true,
      companyName: true,
      phone: true,
      email: true,
    },
  });

  if (!client) {
    return { error: "forbidden" as const };
  }

  return { clerkUser: resolved.clerkUser, client };
}

export async function getAuthenticatedActor() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    include: {
      officer: true,
      company: true,
      client: true,
    },
  });
}
