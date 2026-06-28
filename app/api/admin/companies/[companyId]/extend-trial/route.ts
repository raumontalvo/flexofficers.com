import { NextResponse } from "next/server";
import { buildTrialExtensionUpdate } from "@/lib/company-trial";
import { requireApiAdmin } from "@/lib/page-rbac";
import { prisma } from "@/lib/prisma";

const PRESET_DAYS = new Set([7, 14, 30, 60, 90]);
const MAX_CUSTOM_DAYS = 365;

type ExtendTrialPayload = {
  days?: number;
  reason?: string;
};

function parseDays(value: unknown) {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return null;
  }

  if (value < 1 || value > MAX_CUSTOM_DAYS) {
    return null;
  }

  return value;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ companyId: string }> }
) {
  const adminUser = await requireApiAdmin();

  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { companyId } = await context.params;

  let payload: ExtendTrialPayload;

  try {
    payload = (await req.json()) as ExtendTrialPayload;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const days = parseDays(payload.days);

  if (!days) {
    return NextResponse.json(
      {
        error: `days must be an integer between 1 and ${MAX_CUSTOM_DAYS}`,
      },
      { status: 400 }
    );
  }

  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      id: true,
      trialEndsAt: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const now = new Date();
  const reason =
    typeof payload.reason === "string" ? payload.reason.slice(0, 500) : null;

  const updatedCompany = await prisma.company.update({
    where: {
      id: company.id,
    },
    data: buildTrialExtensionUpdate(
      company,
      days,
      adminUser.id,
      reason,
      now
    ),
    select: {
      id: true,
      companyName: true,
      accessStatus: true,
      trialEndsAt: true,
      trialExtendedAt: true,
      trialExtensionReason: true,
    },
  });

  return NextResponse.json({
    company: updatedCompany,
    preset: PRESET_DAYS.has(days),
  });
}
