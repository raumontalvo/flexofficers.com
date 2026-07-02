import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/lib/client-auth";
import { normalizePhotoUrl } from "@/lib/clerk-photo-sync";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  parseClientNotificationPrefsPayload,
  parseClientProfilePayload,
} from "./validation";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: clerkUser.id,
    bucket: "client-profile-save",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const parsed = parseClientProfilePayload(payload);

  if ("errors" in parsed) {
    return NextResponse.json(
      { error: "Invalid request payload", details: parsed.errors },
      { status: 400 }
    );
  }

  const existingClient = await prisma.client.findUnique({
    where: { id: auth.client.id },
    select: { profilePhotoUrl: true },
  });

  const profilePhotoUrl =
    normalizePhotoUrl(
      typeof (payload as { profilePhotoUrl?: unknown }).profilePhotoUrl === "string"
        ? (payload as { profilePhotoUrl: string }).profilePhotoUrl
        : existingClient?.profilePhotoUrl ?? clerkUser.imageUrl
    ) ?? undefined;

  const [client] = await prisma.$transaction([
    prisma.client.update({
      where: { id: auth.client.id },
      data: {
        contactName: parsed.data.contactName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        companyName: parsed.data.companyName,
        industry: parsed.data.industry,
        website: parsed.data.website,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        zipCode: parsed.data.zipCode,
        country: parsed.data.country,
        profilePhotoUrl,
      },
    }),
    prisma.user.update({
      where: { id: auth.client.userId },
      data: { email: parsed.data.email },
    }),
  ]);

  return NextResponse.json(client);
}

export async function PATCH(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitResponse = enforceRateLimit({
    request: req,
    clerkUserId: clerkUser.id,
    bucket: "client-notification-prefs",
    profile: "moderate",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const auth = await getAuthenticatedClient();

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error === "unauthorized" ? "Unauthorized" : "Forbidden" },
      { status: auth.error === "unauthorized" ? 401 : 403 }
    );
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const parsed = parseClientNotificationPrefsPayload(payload);

  if ("errors" in parsed) {
    return NextResponse.json(
      { error: "Invalid request payload", details: parsed.errors },
      { status: 400 }
    );
  }

  const [client, user] = await prisma.$transaction([
    prisma.client.update({
      where: { id: auth.client.id },
      data: {
        notifyNewApplications: parsed.data.newCompanyApplications,
        notifyMessages: parsed.data.messages,
        notifyMarketing: parsed.data.marketingEmails,
      },
    }),
    prisma.user.update({
      where: { id: auth.client.userId },
      data: {
        emailNotificationsEnabled: parsed.data.emailNotifications,
      },
    }),
  ]);

  return NextResponse.json({
    notifications: {
      emailNotifications: user.emailNotificationsEnabled,
      newCompanyApplications: client.notifyNewApplications,
      messages: client.notifyMessages,
      marketingEmails: client.notifyMarketing,
    },
  });
}
