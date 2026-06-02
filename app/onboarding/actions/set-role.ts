"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function setRole(role: UserRole) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User email not found");
  }

  await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      role,
      email,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      role,
    },
  });

  redirect("/dashboard");
}