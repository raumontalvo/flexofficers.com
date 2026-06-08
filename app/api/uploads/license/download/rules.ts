import { UserRole } from "@/app/generated/prisma/enums";

type DownloadActor = {
  role: keyof typeof UserRole;
  officerId?: string | null;
};

export function canAccessLicenseDocument(params: {
  actor: DownloadActor;
  licenseOfficerId: string;
}) {
  if (params.actor.role === UserRole.ADMIN) {
    return true;
  }

  if (
    params.actor.role === UserRole.OFFICER &&
    params.actor.officerId &&
    params.actor.officerId === params.licenseOfficerId
  ) {
    return true;
  }

  return false;
}
