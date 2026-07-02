import { UserRole } from "@/app/generated/prisma/enums";
import { OfficerMessagesEmpty } from "@/components/officer/officer-messages-empty";
import { PageShell, SectionHeading } from "@/components/ui";
import { requirePageRole } from "@/lib/page-rbac";

export const dynamic = "force-dynamic";

export default async function ClientMessagesPage() {
  await requirePageRole(UserRole.CLIENT);

  return (
    <PageShell nav="client" maxWidth="2xl" sidebar>
      <SectionHeading
        title="Messages"
        subtitle="Company messaging will be available in a future update."
      />
      <OfficerMessagesEmpty />
    </PageShell>
  );
}
