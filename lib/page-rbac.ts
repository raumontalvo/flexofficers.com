import { currentUser, type User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import {
  getRequiredRoleForPath,
  getRoleHomePath,
  isPathAllowedForRole,
  parseClerkMetadataRole,
} from "@/lib/rbac-paths";
import { prisma } from "@/lib/prisma";

export {
  getRequiredRoleForPath,
  getRoleHomePath,
  isClientPublicPath,
  isPathAllowedForRole,
} from "@/lib/rbac-paths";

export function getClerkMetadataRole(clerkUser: User): UserRole | null {
  return parseClerkMetadataRole(clerkUser.publicMetadata?.role);
}

export async function resolveAuthenticatedUserRole() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      role: true,
    },
  });

  return {
    clerkUser,
    role: user?.role ?? getClerkMetadataRole(clerkUser),
  };
}

export function redirectToRoleHome(role: UserRole | null | undefined): never {
  if (!role) {
    redirect("/onboarding");
  }

  redirect(getRoleHomePath(role));
}

export async function requirePageRole(role: UserRole) {
  const resolved = await resolveAuthenticatedUserRole();

  if (!resolved) {
    redirect("/sign-in");
  }

  if (!resolved.role) {
    redirect("/onboarding");
  }

  if (resolved.role !== role) {
    redirectToRoleHome(resolved.role);
  }

  return resolved.clerkUser;
}

export async function requirePageAccess(pathname: string) {
  const resolved = await resolveAuthenticatedUserRole();

  if (!resolved) {
    redirect("/sign-in");
  }

  if (!resolved.role) {
    redirect("/onboarding");
  }

  if (pathname === "/dashboard") {
    if (
      resolved.role === UserRole.ADMIN ||
      resolved.role === UserRole.CLIENT
    ) {
      redirectToRoleHome(resolved.role);
    }

    if (
      resolved.role !== UserRole.COMPANY &&
      resolved.role !== UserRole.OFFICER
    ) {
      redirect("/onboarding");
    }

    return resolved.clerkUser;
  }

  const requiredRole = getRequiredRoleForPath(pathname);

  if (requiredRole && resolved.role !== requiredRole) {
    redirectToRoleHome(resolved.role);
  }

  if (requiredRole === null && !isPathAllowedForRole(resolved.role, pathname)) {
    redirectToRoleHome(resolved.role);
  }

  return resolved.clerkUser;
}

export async function requireApiRole(role: UserRole) {
  const resolved = await resolveAuthenticatedUserRole();

  if (!resolved) {
    return { error: "unauthorized" as const };
  }

  if (!resolved.role) {
    return { error: "forbidden" as const };
  }

  if (resolved.role !== role) {
    return { error: "forbidden" as const };
  }

  return {
    clerkUser: resolved.clerkUser,
    role: resolved.role,
  };
}

export async function requireApiAdmin() {
  const auth = await requireApiRole(UserRole.ADMIN);

  if ("error" in auth) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: auth.clerkUser.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return user;
}
