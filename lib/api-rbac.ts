import { NextResponse } from "next/server";
import { getRequiredApiRole } from "@/lib/api-rbac-paths";
import { requireApiRole } from "@/lib/page-rbac";

export { getRequiredApiRole } from "@/lib/api-rbac-paths";

export async function enforceApiRole(pathname: string) {
  const requiredRole = getRequiredApiRole(pathname);

  if (!requiredRole) {
    return null;
  }

  const auth = await requireApiRole(requiredRole);

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  return null;
}
