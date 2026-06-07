import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import CompanyProfileForm from "./CompanyProfileForm";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  const clerkUser = await currentUser();

  const company = clerkUser
    ? await prisma.company.findFirst({
        where: {
          user: {
            clerkId: clerkUser.id,
          },
        },
      })
    : null;

  const initialForm = {
    companyName: company?.companyName ?? "",
    contactName: company?.contactName ?? "",
    phone: company?.phone ?? "",
    website: company?.website ?? "",
    city: company?.city ?? "",
    state: company?.state ?? "",
    description: company?.description ?? "",
    licenseType: company?.licenseType ?? "",
    licenseNumber: company?.licenseNumber ?? "",
    licenseState: company?.licenseState ?? "",
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Company Profile</h1>

        <p className="mt-4 text-slate-300">
          Add your company details so officers can learn who they are applying
          to work with.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <CompanyProfileForm initialForm={initialForm} />
        </div>
      </section>
    </main>
  );
}