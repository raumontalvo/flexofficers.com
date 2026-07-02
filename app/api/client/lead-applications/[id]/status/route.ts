import { NextResponse } from "next/server";
import { LeadApplicationStatus } from "@/app/generated/prisma/enums";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createNotificationWithEmail } from "@/lib/notifications/create-notification-with-email";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const auth = await getAuthenticatedClient();

    if ("error" in auth) {
      return NextResponse.json(
        { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
        { status: auth.error === "unauthorized" ? 401 : 403 }
      );
    }

    const { id: applicationId } = await context.params;
    const { status } = await req.json();

    if (
      status !== LeadApplicationStatus.ACCEPTED &&
      status !== LeadApplicationStatus.REJECTED
    ) {
      return NextResponse.json(
        { error: "Invalid status. Allowed values: ACCEPTED, REJECTED." },
        { status: 400 }
      );
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: auth.clerkUser.id,
      bucket: "client-lead-application-status",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const existing = await prisma.securityLeadApplication.findUnique({
      where: { id: applicationId },
      include: {
        securityLead: true,
        company: {
          include: { user: true },
        },
      },
    });

    if (!existing || existing.securityLead.clientId !== auth.client.id) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    if (existing.status !== LeadApplicationStatus.PENDING) {
      return NextResponse.json(
        { error: "Only pending applications can be updated." },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const application = await tx.securityLeadApplication.update({
        where: { id: applicationId },
        data: { status },
      });

      if (status === LeadApplicationStatus.ACCEPTED) {
        await tx.securityLead.update({
          where: { id: existing.securityLeadId },
          data: { status: "FILLED" },
        });
      }

      return application;
    });

    const notificationType =
      status === LeadApplicationStatus.ACCEPTED
        ? "lead_application_accepted"
        : "lead_application_rejected";

    const title =
      status === LeadApplicationStatus.ACCEPTED
        ? "Lead application accepted"
        : "Lead application rejected";

    const message =
      status === LeadApplicationStatus.ACCEPTED
        ? `Your application for "${existing.securityLead.serviceNeeded}" was accepted.`
        : `Your application for "${existing.securityLead.serviceNeeded}" was rejected.`;

    await createNotificationWithEmail(prisma, {
      userId: existing.company.userId,
      title,
      message,
      type: notificationType,
      linkUrl: `/company/lead-applications`,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update application status." },
      { status: 500 }
    );
  }
}
