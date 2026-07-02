import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import { CreateSecurityLeadForm } from "@/components/client/create-security-lead-form";
import { buttonClassName, PageShell } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function CreateClientLeadPage() {
  await requirePageRole(UserRole.CLIENT);

  return (
    <PageShell nav="client" sidebar maxWidth="2xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fo-text sm:text-3xl">
              Create Security Lead
            </h1>
            <p className="mt-1.5 text-sm text-fo-text-muted">
              Post a public security need for $5. Companies can apply after payment.
            </p>
          </div>
          <Link
            href="/client/leads"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0 self-start",
            })}
          >
            Back to Leads
          </Link>
        </div>

        <CreateSecurityLeadForm />
      </div>
    </PageShell>
  );
}
