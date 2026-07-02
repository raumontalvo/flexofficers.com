import { headers } from "next/headers";
import { UserRole } from "@/app/generated/prisma/enums";
import { isClientPublicPath, requirePageRole } from "@/lib/page-rbac";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  if (pathname && !isClientPublicPath(pathname)) {
    await requirePageRole(UserRole.CLIENT);
  }

  return children;
}
