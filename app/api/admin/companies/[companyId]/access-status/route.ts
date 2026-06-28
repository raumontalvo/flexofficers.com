import { NextResponse } from "next/server";
import { CompanyAccessStatus } from "@/app/generated/prisma/enums";
import { requireApiAdmin } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

type AccessStatusPayload = {
  action?: "mark_active" | "expire";
};

export async function POST(
  req: Request,
  context: { params: Promise<{ companyId: string }> }
) {
  const adminUser = await requireApiAdmin();

  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { companyId } = await context.params;

  let payload: AccessStatusPayload;

  try {
    payload = (await req.json()) as AccessStatusPayload;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  if (payload.action !== "mark_active" && payload.action !== "expire") {
    return NextResponse.json(
      { error: "action must be mark_active or expire" },
      { status: 400 }
    );
  }

  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const updatedCompany = await prisma.company.update({
    where: {
      id: company.id,
    },
    data: {
      accessStatus:
        payload.action === "mark_active"
          ? CompanyAccessStatus.ACTIVE
          : CompanyAccessStatus.EXPIRED,
    },
    select: {
      id: true,
      companyName: true,
      accessStatus: true,
      trialEndsAt: true,
    },
  });

  return NextResponse.json({ company: updatedCompany });
}
