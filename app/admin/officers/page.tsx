import { OfficersControlCenter } from "@/components/admin/officers-control-center";
import { serializeAdminOfficer } from "@/lib/admin-officers";
import { adminOfficerSelect } from "@/lib/officer-fields";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOfficersPage() {
  const officers = await prisma.officer.findMany({
    select: adminOfficerSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedOfficers = officers.map((officer) =>
    serializeAdminOfficer(officer)
  );

  return <OfficersControlCenter officers={serializedOfficers} />;
}
