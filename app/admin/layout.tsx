import { UserRole } from "@/app/generated/prisma/enums";
import { AdminShell } from "@/components/admin/admin-shell";
import { requirePageRole } from "@/lib/page-rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRole(UserRole.ADMIN);

  return <AdminShell>{children}</AdminShell>;
}
