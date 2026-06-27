"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function markAllNotificationsRead() {
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

  if (user?.role !== UserRole.OFFICER) {
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

  revalidatePath("/officer/notifications");
}

export async function deleteNotification(notificationId: string) {
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

  if (user?.role !== UserRole.OFFICER) {
    redirect("/dashboard");
  }

  await prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId: user.id,
    },
  });

  revalidatePath("/officer/notifications");
}
