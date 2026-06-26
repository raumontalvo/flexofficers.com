import { UserRole } from "@/app/generated/prisma/enums";
import { PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";
import { officerProfileSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";
import type { ArmedStatusOption } from "@/lib/profile-options";
import OfficerProfileForm from "./OfficerProfileForm";

export const dynamic = "force-dynamic";

function formatDateForInput(value: Date | null) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

export default async function OfficerProfilePage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    include: {
      officer: {
        select: officerProfileSelect,
      },
    },
  });

  const officer = user?.officer;

  const initialForm = {
    firstName: officer?.firstName ?? clerkUser?.firstName ?? "",
    lastName: officer?.lastName ?? clerkUser?.lastName ?? "",
    phone: officer?.phone ?? "",
    email: user?.email ?? clerkUser.emailAddresses[0]?.emailAddress ?? "",
    city: officer?.city ?? "",
    profilePhotoUrl: officer?.profilePhotoUrl ?? "",
    armedStatuses: (officer?.armedStatuses ?? []) as ArmedStatusOption[],
    experienceYears:
      officer?.experienceYears !== null && officer?.experienceYears !== undefined
        ? String(officer.experienceYears)
        : "",
    licenseExpirationDate: formatDateForInput(officer?.licenseExpirationDate ?? null),
    availability: officer?.availability ?? [],
    certifications: officer?.certifications ?? [],
    experienceCategories: officer?.experienceCategories ?? [],
    introduction: officer?.introduction ?? "",
  };

  return (
    <PageShell nav="officer" maxWidth="lg" sidebar>
      <SectionHeading
        title="Officer Profile"
        subtitle="Keep your profile ready so companies can review you."
      />

      <div className="mt-8">
        <OfficerProfileForm initialForm={initialForm} />
      </div>
    </PageShell>
  );
}
