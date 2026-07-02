import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/generated/prisma/enums";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { ensureClientOnSignup } from "@/lib/client-onboarding";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseSecurityLeadPayload } from "@/lib/security-lead-validation";
import { createSecurityLeadCheckoutSession } from "@/lib/security-lead-stripe";
import {
  getAppUrl,
  getStripeClient,
  getStripeSecurityLeadPriceId,
} from "@/lib/stripe";

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function formatCreateLeadError(error: unknown) {
  if (isDevelopment()) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Unknown error";
  }

  return "Failed to create security lead.";
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return errorResponse("Unauthorized", 401);
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

    let body: unknown;

    try {
      body = await req.json();
    } catch (error) {
      console.error("Create Security Request Error:", error);
      return errorResponse(
        isDevelopment()
          ? error instanceof Error
            ? error.message
            : "Invalid JSON body"
          : "Invalid request payload",
        400
      );
    }

    const parsed = parseSecurityLeadPayload(body as Record<string, unknown>);

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

    if (!existingUser) {
      return errorResponse("User not found.", 404);
    }

    if (!existingUser.role) {
      return errorResponse(
        "Complete onboarding before posting a security request.",
        403
      );
    }

    if (existingUser.role !== UserRole.CLIENT) {
      return errorResponse("Only client accounts can post security leads.", 403);
    }

    const stripePriceId = getStripeSecurityLeadPriceId();

    if (!stripePriceId) {
      return errorResponse("Missing STRIPE_SECURITY_LEAD_PRICE_ID", 500);
    }

    const stripe = getStripeClient();

    if (!stripe) {
      return errorResponse("Stripe is not configured.", 503);
    }

    const appUrl = getAppUrl();

    if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
      return errorResponse("Invalid redirect URL configuration.", 500);
    }

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: { email: parsed.data.contactEmail },
    });

    const result = await prisma.$transaction(async (tx) => {
      const clientRecord = await ensureClientOnSignup(tx, {
        userId: user.id,
        email: parsed.data.contactEmail,
        firstName: clerkUser.firstName,
      });

      if (!clientRecord?.id) {
        throw new Error("Client profile could not be created.");
      }

      const clientProfile = await tx.client.findUnique({
        where: { id: clientRecord.id },
        select: { id: true },
      });

      if (!clientProfile) {
        throw new Error("Client profile not found.");
      }

      const record = await tx.client.update({
        where: { userId: user.id },
        data: {
          contactName: parsed.data.contactName,
          companyName: parsed.data.companyName,
          phone: parsed.data.contactPhone,
          email: parsed.data.contactEmail,
        },
      });

      if (!record?.id) {
        throw new Error("Client profile could not be updated.");
      }

      const lead = await tx.securityLead.create({
        data: {
          clientId: record.id,
          ...parsed.data,
        },
      });

      if (!lead?.id) {
        throw new Error("Security lead record could not be created.");
      }

      return { client: record, lead };
    });

    if (!result.client?.id) {
      return errorResponse("Client profile not found after save.", 500);
    }

    if (!result.lead?.id) {
      return errorResponse("Security lead record was not created.", 500);
    }

    const checkout = await createSecurityLeadCheckoutSession({
      leadId: result.lead.id,
      clientId: result.client.id,
      clerkUserId: clerkUser.id,
      contactEmail: parsed.data.contactEmail,
    });

    if ("error" in checkout) {
      return errorResponse(checkout.error ?? "Checkout failed", 503);
    }

    if (!checkout.url) {
      return errorResponse("Stripe checkout session URL was not returned.", 503);
    }

    return NextResponse.json({
      leadId: result.lead.id,
      checkoutUrl: checkout.url,
    });
  } catch (error) {
    console.error("Create Security Request Error:", error);

    return errorResponse(formatCreateLeadError(error), 500);
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
