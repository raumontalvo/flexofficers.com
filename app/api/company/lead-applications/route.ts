import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { buildPublicLeadsWhere } from "@/lib/security-lead-data";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "company-lead-apply",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const actor = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: { company: true },
    });

    if (!actor || actor.role !== UserRole.COMPANY || !actor.company) {
      return NextResponse.json(
        { error: "Only company accounts can apply to security leads." },
        { status: 403 }
      );
    }

    const { securityLeadId, message } = await req.json();

    if (!securityLeadId) {
      return NextResponse.json(
        { error: "securityLeadId is required." },
        { status: 400 }
      );
    }

    const lead = await prisma.securityLead.findFirst({
      where: {
        id: securityLeadId,
        ...buildPublicLeadsWhere(),
      },
      include: {
        client: {
          include: { user: true },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Security lead not found or not available." },
        { status: 404 }
      );
    }

    const existing = await prisma.securityLeadApplication.findUnique({
      where: {
        securityLeadId_companyId: {
          securityLeadId,
          companyId: actor.company.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied to this lead." },
        { status: 409 }
      );
    }

    const application = await prisma.securityLeadApplication.create({
      data: {
        securityLeadId,
        companyId: actor.company.id,
        message: typeof message === "string" ? message.trim() || null : null,
      },
    });

    await createNotificationWithEmail(prisma, {
      userId: lead.client.userId,
      title: "New company application",
      message: `${actor.company.companyName} applied to your security lead "${lead.serviceNeeded}".`,
      type: "new_lead_application",
      linkUrl: `/client/leads/${lead.id}/applicants`,
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}
