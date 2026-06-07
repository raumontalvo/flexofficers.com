import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import OfficerProfileForm from "./OfficerProfileForm";

export const dynamic = "force-dynamic";

export default async function OfficerProfilePage() {
  const clerkUser = await currentUser();

  const officer = clerkUser
    ? await prisma.officer.findFirst({
        where: {
          user: {
            clerkId: clerkUser.id,
          },
        },
        include: {
          licenses: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      })
    : null;

  const latestLicense = officer?.licenses[0];

  const initialForm = {
    firstName: officer?.firstName ?? clerkUser?.firstName ?? "",
    lastName: officer?.lastName ?? clerkUser?.lastName ?? "",
    city: officer?.city ?? "",
    state: officer?.state ?? "",
    licenseType: latestLicense?.licenseType ?? "",
    bio: officer?.bio ?? "",
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