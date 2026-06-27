import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { mapOfficerNotification } from "@/lib/officer-notification-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { NotificationsBrowseList } from "./NotificationsBrowseList";

export const dynamic = "force-dynamic";

export default async function OfficerNotificationsPage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

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

  const notifications = (user?.notifications ?? []).map(mapOfficerNotification);

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar>
      <NotificationsBrowseList notifications={notifications} />
    </PageShell>
  );
}
