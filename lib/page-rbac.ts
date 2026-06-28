import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function requirePageRole(role: UserRole) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== role) {
    redirect("/dashboard");
  }

  return clerkUser;
}

export async function requireApiAdmin() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (user?.role !== UserRole.ADMIN) {
    return null;
  }

  return user;
}
