"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function markAllCompanyNotificationsRead() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/dashboard");
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

  if (user?.role !== UserRole.COMPANY) {
    redirect("/dashboard");
  }

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/company/notifications");
}

export async function deleteCompanyNotification(notificationId: string) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/dashboard");
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

  if (user?.role !== UserRole.COMPANY) {
    redirect("/dashboard");
  }

  await prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId: user.id,
    },
  });

  revalidatePath("/company/notifications");
}
