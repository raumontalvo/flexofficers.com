import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  LicenseVerificationStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  buildAdminLicenseReviewData,
  hasUploadedLicenseDocument,
  isValidAdminLicenseDecision,
} from "./rules";

type ReviewPayload = {
  licenseId?: unknown;
  decision?: unknown;
  verificationNotes?: unknown;
};

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "admin-license-review",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const payload = (await req.json()) as ReviewPayload;

    const licenseId =
      typeof payload.licenseId === "string" ? payload.licenseId.trim() : "";

    if (!licenseId) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: [
            {
              field: "licenseId",
              message: "licenseId is required",
            },
          ],
        },
        { status: 400 }
      );
    }

    if (!isValidAdminLicenseDecision(payload.decision)) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: [
            {
              field: "decision",
              message: "decision must be VERIFIED or REJECTED",
            },
          ],
        },
        { status: 400 }
      );
    }

    const verificationNotes =
      typeof payload.verificationNotes === "undefined" ||
      payload.verificationNotes === null ||
      payload.verificationNotes === ""
        ? null
        : typeof payload.verificationNotes === "string"
          ? payload.verificationNotes.trim()
          : undefined;

    if (typeof verificationNotes === "undefined") {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: [
            {
              field: "verificationNotes",
              message: "verificationNotes must be a string",
            },
          ],
        },
        { status: 400 }
      );
    }

    const license = await prisma.license.findUnique({
      where: {
        id: licenseId,
      },
      select: {
        id: true,
        documentKey: true,
      },
    });

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    if (!hasUploadedLicenseDocument(license.documentKey)) {
      return NextResponse.json(
        {
          error: "License document is required before review",
        },
        { status: 400 }
      );
    }

    const reviewedLicense = await prisma.license.update({
      where: {
        id: license.id,
      },
      data: buildAdminLicenseReviewData({
        decision: payload.decision,
        verifiedByUserId: adminUser.id,
        verificationNotes,
      }),
      select: {
        id: true,
        verificationStatus: true,
        verified: true,
        verifiedAt: true,
        verifiedByUserId: true,
        verificationNotes: true,
      },
    });

    return NextResponse.json({
      success: true,
      license: reviewedLicense,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to review license" },
      { status: 500 }
    );
  }
}
