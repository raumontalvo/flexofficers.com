import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { officerProfilePageUserSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import { resolveProfilePhotoUrl } from "@/lib/profile-photo";
import { normalizeExperienceCategories, type ArmedStatusOption } from "@/lib/profile-options";
import OfficerProfileForm from "./OfficerProfileForm";

export const dynamic = "force-dynamic";

function formatDateForInput(value: Date | null) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function createClientId(seed: string) {
  return `license-${seed}`;
}

export default async function OfficerProfilePage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: officerProfilePageUserSelect,
  });

  const officer = user?.officer;

  const initialLicenses =
    officer?.licenses && officer.licenses.length > 0
      ? officer.licenses.map((license) => ({
          clientId: createClientId(license.id),
          id: license.id,
          licenseNumber: license.licenseNumber,
          licenseType: license.licenseType,
          issuingState: license.issuingState,
          expirationDate: formatDateForInput(license.expirationDate),
        }))
      : [
          {
            clientId: createClientId("new"),
            licenseNumber: "",
            licenseType: "",
            issuingState: "",
            expirationDate: "",
          },
        ];

  const initialForm = {
    firstName: officer?.firstName ?? clerkUser?.firstName ?? "",
    lastName: officer?.lastName ?? clerkUser?.lastName ?? "",
    phone: officer?.phone ?? "",
    email: user?.email ?? clerkUser.emailAddresses[0]?.emailAddress ?? "",
    city: officer?.city ?? "",
    profilePhotoUrl: resolveProfilePhotoUrl(
      officer?.profilePhotoUrl,
      clerkUser.imageUrl
    ),
    armedStatuses: (officer?.armedStatuses ?? []) as ArmedStatusOption[],
    experienceYears:
      officer?.experienceYears !== null && officer?.experienceYears !== undefined
        ? String(officer.experienceYears)
        : "",
    licenses: initialLicenses,
    availability: officer?.availability ?? [],
    certifications: officer?.certifications ?? [],
    experienceCategories: normalizeExperienceCategories(
      officer?.experienceCategories ?? []
    ),
    introduction: officer?.introduction ?? "",
    licenseCertificationAccepted: officer?.licenseCertificationAccepted ?? false,
  };

  return (
    <PageShell nav="officer" maxWidth="xl" sidebar>
      <OfficerProfileForm initialForm={initialForm} />
    </PageShell>
  );
}
