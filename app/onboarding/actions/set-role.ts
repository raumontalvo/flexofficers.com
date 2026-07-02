"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";
import { ensureCompanyOnSignup } from "@/lib/company-onboarding";
import { getRoleHomePath } from "@/lib/rbac-paths";

async function saveRole(role: UserRole) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User email not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { id: true, role: true },
  });

  if (existingUser?.role) {
    redirect(getRoleHomePath(existingUser.role));
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        role,
      },
    });

    if (role === UserRole.COMPANY) {
      await ensureCompanyOnSignup(tx, {
        userId: user.id,
        email,
        firstName: clerkUser.firstName,
      });
    }
  });

  redirect(getRoleHomePath(role));
}

export async function setOfficerRole() {
  await saveRole(UserRole.OFFICER);
}

export async function setCompanyRole() {
  await saveRole(UserRole.COMPANY);
}