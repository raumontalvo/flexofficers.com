import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import OnboardingClient from "@/components/onboarding/OnboardingClient";
import { PageShell } from "@/components/ui";
import { ensureClientOnSignup } from "@/lib/client-onboarding";
import { getRoleHomePath } from "@/lib/rbac-paths";
import { prisma } from "@/lib/prisma";

type OnboardingPageProps = {
  searchParams?: Promise<{
    force?: string;
    role?: string;
  }>;
};

async function ensureClientRole(clerkId: string, email: string, firstName?: string | null) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, role: true },
  });

  if (existingUser?.role) {
    if (existingUser.role !== UserRole.CLIENT) {
      redirect(getRoleHomePath(existingUser.role));
    }

    await prisma.$transaction(async (tx) => {
      await ensureClientOnSignup(tx, {
        userId: existingUser.id,
        email,
        firstName,
      });
    });

    return;
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { clerkId, email, role: UserRole.CLIENT },
    });

    await ensureClientOnSignup(tx, {
      userId: user.id,
      email,
      firstName,
    });
  });
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  const forceRoleChoice = params?.force === "1";
  const selectedRole =
    params?.role === UserRole.OFFICER ||
    params?.role === UserRole.COMPANY ||
    params?.role === UserRole.CLIENT
      ? params.role
      : null;

  const clerkUser = await currentUser();

  if (selectedRole === UserRole.CLIENT && clerkUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (email) {
      await ensureClientRole(clerkUser.id, email, clerkUser.firstName);
      redirect("/client");
    }
  }

  if (clerkUser && !forceRoleChoice && !selectedRole) {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        role: true,
      },
    });

    if (user?.role === UserRole.ADMIN) {
      redirect("/admin");
    }

    if (user?.role === UserRole.CLIENT) {
      redirect("/client");
    }

    if (user?.role === UserRole.OFFICER || user?.role === UserRole.COMPANY) {
      redirect(getRoleHomePath(user.role));
    }
  }

  const onboardingRole =
    selectedRole === UserRole.OFFICER ||
    selectedRole === UserRole.COMPANY ||
    selectedRole === UserRole.CLIENT
      ? selectedRole
      : null;

  return (
    <PageShell maxWidth="full" contentClassName="!overflow-visible !pt-8 md:!pt-12 !pb-8">
      <OnboardingClient initialRole={onboardingRole} />
    </PageShell>
  );
}
