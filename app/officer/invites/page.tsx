import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { isInviteNotification, mapOfficerInvite } from "@/lib/officer-invite-data";
import { mapOfficerNotification } from "@/lib/officer-notification-data";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import { InvitesBrowseList } from "./InvitesBrowseList";

export const dynamic = "force-dynamic";

export default async function OfficerInvitesPage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      officer: {
        select: {
          shiftInvites: {
            orderBy: {
              invitedAt: "desc",
            },
            select: {
              id: true,
              status: true,
              invitedAt: true,
              respondedAt: true,
              shift: {
                select: {
                  id: true,
                  title: true,
                  hourlyRate: true,
                  location: true,
                  city: true,
                  state: true,
                  startTime: true,
                  endTime: true,
                  company: {
                    select: {
                      companyName: true,
                      logoUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      notifications: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },
    },
  });

  const invites = (user?.officer?.shiftInvites ?? []).map(mapOfficerInvite);
  const inviteNotifications = (user?.notifications ?? [])
    .filter(isInviteNotification)
    .map(mapOfficerNotification);

  return (
    <PageShell nav="officer" maxWidth="6xl" sidebar>
      <InvitesBrowseList
        invites={invites}
        inviteNotifications={inviteNotifications}
      />
    </PageShell>
  );
}
