import { UserRole } from "@/app/generated/prisma/enums";

const API_ROLE_PREFIXES: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/api/client", role: UserRole.CLIENT },
  { prefix: "/api/company", role: UserRole.COMPANY },
  { prefix: "/api/officer", role: UserRole.OFFICER },
  { prefix: "/api/admin", role: UserRole.ADMIN },
];

export function getRequiredApiRole(pathname: string) {
  const match = API_ROLE_PREFIXES.find(({ prefix }) => pathname.startsWith(prefix));
  return match?.role ?? null;
}
