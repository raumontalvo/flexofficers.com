import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (adminUser?.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { companyId, verified } = await req.json();

  if (!companyId) {
    return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
  }

  const company = await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      verified: Boolean(verified),
    },
  });

  return NextResponse.json(company);
}