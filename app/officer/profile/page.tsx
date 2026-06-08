import { UserRole } from "@/app/generated/prisma/enums";
import { requirePageRole } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";
import OfficerProfileForm from "./OfficerProfileForm";

export const dynamic = "force-dynamic";

export default async function OfficerProfilePage() {
  const clerkUser = await requirePageRole(UserRole.OFFICER);

  const officer = await prisma.officer.findFirst({
    where: {
      user: {
        clerkId: clerkUser.id,
      },
    },
    include: {
      licenses: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const savedLicenses =
    officer?.licenses.map((license) => ({
      licenseType: license.licenseType,
      licenseNumber: license.licenseNumber,
      issuingState: license.issuingState,
    })) ?? [];

  const initialForm = {
    firstName: officer?.firstName ?? clerkUser?.firstName ?? "",
    lastName: officer?.lastName ?? clerkUser?.lastName ?? "",
    city: officer?.city ?? "",
    state: officer?.state ?? "",
    bio: officer?.bio ?? "",
    licenses:
      savedLicenses.length > 0
        ? savedLicenses
        : [
            {
              licenseType: "",
              licenseNumber: "",
              issuingState: "",
            },
          ],
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Officer Profile</h1>

        <p className="mt-4 text-slate-300">
          Add your license, experience, location, and availability so companies
          can review your profile.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <OfficerProfileForm initialForm={initialForm} />
        </div>
      </section>
    </main>
  );
}