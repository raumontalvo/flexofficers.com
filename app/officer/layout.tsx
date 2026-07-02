import { UserRole } from "@/app/generated/prisma/enums";
import { requirePageRole } from "@/lib/page-rbac";

export default async function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRole(UserRole.OFFICER);

  return children;
}
