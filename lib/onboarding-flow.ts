import { UserRole } from "@/app/generated/prisma/enums";

export type OnboardingRole = "OFFICER" | "COMPANY" | "CLIENT";

export function isOnboardingRole(value: string | null | undefined): value is OnboardingRole {
  return (
    value === UserRole.OFFICER ||
    value === UserRole.COMPANY ||
    value === UserRole.CLIENT
  );
}

export function getOnboardingReturnUrl(role?: string | null) {
  if (isOnboardingRole(role)) {
    return `/onboarding?role=${role}`;
  }

  return "/onboarding";
}

export function getSignUpPath(role: OnboardingRole) {
  const base = role === UserRole.CLIENT ? "/client/sign-up" : "/sign-up";
  return `${base}?role=${role}`;
}
