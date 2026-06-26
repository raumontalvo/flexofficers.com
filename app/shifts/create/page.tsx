import Link from "next/link";
import { UserRole } from "@/app/generated/prisma/enums";
import {
  buttonClassName,
  Card,
  PageShell,
  SectionHeading,
} from "@/components/ui";
import { isCompanySubscriptionActive } from "@/lib/company-subscription";
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

  const subscriptionActive = company
    ? isCompanySubscriptionActive(company)
    : false;

  return (
    <PageShell nav="company" maxWidth="lg">
      <SectionHeading
        title="Post a Shift"
        subtitle="Create a security shift and make it available to qualified officers."
      />

      <div className="mt-8">
        {!company ? (
          <Card className="border-yellow-500/20 bg-fo-pending-bg">
            <p className="text-sm leading-relaxed text-fo-pending">
              Complete your company profile before posting shifts.
            </p>
            <Link
              href="/company/profile"
              className={buttonClassName({
                variant: "secondary",
                size: "md",
                className: "mt-5 border-yellow-500/30 text-fo-pending hover:bg-yellow-500/10",
              })}
            >
              Complete Company Profile
            </Link>
          </Card>
        ) : !subscriptionActive ? (
          <Card className="border-blue-500/20 bg-blue-500/10">
            <p className="text-base leading-relaxed text-fo-text">
              An active annual subscription is required to post new shifts.
            </p>
            <Link
              href="/company/billing"
              className={buttonClassName({ size: "md", className: "mt-5" })}
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
