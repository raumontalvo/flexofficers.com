"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";
import { ensureCompanyOnSignup } from "@/lib/company-onboarding";

async function saveRole(role: UserRole) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User email not found");
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { clerkId: clerkUser.id },
      update: { role, email },
      create: {
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

  redirect("/dashboard");
}

export async function setOfficerRole() {
  await saveRole(UserRole.OFFICER);
}

export async function setCompanyRole() {
  await saveRole(UserRole.COMPANY);
}