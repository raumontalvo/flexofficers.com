import { NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const auth = await getAuthenticatedCompany();

    if ("error" in auth) {
      return NextResponse.json(
        { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
        { status: auth.error === "unauthorized" ? 401 : 403 }
      );
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: auth.clerkUser.id,
      bucket: "company-staff-add",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { officerId } = (await req.json()) as { officerId?: string };

    if (!officerId) {
      return NextResponse.json(
        { error: "officerId is required." },
        { status: 400 }
      );
    }

    const officer = await prisma.officer.findUnique({
      where: { id: officerId },
      select: { id: true },
    });

    if (!officer) {
      return NextResponse.json({ error: "Officer not found." }, { status: 404 });
    }

    const staffMember = await prisma.companyStaff.upsert({
      where: {
        companyId_officerId: {
          companyId: auth.company.id,
          officerId,
        },
      },
      update: {},
      create: {
        companyId: auth.company.id,
        officerId,
      },
      select: {
        id: true,
        officerId: true,
        addedAt: true,
      },
    });

    return NextResponse.json(staffMember);
  } catch {
    return NextResponse.json(
      { error: "Failed to add officer to staff." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await getAuthenticatedCompany();

    if ("error" in auth) {
      return NextResponse.json(
        { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
        { status: auth.error === "unauthorized" ? 401 : 403 }
      );
    }

    const { officerId } = (await req.json()) as { officerId?: string };

    if (!officerId) {
      return NextResponse.json(
        { error: "officerId is required." },
        { status: 400 }
      );
    }

    await prisma.companyStaff.deleteMany({
      where: {
        companyId: auth.company.id,
        officerId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove officer from staff." },
      { status: 500 }
    );
  }
}
