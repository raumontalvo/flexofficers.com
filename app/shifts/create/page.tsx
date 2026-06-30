import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
} from "@/components/ui";
import {
  canCompanyPostNewShifts,
  getCompanyPostingBlockMessage,
} from "@/lib/company-access";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/page-rbac";
import CreateShiftForm from "./CreateShiftForm";

export const dynamic = "force-dynamic";

export default async function CreateShiftPage() {
  const clerkUser = await requirePageRole(UserRole.COMPANY);

  const company = await prisma.company.findFirst({
    where: {
      user: {
        clerkId: clerkUser.id,
      },
    },
  });

  const canPostShifts = company ? canCompanyPostNewShifts(company) : false;
  const postingBlockMessage = company
    ? getCompanyPostingBlockMessage(company)
    : null;

  return (
    <PageShell nav="company" maxWidth="full" sidebar>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fo-text sm:text-3xl">
              Post a New Shift
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fo-text-muted">
              Fill in the details below to get your shift in front of qualified
              officers.
            </p>
          </div>

          <Link
            href="/dashboard"
            className={buttonClassName({
              variant: "secondary",
              size: "md",
              className: "shrink-0 self-start",
            })}
          >
            Back to Dashboard
          </Link>
        </div>

        {!company ? (
          <Card className="fo-glass-card border border-yellow-500/25 bg-amber-500/[0.04] p-4">
            <p className="text-sm leading-relaxed text-amber-100">
              Complete your company profile before posting shifts.
            </p>
            <Link
              href="/company/profile"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "mt-4 border-amber-500/30 text-amber-100 hover:bg-amber-500/10",
              })}
            >
              Complete Company Profile
            </Link>
          </Card>
        ) : !canPostShifts ? (
          <Card className="fo-glass-card border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-sm leading-relaxed text-fo-text">
              {postingBlockMessage ??
                "An active subscription or trial is required to post new shifts."}
            </p>
            <Link
              href="/company/billing"
              className={buttonClassName({ size: "md", className: "mt-4" })}
            >
              View Billing
            </Link>
          </Card>
        ) : (
          <CreateShiftForm />
        )}
      </div>
    </PageShell>
  );
}
