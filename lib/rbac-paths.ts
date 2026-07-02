import { UserRole } from "@/app/generated/prisma/enums";

const CLIENT_PUBLIC_PATHS = new Set(["/client/sign-in", "/client/sign-up"]);

export function isClientPublicPath(pathname: string) {
  return CLIENT_PUBLIC_PATHS.has(pathname);
}

export function getRoleHomePath(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin";
    case UserRole.CLIENT:
      return "/client";
    case UserRole.COMPANY:
      return "/company";
    case UserRole.OFFICER:
      return "/officer";
    default:
      return "/onboarding";
  }
}

export function isPathAllowedForRole(role: UserRole, pathname: string) {
  if (role === UserRole.ADMIN) {
    return pathname.startsWith("/admin");
  }

  if (role === UserRole.CLIENT) {
    return pathname.startsWith("/client") && !isClientPublicPath(pathname);
  }

  if (role === UserRole.COMPANY) {
    return (
      pathname.startsWith("/company") ||
      pathname === "/dashboard" ||
      pathname.startsWith("/shifts/create")
    );
  }

  if (role === UserRole.OFFICER) {
    return (
      pathname.startsWith("/officer") ||
      pathname === "/dashboard" ||
      pathname === "/shifts" ||
      (pathname.startsWith("/shifts/") && !pathname.startsWith("/shifts/create"))
    );
  }

  return false;
}

export function getRequiredRoleForPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) {
    return UserRole.ADMIN;
  }

  if (pathname.startsWith("/client") && !isClientPublicPath(pathname)) {
    return UserRole.CLIENT;
  }

  if (pathname.startsWith("/company") || pathname.startsWith("/shifts/create")) {
    return UserRole.COMPANY;
  }

  if (pathname.startsWith("/officer")) {
    return UserRole.OFFICER;
  }

  if (pathname === "/dashboard") {
    return null;
  }

  return null;
}

export function parseClerkMetadataRole(role: unknown): UserRole | null {
  if (
    role === UserRole.OFFICER ||
    role === UserRole.COMPANY ||
    role === UserRole.CLIENT ||
    role === UserRole.ADMIN
  ) {
    return role;
  }

  return null;
}
