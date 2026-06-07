import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import NotificationActions from "./NotificationActions";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const clerkUser = await currentUser();

  const notifications = clerkUser
    ? await prisma.notification.findMany({
        where: {
          user: {
            clerkId: clerkUser.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Notifications</h1>

        <p className="mt-4 text-slate-300">
          Track important updates about shifts, applications, and company
          decisions.
        </p>

        <div className="mt-10 grid gap-6">
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      {notification.title}
                    </h2>

                    <p className="mt-3 text-slate-300">
                      {notification.message}
                    </p>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">
                    {notification.read ? "Read" : "Unread"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {notification.createdAt.toLocaleString()}
                </p>

                <NotificationActions
                  notificationId={notification.id}
                  isRead={notification.read}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}