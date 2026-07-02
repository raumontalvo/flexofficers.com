import { UserRole } from "@/app/generated/prisma/enums";
import { requirePageRole } from "@/lib/page-rbac";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRole(UserRole.COMPANY);

  return children;
}
