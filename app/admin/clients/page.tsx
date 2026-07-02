import { ClientsControlCenter } from "@/components/admin/clients-control-center";
import { adminClientSelect, serializeAdminClient } from "@/lib/admin-clients";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    select: adminClientSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedClients = clients.map((client) => serializeAdminClient(client));

  return <ClientsControlCenter clients={serializedClients} />;
}
