import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { mapCompanyNotification } from "@/lib/company-notification-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { CompanyNotificationsBrowseList } from "./CompanyNotificationsBrowseList";

export const dynamic = "force-dynamic";

export default async function CompanyNotificationsPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      id: true,
      notifications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const notifications = (user?.notifications ?? []).map(mapCompanyNotification);

  return (
    <PageShell nav="company" maxWidth="6xl" sidebar>
      <CompanyNotificationsBrowseList notifications={notifications} />
    </PageShell>
  );
}
