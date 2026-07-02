import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { ensureClientOnSignup } from "@/lib/client-onboarding";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseSecurityLeadPayload } from "@/lib/security-lead-validation";
import { createSecurityLeadCheckoutSession } from "@/lib/security-lead-stripe";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "client-lead-create",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await req.json();
    const parsed = parseSecurityLeadPayload(body);

    if ("errors" in parsed) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.errors },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, role: true, email: true },
    });

    if (!existingUser?.role) {
      return NextResponse.json(
        { error: "Complete onboarding before posting a security request." },
        { status: 403 }
      );
    }

    if (existingUser.role !== UserRole.CLIENT) {
      return NextResponse.json(
        { error: "Only client accounts can post security leads." },
        { status: 403 }
      );
    }

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: { email: parsed.data.contactEmail },
    });

    const result = await prisma.$transaction(async (tx) => {
      await ensureClientOnSignup(tx, {
        userId: user.id,
        email: parsed.data.contactEmail,
        firstName: clerkUser.firstName,
      });

      const record = await tx.client.update({
        where: { userId: user.id },
        data: {
          contactName: parsed.data.contactName,
          companyName: parsed.data.companyName,
          phone: parsed.data.contactPhone,
          email: parsed.data.contactEmail,
        },
      });

      const lead = await tx.securityLead.create({
        data: {
          clientId: record.id,
          ...parsed.data,
        },
      });

      return { client: record, lead };
    });

    const checkout = await createSecurityLeadCheckoutSession({
      leadId: result.lead.id,
      clientId: result.client.id,
      clerkUserId: clerkUser.id,
      contactEmail: parsed.data.contactEmail,
    });

    if ("error" in checkout) {
      return NextResponse.json({ error: checkout.error }, { status: 503 });
    }

    return NextResponse.json({
      leadId: result.lead.id,
      checkoutUrl: checkout.url,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create security lead." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  const leads = await prisma.securityLead.findMany({
    where: { clientId: auth.client.id },
    select: {
      id: true,
      serviceNeeded: true,
      city: true,
      dateNeeded: true,
      budgetOffer: true,
      status: true,
      paymentStatus: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leads });
}
