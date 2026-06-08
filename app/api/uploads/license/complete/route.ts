import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  LicenseVerificationStatus,
  UserRole,
} from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getStorageConfig } from "@/lib/storage";
import { parseLicenseUploadPayload } from "../validation";

type CompleteUploadPayload = {
  licenseId?: unknown;
  fileName?: unknown;
  fileType?: unknown;
  fileSizeBytes?: unknown;
  objectKey?: unknown;
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
      bucket: "license-upload-complete",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const payload = (await req.json()) as CompleteUploadPayload;
    const parsed = parseLicenseUploadPayload(payload);

    if ("errors" in parsed) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.errors,
        },
        { status: 400 }
      );
    }

    const objectKey =
      typeof payload.objectKey === "string" ? payload.objectKey.trim() : "";

    if (!objectKey) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: [
            {
              field: "objectKey",
              message: "objectKey is required",
            },
          ],
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        role: true,
        officer: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || user.role !== UserRole.OFFICER || !user.officer) {
      return NextResponse.json(
        { error: "Only officer accounts can complete license uploads." },
        { status: 403 }
      );
    }

    const license = await prisma.license.findFirst({
      where: {
        id: parsed.data.licenseId,
        officerId: user.officer.id,
      },
      select: {
        id: true,
      },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License not found or you do not own this license." },
        { status: 404 }
      );
    }

    const storageConfig = getStorageConfig();
    const expectedPrefix = `${storageConfig.uploadPrefix}/${user.officer.id}/${license.id}/`;

    if (!objectKey.startsWith(expectedPrefix)) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: [
            {
              field: "objectKey",
              message: "objectKey is invalid for this license",
            },
          ],
        },
        { status: 400 }
      );
    }

    const updatedLicense = await prisma.license.update({
      where: {
        id: license.id,
      },
      data: {
        documentKey: objectKey,
        documentFileName: parsed.data.fileName,
        documentMimeType: parsed.data.fileType,
        documentSizeBytes: parsed.data.fileSizeBytes,
        documentUploadedAt: new Date(),
        verificationStatus: LicenseVerificationStatus.PENDING,
        verified: false,
        verificationNotes: null,
        verifiedAt: null,
        verifiedByUserId: null,
      },
      select: {
        id: true,
        documentKey: true,
        documentFileName: true,
        documentMimeType: true,
        documentSizeBytes: true,
        documentUploadedAt: true,
        verificationStatus: true,
        verified: true,
      },
    });

    return NextResponse.json({
      success: true,
      license: updatedLicense,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to complete license upload" },
      { status: 500 }
    );
  }
}
