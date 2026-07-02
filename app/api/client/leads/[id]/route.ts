import { NextResponse } from "next/server";
import { LeadStatus } from "@/app/generated/prisma/enums";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseSecurityLeadPayload } from "@/lib/security-lead-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  const { id } = await context.params;

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: auth.clerkUser.id,
    bucket: "client-lead-update",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const existing = await prisma.securityLead.findFirst({
    where: { id, clientId: auth.client.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const body = await req.json();
  const parsed = parseSecurityLeadPayload(body);

  if ("errors" in parsed) {
    return NextResponse.json(
      { error: "Invalid request payload", details: parsed.errors },
      { status: 400 }
    );
  }

  const lead = await prisma.securityLead.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(lead);
}

export async function DELETE(req: Request, context: RouteContext) {
  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  const { id } = await context.params;

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: auth.clerkUser.id,
    bucket: "client-lead-delete",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const existing = await prisma.securityLead.findFirst({
    where: { id, clientId: auth.client.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  await prisma.securityLead.update({
    where: { id },
    data: { status: LeadStatus.CANCELLED },
  });

  return NextResponse.json({ success: true });
}
